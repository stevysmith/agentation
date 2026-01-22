import { startServer } from "./server.js";
import { startBurstMode } from "./burst.js";

const args = process.argv.slice(2);

// Parse CLI arguments
const portIndex = args.indexOf("--port");
const port = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) : 4242;
const verbose = args.includes("--verbose") || args.includes("-v");
const burstMode = args.includes("--burst");
const helpRequested = args.includes("--help") || args.includes("-h");

if (helpRequested) {
  console.log(`
Agentation Claude Integration

Usage:
  npx @agentation/claude [options]

Options:
  --port <number>   HTTP server port (default: 4242)
  --verbose, -v     Enable verbose logging
  --burst           Run in standalone burst mode (auto-processes feedback)
  --help, -h        Show this help message

Modes:
  Default (MCP):    Run as MCP server for Claude Code integration
                    claude mcp add agentation -- npx @agentation/claude

  Burst mode:       Standalone loop that auto-invokes Claude to fix feedback
                    npx @agentation/claude --burst
`);
  process.exit(0);
}

if (burstMode) {
  // Standalone burst mode - doesn't need MCP, invokes Claude directly
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│  AGENTATION BURST MODE                                      │
│                                                             │
│  HTTP server: http://localhost:${port.toString().padEnd(5)}                       │
│  Batch delay: 10 seconds                                    │
│                                                             │
│  Waiting for annotations...                                 │
│  Press Ctrl+C to stop                                       │
└─────────────────────────────────────────────────────────────┘
`);

  startBurstMode({ httpPort: port, verbose }).catch((err) => {
    console.error("[agentation] Fatal error:", err);
    process.exit(1);
  });
} else {
  // MCP mode - run as Claude Code MCP server
  console.error(`
Agentation Claude Integration
==============================
HTTP server: http://localhost:${port}
MCP server:  stdio (connected to Claude Code)
`);

  startServer({ httpPort: port, verbose }).catch((err) => {
    console.error("[agentation] Fatal error:", err);
    process.exit(1);
  });
}
