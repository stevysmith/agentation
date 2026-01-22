/**
 * @agentation/claude
 *
 * Claude Code integration for Agentation - MCP server for syncing page feedback
 *
 * Usage as CLI (recommended):
 *   claude mcp add agentation -- npx @agentation/claude
 *
 * Usage with burst mode:
 *   npx @agentation/claude --burst
 *
 * Usage programmatically:
 *   import { startServer, startBurstMode } from '@agentation/claude';
 *   await startServer({ httpPort: 4242 });
 *   // or
 *   await startBurstMode({ httpPort: 4242 });
 */

export { startServer } from "./server.js";
export { startBurstMode } from "./burst.js";
export { store } from "./store.js";
export type {
  Annotation,
  PageFeedback,
  SyncPayload,
  ServerConfig,
} from "./types.js";
