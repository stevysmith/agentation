import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { spawn } from "node:child_process";
import type { SyncPayload, ServerConfig, PageFeedback } from "./types.js";

const BURST_POLL_INTERVAL_MS = 2000;

// Simple in-memory store for burst mode
const store = new Map<string, PageFeedback>();

// SSE clients for broadcasting events
const sseClients = new Set<ServerResponse>();

function broadcastEvent(event: string, data: Record<string, unknown>) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(message);
  }
}

function getTotalCount(): number {
  let count = 0;
  for (const page of store.values()) {
    count += page.annotations.length;
  }
  return count;
}

function formatFeedbackMarkdown(pages: PageFeedback[]): string {
  if (pages.length === 0) {
    return "No pending page feedback.";
  }

  const lines: string[] = ["# Page Feedback\n"];

  for (const page of pages) {
    if (page.annotations.length === 0) continue;

    lines.push(`## ${page.pathname}`);
    lines.push(`**URL:** ${page.url}`);
    if (page.viewport) {
      lines.push(`**Viewport:** ${page.viewport.width}x${page.viewport.height}`);
    }
    lines.push("");

    for (let i = 0; i < page.annotations.length; i++) {
      const ann = page.annotations[i];
      lines.push(`### ${i + 1}. ${ann.element}`);
      lines.push(`**Location:** ${ann.elementPath}`);
      if (ann.cssClasses) {
        lines.push(`**Classes:** ${ann.cssClasses}`);
      }
      if (ann.selectedText) {
        lines.push(`**Selected text:** "${ann.selectedText}"`);
      }
      if (ann.fullPath) {
        lines.push(`**Full path:** ${ann.fullPath}`);
      }
      lines.push(`**Feedback:** ${ann.comment}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

/**
 * Find the Claude CLI executable
 */
function findClaudePath(): string {
  // Check common locations, fall back to PATH
  const candidates = [
    process.env.CLAUDE_PATH, // Allow override via env var
    "/opt/homebrew/bin/claude", // macOS Homebrew (Apple Silicon)
    "/usr/local/bin/claude", // macOS Homebrew (Intel) / Linux
    "claude", // Fall back to PATH
  ].filter(Boolean) as string[];

  return candidates[0];
}

/**
 * Run Claude Code CLI with the given prompt
 */
function runClaudeCode(prompt: string): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    console.log("\n🤖 Invoking Claude Code...\n");

    const claudePath = findClaudePath();
    // Use --permission-mode bypassPermissions for automated operation
    // Users should ensure they trust the feedback source before using burst mode
    const child = spawn(claudePath, ["--print", "--continue", "--permission-mode", "bypassPermissions", prompt], {
      stdio: ["inherit", "inherit", "inherit"],
      env: process.env,
      cwd: process.cwd(),
      shell: claudePath === "claude", // Use shell if relying on PATH
    });

    child.on("close", (code) => {
      console.log(`\n✓ Claude Code finished (exit code: ${code})\n`);
      resolve({
        success: code === 0,
        output: "",
      });
    });

    child.on("error", (err) => {
      console.error("\n✗ Failed to run Claude Code:", err.message);
      resolve({
        success: false,
        output: err.message,
      });
    });
  });
}

/**
 * Create HTTP server for receiving annotations
 */
function createHttpServer(port: number, verbose: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || "/", `http://localhost:${port}`);

      // Health check
      if (req.method === "GET" && url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", mode: "burst", annotations: getTotalCount() }));
        return;
      }

      // SSE endpoint
      if (req.method === "GET" && url.pathname === "/events") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(`event: connected\ndata: ${JSON.stringify({ status: "ok", mode: "burst" })}\n\n`);
        sseClients.add(res);
        req.on("close", () => sseClients.delete(res));
        return;
      }

      // Receive annotations
      if (req.method === "POST" && url.pathname === "/sync") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const payload: SyncPayload = JSON.parse(body);
            store.set(payload.pathname, {
              url: payload.url,
              pathname: payload.pathname,
              viewport: payload.viewport,
              userAgent: payload.userAgent,
              annotations: payload.annotations,
              timestamp: Date.now(),
            });

            console.log(`📝 Received ${payload.annotations.length} annotation(s) for ${payload.pathname}`);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON" }));
          }
        });
        return;
      }

      // Get feedback
      if (req.method === "GET" && url.pathname === "/feedback") {
        const data = Array.from(store.values());
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
        return;
      }

      // Burst status - always active in burst mode
      if (req.method === "GET" && url.pathname === "/burst/status") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ active: true }));
        return;
      }

      // 404
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`\n✗ Port ${port} is already in use.`);
        console.error("  Another instance may be running, or the MCP server is active.\n");
        reject(new Error(`Port ${port} in use`));
      } else {
        reject(err);
      }
    });

    server.listen(port, () => {
      if (verbose) {
        console.log(`HTTP server listening on port ${port}`);
      }
      resolve();
    });
  });
}

