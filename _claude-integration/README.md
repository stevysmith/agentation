# @agentation/claude

Claude Code integration for [Agentation](https://agentation.dev) - sync page feedback directly to Claude Code via MCP.

## Setup

### 1. Add the MCP server to Claude Code

```bash
claude mcp add agentation -- npx @agentation/claude
```

That's it! The server will auto-start when you launch Claude Code.

### 2. Configure Agentation in your app

```tsx
import { Agentation } from 'agentation';

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && (
        <Agentation serverUrl="http://localhost:4242" />
      )}
    </>
  );
}
```

## Usage

1. **Start Claude Code** - the MCP server starts automatically
2. **Browse your app** and annotate issues with Agentation
3. **Tell Claude** to check your feedback:
   - "Check my page feedback"
   - "What UI issues do I have?"
   - "Fix the issues on /dashboard"

Claude will query the MCP server and see your structured annotations.

## How it works

```
Browser (your app)           Your Machine              Claude Code
     │                           │                         │
     │ POST localhost:4242       │                         │
     └──────────────────────────►│ HTTP Server             │
                                 │     │                   │
                                 │     ▼                   │
                                 │ In-Memory Store         │
                                 │     │                   │
                                 │ MCP Server ◄────────────┘
                                 │ (stdio)      MCP Protocol
```

- **HTTP Server** (port 4242): Receives annotations from browser
- **MCP Server** (stdio): Exposes tools to Claude Code
- **Shared Store**: In-memory, cleared when server restarts

## Burst Mode

Burst mode enables continuous, hands-free feedback processing. Run it in a separate terminal:

```bash
npx @agentation/claude --burst
```

**How it works:**
1. Start burst mode in a terminal
2. Browse your app and annotate issues
3. Every 10 seconds, accumulated feedback is batched
4. Claude is automatically invoked to fix the issues
5. Feedback clears, loop continues
6. Press Ctrl+C to stop

```
┌─────────────────────────────────────────────────────────────┐
│  AGENTATION BURST MODE                                      │
│                                                             │
│  HTTP server: http://localhost:4242                         │
│  Batch delay: 10 seconds                                    │
│                                                             │
│  Waiting for annotations...                                 │
│  Press Ctrl+C to stop                                       │
└─────────────────────────────────────────────────────────────┘

📋 Found 3 annotation(s). Waiting 10s for more...

🚀 Processing batch: 3 annotation(s) from 1 page(s)

🤖 Invoking Claude Code...
   [Claude works on the fixes...]

✓ Claude Code finished (exit code: 0)
✓ Batch complete. Feedback cleared.

👀 Watching for more annotations...
```

**Note:** Burst mode runs separately from Claude Code's MCP integration. You don't need to have Claude Code open - burst mode invokes it directly when feedback is ready.

**Security:** Burst mode uses `--permission-mode bypassPermissions` to allow Claude to make changes without confirmation. Only use this in trusted development environments where you control the feedback source.

## MCP Tools

| Tool | Description |
|------|-------------|
| `agentation_get_feedback` | Get all annotations, optionally filtered by pathname |
| `agentation_list_pages` | List pages with pending feedback |
| `agentation_clear_feedback` | Clear feedback after processing |

## CLI Options

```bash
npx @agentation/claude [options]

Options:
  --port <number>  HTTP server port (default: 4242)
  --burst          Run in standalone burst mode
  --verbose, -v    Enable verbose logging
  --help, -h       Show help
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CLAUDE_PATH` | Custom path to Claude CLI (default: auto-detected) |

## Custom port

```bash
claude mcp add agentation -- npx @agentation/claude --port 5000
```

Then configure your app:
```tsx
<Agentation serverUrl="http://localhost:5000" />
```
