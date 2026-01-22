# @agentation/claude

Claude Code integration for [Agentation](https://agentation.dev) - sync page feedback directly to Claude Code via MCP.

## Setup

### 1. Add the MCP server to Claude Code

```bash
claude mcp add agentation -- npx @agentation/claude
```

That's it! The server will auto-start when you launch Claude Code.

### 2. Configure Agentation in your app

Add the component to your app's root layout. The `serverUrl` prop enables sync with Claude.

**React (generic)**
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

**Next.js App Router** (`app/layout.tsx`)
```tsx
import { Agentation } from 'agentation';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <Agentation serverUrl="http://localhost:4242" />
        )}
      </body>
    </html>
  );
}
```

**Next.js Pages Router** (`pages/_app.js`)
```jsx
import { Agentation } from 'agentation';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'development' && (
        <Agentation serverUrl="http://localhost:4242" />
      )}
    </>
  );
}

export default MyApp;
```

**Vite / Create React App** (`main.tsx` or `index.tsx`)
```tsx
import { Agentation } from 'agentation';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {import.meta.env.DEV && <Agentation serverUrl="http://localhost:4242" />}
  </React.StrictMode>
);
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

- **HTTP Server**: Receives annotations from browser (port 4242 for MCP, port 4243 for burst)
- **MCP Server** (stdio): Exposes tools to Claude Code
- **Shared Store**: In-memory, cleared when server restarts

## Choosing a Mode

| Mode | Port | When to use | Command |
|------|------|-------------|---------|
| **MCP** | 4242 | Controlled review - you decide when Claude acts | `claude` (auto-starts MCP) |
| **Burst** | 4243 | Rapid iteration - Claude auto-fixes as you annotate | `npx @agentation/claude --burst` |

**Why different ports?** Most users have Claude Code running, which uses port 4242 for MCP. Burst mode defaults to 4243 to avoid conflicts, allowing both to run simultaneously if needed.

**Important:** The `serverUrl` prop is required for the sync indicator (Clawd icon) to appear in the toolbar. Without it, annotations are only stored locally.

## Burst Mode

Burst mode enables continuous, hands-free feedback processing:

```bash
npx @agentation/claude --burst
```

Then configure your app to use port 4243:
```tsx
<Agentation serverUrl="http://localhost:4243" />
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
│  HTTP server: http://localhost:4243                         │
│  Batch delay: 10 seconds                                    │
│                                                             │
│  Waiting for annotations...                                 │
│  Press Ctrl+C to stop                                       │
└─────────────────────────────────────────────────────────────┘

📝 Received 2 annotation(s) for /dashboard

📋 Found 2 annotation(s). Collecting batch...
⏳ Processing in 7s... (2 annotations)

┌─ Feedback Summary ─────────────────────────────────────────
│ 📄 /dashboard
│    • .nav-link: "Change color to blue"
│    • .header: "Make font larger"
└────────────────────────────────────────────────────────────

🤖 Invoking Claude Code...
   [Claude works on the fixes...]

✓ Claude Code finished (exit code: 0)
✓ Batch complete. Feedback cleared.

👀 Watching for more annotations...
```

**Note:** Burst mode doesn't require Claude Code to be open - it invokes Claude directly when feedback is ready.

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
  --port <number>  HTTP server port (default: 4242 for MCP, 4243 for burst)
  --burst          Run in standalone burst mode
  --verbose, -v    Enable verbose logging
  --help, -h       Show help
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CLAUDE_PATH` | Custom path to Claude CLI (default: auto-detected) |

## Troubleshooting

**Clawd icon not showing in toolbar**
- Make sure `serverUrl` prop is set: `<Agentation serverUrl="http://localhost:4242" />`
- Without `serverUrl`, the sync features are disabled

**Annotations not being received**
- Check the server is running: `curl http://localhost:4242/health`
- Verify your app's `serverUrl` matches the server port
- For burst mode, use port 4243: `serverUrl="http://localhost:4243"`

**Package not updating after changes**
```bash
rm -rf node_modules .next && npm install  # or yarn install
```

**Port already in use**
- MCP server (inside Claude Code) uses 4242
- Run burst mode on 4243: `npx @agentation/claude --burst` (default)
- Or specify a different port: `--port 5000`

**Claude not found (burst mode)**
- Set the `CLAUDE_PATH` environment variable to your Claude CLI location
- Or ensure `claude` is in your PATH

## Custom port

```bash
claude mcp add agentation -- npx @agentation/claude --port 5000
```

Then configure your app:
```tsx
<Agentation serverUrl="http://localhost:5000" />
```