/**
 * The burst loop - polls for feedback and processes batches
 */
async function burstLoop(): Promise<void> {
  while (true) {
    const totalCount = getTotalCount();

    if (totalCount > 0) {
      console.log(`\n📋 Found ${totalCount} annotation(s). Collecting batch...`);
      broadcastEvent("burst", { status: "collecting", count: totalCount });

      // Wait for batch to accumulate with countdown
      for (let i = 10; i > 0; i--) {
        const currentCount = getTotalCount();
        process.stdout.write(`\r⏳ Processing in ${i}s... (${currentCount} annotation${currentCount !== 1 ? "s" : ""})  `);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      console.log("\r✓ Batch window closed.                              ");

      // Get all feedback
      const pages = Array.from(store.values()).filter((p) => p.annotations.length > 0);

      if (pages.length > 0) {
        const annotationCount = pages.reduce((sum, p) => sum + p.annotations.length, 0);
        console.log(`\n🚀 Processing batch: ${annotationCount} annotation(s) from ${pages.length} page(s)`);

        // Show what we're sending to Claude
        console.log("\n┌─ Feedback Summary ─────────────────────────────────────────");
        for (const page of pages) {
          console.log(`│ 📄 ${page.pathname}`);
          for (const ann of page.annotations) {
            const truncatedComment = ann.comment.length > 60
              ? ann.comment.slice(0, 57) + "..."
              : ann.comment;
            console.log(`│    • ${ann.element}: "${truncatedComment}"`);
          }
        }
        console.log("└────────────────────────────────────────────────────────────\n");

        broadcastEvent("burst", { status: "processing" });

        // Format feedback for Claude
        const markdown = formatFeedbackMarkdown(pages);
        const prompt = `IMPORTANT: You are in burst mode receiving live UI feedback. These are real issues that need actual code changes.

${markdown}

Instructions:
1. For each annotation, find the relevant source file in the codebase
2. Make the actual code changes using your Edit tool
3. Do NOT just describe what needs to be done - actually edit the files
4. After making changes, briefly confirm what you modified

This is NOT a test or simulation. Make the real code changes now.`;

        // Run Claude
        const result = await runClaudeCode(prompt);

        // Clear feedback regardless of result
        store.clear();
        broadcastEvent("clear", { all: true });

        if (result.success) {
          console.log("✓ Batch complete. Feedback cleared.\n");
        } else {
          console.log("⚠ Claude encountered an issue, but feedback has been cleared.\n");
        }

        broadcastEvent("burst", { status: "active" });
        console.log("👀 Watching for more annotations...\n");
      }
    }

    // Poll interval
    await new Promise((resolve) => setTimeout(resolve, BURST_POLL_INTERVAL_MS));
  }
}

/**
 * Start standalone burst mode
 */
export async function startBurstMode(config: Partial<ServerConfig> = {}): Promise<void> {
  const { httpPort = 4242, verbose = false } = config;

  // Start HTTP server
  await createHttpServer(httpPort, verbose);

  // Broadcast that burst mode is active
  broadcastEvent("burst", { status: "active" });

  // Start the burst loop (runs forever)
  await burstLoop();
}
