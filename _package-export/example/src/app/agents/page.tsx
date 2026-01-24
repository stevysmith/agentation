"use client";

import { Footer } from "../Footer";
import { CodeBlock } from "../components/CodeBlock";

function ToolName({ children }: { children: string }) {
  return (
    <h3 style={{ fontFamily: "'SF Mono', monospace", fontSize: "0.75rem", letterSpacing: "-0.01em" }}>
      {children}
    </h3>
  );
}

export default function AgentsPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>Agent Integration</h1>
          <p className="tagline">
            Connect AI agents to structured annotations via MCP, hooks, or webhooks
          </p>
        </header>

        <section>
          <h2 id="quick-start">Quick Start</h2>
          <p>
            Start the server in your project directory:
          </p>
          <CodeBlock
            language="bash"
            copyable
            code={`npx agentation server`}
          />
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.75rem" }}>
            This starts both the MCP server (for agents) and HTTP server (for the browser toolbar).
            The toolbar connects automatically when the server is running.
          </p>
        </section>

        <section>
          <h2 id="why-structured-feedback">Why Structured Feedback?</h2>
          <p>
            When a user clicks a misaligned button to report it, your agent receives the exact
            component path (<code>ProductPage &gt; AddToCartButton</code>), its CSS state,
            bounding box, and what&apos;s wrong &mdash; no guessing from vague chat descriptions.
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", marginTop: "1rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", width: "50%", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>
                  Chat-based feedback
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>
                  Agentation
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>
                  &quot;The button on the product page is broken&quot;
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>
                  Element, path, component, styles, position
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>
                  Ephemeral &mdash; lost after session
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>
                  Persistent until resolved
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)" }}>
                  No priority system
                </td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)" }}>
                  Intent + severity for prioritization
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 id="how-it-works">How It Works</h2>
          <ol style={{ paddingLeft: "1.25rem" }}>
            <li><strong>Reviewer</strong> clicks an element and adds feedback in the browser</li>
            <li><strong>Browser</strong> captures element context and syncs to server (HTTP)</li>
            <li><strong>Agent</strong> polls for pending annotations via MCP or hook</li>
            <li><strong>Agent</strong> acknowledges, fixes the code, then resolves</li>
            <li><strong>Reviewer</strong> sees status update, can reopen if needed</li>
          </ol>
        </section>

        <section>
          <h2 id="annotation-lifecycle">Annotation Lifecycle</h2>
          <p style={{ fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.7)" }}>
            pending → acknowledged → resolved | dismissed
          </p>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem" }}>
            Reviewers can reopen resolved annotations if the fix didn&apos;t work.
          </p>

          <h3 style={{ marginTop: "1.5rem" }}>Agent Actions</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", marginTop: "0.75rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Action</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Tool</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Reviewer sees</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Start working</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>acknowledge</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>&ldquo;Agent is working on this&rdquo;</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Ask question</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>reply</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Message in thread</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Mark done</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>resolve</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>&ldquo;Resolved&rdquo; + optional summary</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)" }}>Decline</td>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>dismiss</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)" }}>&ldquo;Dismissed&rdquo; + reason</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 id="two-way-communication">Two-Way Communication</h2>
          <p>
            Agents can ask clarifying questions using the <code>reply</code> tool. The reviewer sees
            the message in the annotation thread and can respond.
          </p>
          <CodeBlock
            language="typescript"
            code={`// Agent needs more context
await agentation_reply({
  annotationId: "ann_123",
  message: "Should this button be primary (filled) or secondary (outlined)?"
});

// Later, check for replies
const session = await agentation_get_session({ sessionId: "sess_abc" });
const annotation = session.annotations.find(a => a.id === "ann_123");

// annotation.thread contains all messages
annotation.thread.forEach(msg => {
  console.log(\`[\${msg.author}]: \${msg.message}\`);
});`}
          />
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.75rem" }}>
            The thread pattern keeps context tied to specific feedback, making it easier to track
            conversations about individual issues.
          </p>
        </section>

        <section>
          <h2 id="annotation-data">Annotation Data</h2>
          <p>
            Each annotation includes rich context about the targeted element:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", marginTop: "1rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Field</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Description</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>comment</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>The reviewer&apos;s feedback text</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>element</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>HTML tag and text preview (e.g., &ldquo;button: Add to Cart&rdquo;)</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>elementPath</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>CSS selector path to the element</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>reactComponents</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>React component tree (if detected)</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>intent</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>What the reviewer wants: fix, enhancement, question, other</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>severity</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Priority: blocking, important, minor, cosmetic</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>status</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Current state: pending, acknowledged, resolved, dismissed</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>thread</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)" }}>Array of messages for back-and-forth discussion</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.75rem" }}>
            Use <code>reactComponents</code> to locate the source file quickly. Combined with <code>intent</code> and <code>severity</code>,
            agents can prioritize and route feedback intelligently. See the <a href="/schema">Agentation Format</a> for
            the full schema specification.
          </p>
        </section>

        <section>
          <h2 id="workflow-patterns">Workflow Patterns</h2>
          <p>Common patterns for handling different types of feedback:</p>

          <h3 style={{ marginTop: "1.25rem" }}>Quick Fix</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            For straightforward issues the agent can fix immediately.
          </p>
          <CodeBlock
            language="typescript"
            code={`// 1. Acknowledge so reviewer knows you're on it
await agentation_acknowledge({ annotationId });

// 2. Fix the code
// ... make changes ...

// 3. Resolve with summary
await agentation_resolve({
  annotationId,
  summary: "Fixed padding on mobile breakpoint"
});`}
          />

          <h3 style={{ marginTop: "1.5rem" }}>Needs Clarification</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            When the feedback is ambiguous or requires design input.
          </p>
          <CodeBlock
            language="typescript"
            code={`// 1. Acknowledge
await agentation_acknowledge({ annotationId });

// 2. Ask for clarification
await agentation_reply({
  annotationId,
  message: "I can fix the spacing. Should it match the header (24px) or sidebar (16px)?"
});

// 3. Wait for response, then check back later
const pending = await agentation_get_pending({ sessionId });
const annotation = pending.annotations.find(a => a.id === annotationId);
if (annotation.thread.length > 1) {
  // Reviewer replied, continue with fix
}`}
          />

          <h3 style={{ marginTop: "1.5rem" }}>Won&apos;t Fix</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            When the request can&apos;t or shouldn&apos;t be implemented.
          </p>
          <CodeBlock
            language="typescript"
            code={`// Dismiss with clear explanation
await agentation_dismiss({
  annotationId,
  reason: "This is intentional - the button is disabled until form validation passes"
});`}
          />
        </section>

        <section>
          <h2 id="agent-mode">Agent Mode</h2>
          <p>
            The toolbar adapts to your setup. Open Settings (gear icon) and set your <strong>Agent Mode</strong>:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", marginTop: "1rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Mode</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>Sync button</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>How it works</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Claude Code</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "#34c759", fontSize: "0.6875rem", fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z" />
                      <path d="M15 10L11 14.25L9.25 12.25" />
                    </svg>
                    Auto-synced
                  </span>
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Annotations sync when you message Claude</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Manual</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "rgba(0,0,0,0.5)", fontSize: "0.6875rem", fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 22 21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.5 5H6.5C4.84315 5 3.5 6.34315 3.5 8V15C3.5 16.6569 4.84315 18 6.5 18H13.5C15.1569 18 16.5 16.6569 16.5 15V12" />
                      <path d="M13.5 8.5L18.5 3.5M18.5 3.5L14.4524 3.5M18.5 3.5L18.5 7.54762" />
                      <path d="M7.5 13.75H12.5" />
                      <path d="M7.5 10.75H10.5" />
                    </svg>
                    Send to agent
                  </span>
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" }}>Click to send to your agent (Cursor, etc.)</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)" }}>Custom</td>
                <td style={{ padding: "0.375rem 0" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "rgba(0,0,0,0.5)", fontSize: "0.6875rem", fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 22 21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.5 5H6.5C4.84315 5 3.5 6.34315 3.5 8V15C3.5 16.6569 4.84315 18 6.5 18H13.5C15.1569 18 16.5 16.6569 16.5 15V12" />
                      <path d="M13.5 8.5L18.5 3.5M18.5 3.5L14.4524 3.5M18.5 3.5L18.5 7.54762" />
                      <path d="M7.5 13.75H12.5" />
                      <path d="M7.5 10.75H10.5" />
                    </svg>
                    Trigger webhooks
                  </span>
                </td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)" }}>Click to trigger configured webhooks</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "1.5rem" }}>Button states</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            The button shows different states depending on your mode and what happens when clicked:
          </p>
          <ul style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            <li><strong style={{ color: "#34c759" }}>Green (auto-synced)</strong> &mdash; Claude Code mode, syncs automatically via hook</li>
            <li><strong>Badge with count</strong> &mdash; Number of pending annotations (Manual/Custom modes)</li>
            <li><strong>&ldquo;Sent!&rdquo;</strong> &mdash; Successfully delivered to SSE listeners or webhooks</li>
            <li><strong>&ldquo;No listeners&rdquo;</strong> &mdash; Clicked but nothing was listening (no SSE connections or webhooks)</li>
          </ul>
        </section>

        <section>
          <h2 id="claude-code">Claude Code Setup</h2>
          <p>
            Claude Code uses a hook that checks for pending annotations on every message you send.
            No button click needed &mdash; just annotate and talk to Claude.
          </p>

          <h3>How it works</h3>
          <ol style={{ paddingLeft: "1.25rem", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            <li>Set Agent Mode to &ldquo;Claude Code&rdquo; in toolbar settings</li>
            <li>Annotate elements in your browser</li>
            <li>Send any message to Claude Code</li>
            <li>The hook auto-injects your annotations</li>
            <li>Claude sees them and acts</li>
          </ol>

          <h3>1. Start the server</h3>
          <CodeBlock code="npx agentation server" language="bash" copyable />

          <h3>2. Add the hook</h3>
          <p>
            Add this to your project&apos;s <code>.claude/settings.local.json</code>:
          </p>
          <CodeBlock
            code={`{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -sf --connect-timeout 1 http://localhost:4747/pending 2>/dev/null | python3 -c \\"import sys,json;d=json.load(sys.stdin);c=d['count'];exit(0)if c==0 else[print(f'\\\\n=== AGENTATION: {c} UI annotations ===\\\\n'),*[print(f\\\\\\"[{i+1}] {a['element']}\\\\n    {a['comment']}\\\\n\\\\\\")for i,a in enumerate(d['annotations'])],print('=== END ===\\\\n')]\\" 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}`}
            language="json"
          />
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.75rem" }}>
            Restart Claude Code after adding the hook. The hook silently exits if the server isn&apos;t running.
          </p>

          <h3>3. Use it</h3>
          <ol style={{ paddingLeft: "1.25rem", fontSize: "0.875rem" }}>
            <li>Annotate elements in your browser</li>
            <li>Send any message to Claude Code</li>
            <li>Claude sees your annotations and acts on them</li>
          </ol>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.75rem" }}>
            In Claude Code mode, the sync button turns green to indicate auto-sync is active.
            No clicking required &mdash; just annotate and talk to Claude.
          </p>
        </section>

        <section>
          <h2 id="cursor-windsurf">Cursor &amp; Windsurf Setup</h2>
          <p>
            For MCP-compatible editors like Cursor and Windsurf, the agent can use the
            <code>agentation_wait_for_action</code> tool to block until you click &ldquo;Send to Agent&rdquo;.
          </p>

          <h3>1. Configure MCP</h3>
          <p>Add Agentation to your MCP config:</p>
          <CodeBlock
            code={`{
  "mcpServers": {
    "agentation": {
      "command": "npx",
      "args": ["agentation", "server"]
    }
  }
}`}
            language="json"
            copyable
          />

          <h3>2. Agent workflow</h3>
          <p>
            The agent calls <code>agentation_wait_for_action</code> which blocks for up to 60 seconds.
            When you click the button, it returns immediately with all annotations.
          </p>
          <CodeBlock
            code={`// Agent's internal workflow
const result = await agentation_wait_for_action({ timeoutSeconds: 60 });

if (result.action) {
  // User clicked "Send to Agent"
  const annotations = result.action.annotations;
  // Process annotations...
}`}
            language="typescript"
          />
        </section>

        <section>
          <h2 id="webhooks">Webhooks</h2>
          <p>
            For custom integrations, configure webhooks to receive a POST request when &ldquo;Send to Agent&rdquo; is clicked.
          </p>

          <h3>Configure via environment</h3>
          <CodeBlock
            code={`# Single webhook
AGENTATION_WEBHOOK_URL=https://your-server.com/webhook

# Multiple webhooks
AGENTATION_WEBHOOKS=https://hook1.com,https://hook2.com`}
            language="bash"
          />

          <h3>Webhook payload</h3>
          <CodeBlock
            code={`{
  "sessionId": "abc123",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "annotations": [
    {
      "id": "ann-1",
      "element": "<Button> Add to Cart",
      "comment": "Make this more prominent",
      "intent": "enhancement",
      "severity": "medium"
    }
  ],
  "output": "Markdown-formatted annotation list"
}`}
            language="json"
          />
        </section>

        <section>
          <h2 id="mcp-tools">MCP Tools</h2>
          <p>
            Seven tools are available via the <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">Model Context Protocol</a>:
          </p>

          <ToolName>agentation_list_sessions</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            List all active annotation sessions. Use this to discover which pages have feedback.
          </p>

          <ToolName>agentation_get_session</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Get a session with all its annotations. Input: <code>sessionId</code>
          </p>

          <ToolName>agentation_get_pending</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Get annotations waiting for attention. Input: <code>sessionId</code>
          </p>
          <CodeBlock
            language="json"
            code={`// Response
{
  "count": 1,
  "annotations": [{
    "id": "ann_123",
    "comment": "Button is cut off on mobile",
    "element": "button",
    "elementPath": "body > main > .hero > button.cta",
    "reactComponents": "App > LandingPage > HeroSection > Button",
    "intent": "fix",
    "severity": "blocking"
  }]
}`}
          />

          <ToolName>agentation_get_all_pending</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Get all unresolved annotations across all sessions. Used by Claude Code hook.
          </p>

          <ToolName>agentation_wait_for_action</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Block until &ldquo;Send to Agent&rdquo; is clicked (max 60s). For Cursor/Windsurf workflows.
          </p>

          <ToolName>agentation_acknowledge</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Mark as seen. Lets the reviewer know you&apos;re working on it. Input: <code>annotationId</code>
          </p>

          <ToolName>agentation_resolve</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Mark as done after fixing. Input: <code>annotationId</code>, optional <code>summary</code>.
          </p>

          <ToolName>agentation_dismiss</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Decline to address, with a reason. Input: <code>annotationId</code>, <code>reason</code>
          </p>

          <ToolName>agentation_reply</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Ask a clarifying question or send an update. Input: <code>annotationId</code>, <code>message</code>
          </p>
        </section>

        <section>
          <h2 id="example-workflow">Example Workflow</h2>
          <CodeBlock
            language="typescript"
            code={`// 1. Agent checks for feedback
const pending = await agentation_get_pending({ sessionId: "sess_abc" });
// → 1 annotation: "Button is cut off on mobile" (blocking)

// 2. Agent acknowledges
await agentation_acknowledge({ annotationId: "ann_123" });
// Reviewer sees: "Agent is working on this"

// 3. Agent fixes the code
// ... edits Button.tsx to fix mobile padding ...

// 4. Agent resolves
await agentation_resolve({
  annotationId: "ann_123",
  summary: "Added responsive padding for mobile viewports"
});
// Reviewer sees: "Resolved by agent"`}
          />
        </section>

        <section>
          <h2 id="http-api">HTTP API</h2>
          <p>
            The browser component syncs annotations via HTTP. The server exposes:
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", marginTop: "1rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", width: "4rem", fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.4)" }}>
                  GET
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                  /pending
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  All pending annotations (used by CC hook)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.4)" }}>
                  GET
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                  /status
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Server status (SSE listeners, webhooks)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.4)" }}>
                  GET
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                  /sessions
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  List all sessions
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.4)" }}>
                  POST
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                  /sessions/:id/action
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Trigger &ldquo;Send to Agent&rdquo; programmatically
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.4)" }}>
                  GET
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                  /sessions/:id/pending
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Get pending annotations only
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.4)" }}>
                  GET
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                  /events
                </td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  SSE stream of all events
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.8125rem", color: "rgba(0,0,0,0.4)" }}>
                  GET
                </td>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                  /sessions/:id/events
                </td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  SSE stream for specific session
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.75rem" }}>
            The React component handles this automatically when you set the <code>endpoint</code> prop.
          </p>
        </section>

        <section>
          <h2 id="real-time-events">Real-Time Events (SSE)</h2>
          <p>
            Subscribe to real-time events via Server-Sent Events:
          </p>
          <CodeBlock
            language="bash"
            code={`# Session-level: events for a single page
curl -N http://localhost:4747/sessions/:id/events

# Site-level: events across ALL pages for a domain
curl -N "http://localhost:4747/events?domain=localhost:3001"

# Reconnect after disconnect (replay missed events)
curl -N -H "Last-Event-ID: 42" http://localhost:4747/sessions/:id/events`}
          />
          <p style={{ marginTop: "0.75rem" }}>
            Events are wrapped in the <a href="/schema">AgentationEvent envelope</a>:
          </p>
          <CodeBlock
            language="typescript"
            code={`event: annotation.created
id: 42
data: {"type":"annotation.created","sessionId":"sess_abc","sequence":42,"payload":{...}}`}
          />
          <p style={{ marginTop: "0.75rem" }}>
            <strong>Event types:</strong>
          </p>
          <ul style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)", marginTop: "0.25rem" }}>
            <li><code>annotation.created</code> &mdash; New annotation added</li>
            <li><code>annotation.updated</code> &mdash; Annotation modified (comment, status, etc.)</li>
            <li><code>annotation.deleted</code> &mdash; Annotation removed</li>
            <li><code>session.created</code> &mdash; New session started</li>
            <li><code>action.requested</code> &mdash; &ldquo;Send to Agent&rdquo; clicked</li>
            <li><code>thread.message</code> &mdash; New message in annotation thread</li>
          </ul>
        </section>

        <section>
          <h2 id="persistence">Persistence</h2>
          <p>
            Sessions and annotations persist to SQLite by default:
          </p>
          <CodeBlock
            language="bash"
            code={`~/.agentation/store.db   # SQLite database`}
          />
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem" }}>
            Set <code>AGENTATION_STORE=memory</code> to use in-memory storage (no persistence).
          </p>
        </section>
      </article>

      <Footer />
    </>
  );
}
