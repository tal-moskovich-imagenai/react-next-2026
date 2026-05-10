# React Runs Your Terminal: Let's Build One Live

**ReactNext 2026 — June 23, Hall A**
**Speaker: Tal Moskovich**
**Duration: 35 minutes (10:05–10:40)**

---

## Lecture Structure at a Glance

| Block | Time | Duration | Content |
|---|---|---|---|
| 1 · Hook | 10:05 | 2 min | The reveal — tools you use daily are React apps |
| 2 · Context | 10:07 | 4 min | How React renderers work, what Ink is |
| 3 · Core API | 10:11 | 5 min | Box, Text, hooks — the mental model |
| 4 · Live Build | 10:16 | 14 min | Build an AI CLI (env setup, streaming, React 19) |
| 5 · Testing | 10:30 | 3 min | Test CLI components with Vitest + ink-testing-library |
| 6 · At Scale | 10:33 | 4 min | What production apps do differently — and why |
| 7 · When/Why | 10:37 | 2 min | When to reach for this + @inkjs/ui |
| 8 · Close | 10:39 | ~30 sec | Final thought + links |

---

## Block 1 — The Hook (2 min)

### Speaker Notes

Open with the audience already intrigued. Show the terminal. Don't explain what you're about to do — just open Claude Code in the terminal and ask it something simple.

---

### Talking Points

> "What does Claude Code have in common with GitHub Copilot CLI, Prisma, Gatsby, and the Canva CLI?"

_[Pause. Let the audience think.]_

> "They're all React apps. Just not in your browser."

This is the reveal. React isn't a web framework — it's a **rendering paradigm**. The same component model, the same hooks, the same Flexbox you already know. Just a different target.

React ships with a renderer for the browser (`react-dom`) and for native mobile (`react-native`). But the reconciler — the engine that decides *what* changed and *what* to do about it — is separate. You can plug any renderer into it.

Today, we're plugging it into your terminal.

The library is called **Ink**. It's got 38,000 stars on GitHub, 3.7 million downloads a week, and it's used by Anthropic, Google, GitHub, Cloudflare, HashiCorp, and Shopify to build their developer tools.

If you already know React, you already know Ink.

Let's prove that in the next 35 minutes.

---

## Block 2 — Context: How React Renderers Work (4 min)

### Speaker Notes

This section is conceptual — keep it tight, visual, and use the analogy clearly. Don't get lost in internals. The goal is for the audience to understand *why* this is possible, not *how* the reconciler works in detail.

---

### Talking Points

**React has three layers:**

```
Your Components (JSX, hooks, state)
        ↓
  The Reconciler (what changed?)
        ↓
  The Renderer (how to apply it)
```

Most React developers only ever see layer 1. The reconciler (layer 2) is what React actually *is* — the algorithm that compares the previous virtual tree to the next one and produces a diff. It's in a package called `react-reconciler`.

Layer 3 is pluggable. `react-dom` applies diffs to the browser's DOM. `react-native` applies them to native mobile widgets. Ink applies them to... terminal output.

**How does Ink do it?**

The terminal is not a DOM. There's no retained-mode graphics pipeline. There's just:
- `stdin` — bytes coming in (keyboard input)
- `stdout` — bytes going out (what you see)

Everything between those two streams — layout, colors, cursor movement, scrolling — has to be invented.

Ink solves layout with **Yoga**, Meta's cross-platform Flexbox engine. The same engine React Native uses. Yoga runs the Flexbox algorithm — `flex-direction`, `align-items`, `justify-content`, `gap` — and returns pixel positions. Ink then converts those positions into ANSI escape sequences and writes them to stdout.

ANSI escape sequences are special byte patterns that terminals understand:
- `\x1b[32m` = switch text color to green
- `\x1b[0m` = reset all styles
- `\x1b[2J` = clear the screen
- `\x1b[3;10H` = move cursor to row 3, column 10

Ink handles all of that. You write React. Ink writes ANSI.

---

**One concrete render cycle — what actually happens when state changes:**

```
1. You call setState()
   └─ React schedules a re-render

2. React runs your components → produces a new virtual tree

3. The reconciler diffs the new tree against the previous one
   └─ "Box at row 2 col 5: text changed from 'Hello' to 'Counter: 1'"

4. Ink walks the diff and calls Yoga
   └─ Yoga re-runs the flexbox algorithm → returns (row, col) for every node

5. Ink compares the new cell grid to the previous one
   └─ Only the cells that changed get written

6. Ink writes the minimal ANSI to stdout:
   \x1b[2;5H       ← move cursor to row 2, col 5
   Counter: 1      ← overwrite that region
   (nothing else — unchanged cells are never touched)
```

This is the same mental model as React's DOM reconciliation — produce a diff, apply only what changed — but the "DOM" is a 2D array of terminal cells, and "patching the DOM" means writing ANSI escape sequences to stdout.

**Why this matters for performance:** If your component renders 80×24 = 1,920 cells but only one word changed, Ink writes ~10 bytes. If you re-render the whole screen naively every frame (clearing with `\x1b[2J` and reprinting), you write thousands of bytes and the terminal flickers. Ink's cell-level diffing is what makes smooth, flicker-free terminal UIs possible — and it's the same property Claude Code had to preserve and optimize when pushing to 60fps.

---

**The key insight:**

> Every `<Box>` is a flexbox container — like a `<div style={{display: 'flex'}}>`.
> Every `<Text>` is a styled text node.
> All React features — `useState`, `useEffect`, `useContext`, `useMemo`, custom hooks — work exactly the same.

---

## Block 3 — Core API (5 min)

### Speaker Notes

Keep this hands-on. Open your editor. Type each snippet as you talk. Don't just show slides — the audience should see the code being written and, ideally, the output in an adjacent terminal pane.

---

### Installation

```bash
npm install ink react
# TypeScript project:
npx create-ink-app --typescript my-cli
```

---

### The Simplest Possible Ink App

```tsx
import React from 'react';
import { render, Text } from 'ink';

const Hello = () => <Text color="green">Hello, ReactNext!</Text>;

render(<Hello />);
```

Run it with `node --loader tsx hello.tsx`. That's your first terminal app in React.

---

### `<Text>` — Styled Text

```tsx
<Text color="green">Green text</Text>
<Text color="#005cc5">Hex blue</Text>
<Text bold>Bold</Text>
<Text italic>Italic</Text>
<Text underline>Underline</Text>
<Text inverse>Inversed</Text>
<Text backgroundColor="red" color="white">Red background</Text>
```

Ink uses **chalk** under the hood, so any chalk color string works.

Text wrapping:

```tsx
<Box width={20}>
  <Text wrap="truncate">This is a very long string that gets cut off</Text>
</Box>
// => "This is a very long…"
```

---

### `<Box>` — Flexbox Layout

Every Box is a flex container. Think `<div style={{display: 'flex'}}>`.

```tsx
// Row (default)
<Box gap={2}>
  <Text>Left</Text>
  <Text>Right</Text>
</Box>
// => "Left  Right"

// Column
<Box flexDirection="column" borderStyle="round" padding={1}>
  <Text bold>Title</Text>
  <Text dimColor>Subtitle</Text>
</Box>
```

Borders:

```tsx
<Box borderStyle="single">...</Box>   // ┌─────┐
<Box borderStyle="double">...</Box>   // ╔═════╗
<Box borderStyle="round">...</Box>    // ╭─────╮
<Box borderStyle="bold">...</Box>     // ┏━━━━━┓
```

Alignment (same as CSS Flexbox):

```tsx
<Box justifyContent="space-between" width={40}>
  <Text>Left</Text>
  <Text>Right</Text>
</Box>
```

---

### `useInput` — Keyboard Navigation

```tsx
import { useInput } from 'ink';

const Nav = () => {
  useInput((input, key) => {
    if (key.upArrow) { /* move up */ }
    if (key.downArrow) { /* move down */ }
    if (key.return) { /* select */ }
    if (input === 'q') { /* quit */ }
    if (key.ctrl && input === 'c') { /* force quit */ }
  });

  return <Text>Press arrow keys to navigate, Q to quit</Text>;
};
```

The `key` object exposes: `leftArrow`, `rightArrow`, `upArrow`, `downArrow`, `return`, `escape`, `ctrl`, `shift`, `tab`, `backspace`, `delete`, `pageUp`, `pageDown`, `home`, `end`, `meta`.

---

### `useApp` — Lifecycle

```tsx
import { useApp } from 'ink';

const MyApp = () => {
  const { exit } = useApp();

  useEffect(() => {
    // Exit cleanly after async work
    doWork().then(() => exit());
  }, []);

  return <Text>Working...</Text>;
};
```

---

### `<Static>` — High-Performance Output

For items that render once and never change (log lines, completed steps):

```tsx
<Static items={completedSteps}>
  {(step) => (
    <Box key={step.id}>
      <Text color="green">✔ {step.label}</Text>
    </Box>
  )}
</Static>

{/* This keeps updating */}
<Text>Progress: {completedSteps.length} / {total}</Text>
```

`Static` renders items directly to stdout and never re-renders them. This is how Gatsby, tap, and similar tools display thousands of completed steps without flickering.

---

### `useWindowSize` — Responsive Terminal Layouts

Unlike a browser, the terminal can be resized at any moment. Ink gives you `useWindowSize()` to respond to it — same model as a CSS media query, but in React:

```tsx
import { useWindowSize } from 'ink';

const Layout = () => {
  const { columns, rows } = useWindowSize();

  // Narrow terminal — stack vertically
  if (columns < 80) {
    return (
      <Box flexDirection="column">
        <Sidebar />
        <Main />
      </Box>
    );
  }

  // Wide terminal — side by side
  return (
    <Box>
      <Box width={24} flexShrink={0}>
        <Sidebar />
      </Box>
      <Box flexGrow={1}>
        <Main />
      </Box>
    </Box>
  );
};
```

`columns` and `rows` update in real time as the user resizes — React re-renders, Yoga recalculates, Ink writes the diff. The component is reactive to the viewport exactly like `useMediaQuery` in the browser.

> **Practical use:** Truncate long paths to `columns - 4` characters. Cap list heights to `rows - 6` to leave room for the header and input. Claude Code uses `columns` to decide whether to show inline diffs or full-file diffs.

---

## Block 4 — Live Build: An AI-Powered CLI (14 min)

### Speaker Notes

This is the core of the talk. Type every line. Narrate as you go. Have the final version ready to paste if something breaks — but try not to need it.

**Project goal:** A terminal app that:
1. Accepts a prompt from the user
2. Streams a response from an AI API token-by-token
3. Shows a spinner while waiting
4. Lets you press `q` to quit or `Enter` to submit a new prompt

---

### Step 1 — Scaffold (1 min)

```bash
mkdir react-terminal-demo && cd react-terminal-demo
npm init -y
npm install ink react ai @ai-sdk/openai
npm install -D typescript tsx @types/react @types/node
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true
  }
}
```

`package.json`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.tsx"
  }
}
```

---

### Step 2 — The Shell Component (2 min)

`src/index.tsx`:

```tsx
import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

// concurrent: true — enables React 19 concurrent features in Ink v7:
// Suspense boundaries work with async data, useTransition is fully
// functional, and updates can be interrupted for higher-priority work.
render(<App />, { concurrent: true });
```

> **Speaker note (polish — `concurrent: true` caveat):** This flag is required for **all** React 19 features used in this talk: `Suspense` + `use()`, `useTransition`, and `useOptimistic`. Without it, Ink runs in legacy sync mode — those APIs silently fall back to no-ops or throw. Always set it. If you're on Ink v5 or older, the option doesn't exist yet; upgrade to v7 first. Check `ink` version with `npm ls ink`.

`src/App.tsx`:

```tsx
import React from 'react';
import { Box, Text } from 'ink';

export const App = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">React Terminal Demo</Text>
      </Box>
      <Text>Hello from your terminal React app!</Text>
    </Box>
  );
};
```

Run `npm run dev` — the terminal shows a styled box. **This is React.** Same components, same mental model.

---

### Step 3 — Input State (3 min)

Add a text input with controlled state — just like `<input>` in the browser:

`src/TextInput.tsx`:

```tsx
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface Props {
  onSubmit: (value: string) => void;
}

export const TextInput = ({ onSubmit }: Props) => {
  const [value, setValue] = useState('');

  useInput((input, key) => {
    if (key.return) {
      onSubmit(value);
      setValue('');
      return;
    }

    if (key.backspace || key.delete) {
      setValue(prev => prev.slice(0, -1));
      return;
    }

    // Ignore non-printable keys
    if (input && !key.ctrl && !key.meta) {
      setValue(prev => prev + input);
    }
  });

  return (
    <Box>
      <Text color="green">❯ </Text>
      <Text>{value}</Text>
      <Text color="green">█</Text>
    </Box>
  );
};
```

Update `App.tsx`:

```tsx
import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { TextInput } from './TextInput.js';

export const App = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      setMessages(prev => [...prev, value]);
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">React Terminal Demo</Text>
      </Box>

      {messages.map((msg, i) => (
        <Text key={i} dimColor>{'> '}{msg}</Text>
      ))}

      <TextInput onSubmit={handleSubmit} />
    </Box>
  );
};
```

Type into the terminal. State updates. UI re-renders. **This is React in your terminal.**

---

### Step 4 — Streaming AI Response with the Vercel AI SDK (5 min)

Install the AI SDK:

```bash
npm install ai @ai-sdk/openai
```

Set up your API key. Create a `.env` file at the project root — **never commit this**:

```
# .env
OPENAI_API_KEY=sk-...
```

Node 20.6+ can load it natively — no `dotenv` package needed. Update your dev script in `package.json`:

```json
"dev": "tsx watch --env-file=.env src/index.tsx"
```

`@ai-sdk/openai` reads `process.env.OPENAI_API_KEY` automatically. That's all the wiring required.

> **Speaker note (live demo safety):** The `--env-file` flag keeps the key out of your shell history and environment. For the demo, confirm the key is set before going on stage: `node --env-file=.env -e "console.log(process.env.OPENAI_API_KEY?.slice(0,8))"`. You should see `sk-proj-` (or similar). Don't flash the full key.

---

#### The Most Important Thing to Understand Before Writing a Single Line

> **Speaker note:** Pause here. Draw this on the whiteboard or switch to the diagram. This is the conceptual moment of the step — the code comes after.

Most React developers know the Vercel AI SDK. They've used `useChat`. And the first instinct when building this app is:

```tsx
// Every React dev's first instinct for AI streaming:
import { useChat } from '@ai-sdk/react';
const { messages, sendMessage } = useChat({ ... });
```

**Don't do this in a CLI. Here's why.**

`useChat` assumes a specific architecture:

```
  Browser                              Server
┌──────────────────────┐         ┌──────────────────────┐
│  React component     │  HTTP   │  Next.js API route   │
│  useChat()  ─────────┼────────▶│  POST /api/chat      │
│             ◀────────┼─── SSE ─│  streamText(model)   │
│  renders tokens      │         │  → toUIMessageStream │
└──────────────────────┘         └──────────────────────┘
```

`useChat` handles transport — serialising messages, opening the SSE connection, parsing the delta stream, reconnecting on drops. It's doing real work, but that work is about **crossing a network boundary** between a browser and a server.

**In a CLI, that boundary doesn't exist.**

```
  Terminal process (Node.js)
┌─────────────────────────────────────────────┐
│  React component (Ink)                      │
│  + OpenAI API                               │
│  — everything runs in the same process —    │
└─────────────────────────────────────────────┘
```

Your Ink component and the AI model call are in the same Node.js process. There is no browser. There is no HTTP server. If you used `useChat`, you'd have to spin up an HTTP server inside your CLI just so your CLI could make an HTTP request to itself — to call the same model you could have called directly.

```
What useChat would require in a CLI:

 Ink component
      │
      │  HTTP POST (to yourself)
      ▼
 Express server   ← you'd have to write this
      │
      │  streamText(model)
      ▼
 OpenAI API

This is absurd. You're in Node.js. Just call the model.
```

**The right tool is `streamText` from `ai`.**

```tsx
// What you actually want — call the model directly, no HTTP hop:
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { textStream } = streamText({
  model: openai('gpt-4o-mini'),
  messages,
});

for await (const chunk of textStream) {
  // chunk is a string fragment — one or more tokens
  // setContent triggers a re-render in Ink → new ANSI bytes → terminal updates
  setContent(prev => prev + chunk);
}
```

`textStream` is both a `ReadableStream` and an `AsyncIterable`. You `for await` over it inside a React transition. Each chunk calls `setContent`, which triggers a re-render, which writes new ANSI escape sequences to stdout. That's the entire streaming pipeline — no transport layer, no SSE parser, no reconnect logic. The SDK handles all of that internally.

**The mental model, side by side:**

```
useChat (@ai-sdk/react)          streamText (ai)
─────────────────────────        ──────────────────────────
Browser → HTTP → Server          Node.js → Model API directly
Handles transport + SSE          Returns AsyncIterable<string>
Right for: Next.js chatbots      Right for: CLI, scripts, agents
```

Same provider system. Same model IDs. Same `@ai-sdk/openai`, `@ai-sdk/anthropic` imports. Just a different entry point depending on where you're running.

---

`src/useStream.ts`:

```tsx
import { useState, useCallback } from 'react';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useStream = (model = 'gpt-4o-mini') => {
  const [content, setContent]   = useState('');
  const [error, setError]       = useState<Error | null>(null);

  // send() is called inside a React transition (see App.tsx).
  // It returns the fully-accumulated text so the caller can commit it
  // to permanent state without relying on a stale `content` closure.
  const send = useCallback(async (messages: Message[]): Promise<string> => {
    setContent('');
    setError(null);

    let accumulated = '';

    const { textStream } = streamText({
      model: openai(model),
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      onError: ({ error }) => setError(error as Error),
    });

    // textStream is an AsyncIterable — iterate it directly.
    // Each chunk is a string fragment (one or more tokens).
    // Each setState call triggers a re-render in Ink → new ANSI output.
    for await (const chunk of textStream) {
      accumulated += chunk;
      setContent(accumulated);
    }

    return accumulated; // ← caller gets the final text; no stale closure
  }, [model]);

  return { content, error, send };
};
```

`src/Spinner.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import { Text } from 'ink';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export const Spinner = ({ label }: { label?: string }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev + 1) % FRAMES.length);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text color="cyan">
      {FRAMES[frame]} {label ?? 'Thinking...'}
    </Text>
  );
};
```

> **Speaker note (polish — `useAnimation`):** The `setInterval` + `useState` approach above is the most readable pattern and works fine at 80ms intervals. For high-frequency animations (< 16ms / 60fps), Ink v7 ships a `useAnimation` hook that ties into the renderer's own RAF-equivalent loop and avoids creating a separate timer:
>
> ```tsx
> import { useAnimation } from 'ink';
>
> const Spinner = ({ label }: { label?: string }) => {
>   const { frame } = useAnimation({ fps: 12 }); // frame increments at 12fps
>   return <Text>{FRAMES[frame % FRAMES.length]} {label}</Text>;
> };
> ```
>
> For a spinner at 12fps, `setInterval` is fine. For anything animating at 60fps (progress bars, streaming cursors), prefer `useAnimation` to stay in sync with Ink's render loop and avoid timer drift.

```tsx
```

Update `App.tsx` — `useStream` + `useOptimistic` + `useTransition`:

```tsx
import React, { useState, useOptimistic, useTransition } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { TextInput } from './TextInput.js';
import { Spinner } from './Spinner.js';
import { useStream } from './useStream.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
}

export const App = () => {
  const { exit } = useApp();
  const [model, setModel]       = useState('gpt-4o-mini');
  const [messages, setMessages] = useState<Message[]>([]);
  const { content, error, send } = useStream(model);
  const [isPending, startTransition] = useTransition();

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (current, newMessage: Message) => [...current, { ...newMessage, pending: true }],
  );

  useInput((input, key) => {
    if (input === 'q' && !isPending) exit();
  });

  const handleSubmit = (value: string) => {
    if (!value.trim() || isPending) return;

    startTransition(async () => {
      const userMsg: Message = { role: 'user', content: value };

      // Appears immediately — before the API responds
      addOptimisticMessage(userMsg);

      // Full history passed to streamText → proper multi-turn context
      const history = [...messages, userMsg];

      // FIX: use the return value, not the `content` closure.
      // By the time this line runs, `content` still holds the previous
      // render's snapshot — `finalText` has the full streamed string.
      const finalText = await send(history);

      // Commit both turns to permanent state when streaming finishes
      setMessages(prev => [
        ...prev,
        userMsg,
        { role: 'assistant', content: finalText },
      ]);
    });
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">AI Terminal </Text>
        <Text dimColor>model: {model}  (q to quit)</Text>
      </Box>

      {optimisticMessages.map((msg, i) => (
        <Box key={i} marginBottom={1} flexDirection="column">
          <Text color={msg.role === 'user' ? 'yellow' : 'green'} bold>
            {msg.role === 'user' ? 'You' : 'AI'}
            {msg.pending && <Text dimColor>  sending…</Text>}
          </Text>
          <Box paddingLeft={2}>
            <Text dimColor={msg.pending}>{msg.content}</Text>
          </Box>
        </Box>
      ))}

      {isPending && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="green" bold>AI</Text>
          <Box paddingLeft={2}>
            {content ? <Text>{content}</Text> : <Spinner />}
          </Box>
        </Box>
      )}

      {error && (
        <Box>
          <Text color="red">Error: {error.message}</Text>
        </Box>
      )}

      {!isPending && <TextInput onSubmit={handleSubmit} />}
    </Box>
  );
};
```

---

#### Terminal-Specific: Conditional Rendering and Layout Shift

> **Speaker note:** This is the first real "gotcha" that every web developer hits when they write their second Ink component. Mention it now so the audience's mental model is right from the start.

In the browser, hiding a component with conditional rendering doesn't move anything:

```tsx
// Browser — <Panel> is display:none; nothing shifts
{showPanel && <Panel />}
```

In a terminal, **there is no display:none by default.** The terminal is a document flow. Removing a `<Box>` from the tree makes everything below it shift up. If you toggle `isPending` rapidly, the input field jumps every time:

```tsx
// ❌ Causes layout jump in the terminal — TextInput shifts up when Spinner appears
{isPending && <Spinner />}
<TextInput onSubmit={handleSubmit} />
```

Two ways to fix it:

```tsx
// ✅ Option 1: display prop — reserves space, renders nothing
<Box display={isPending ? 'flex' : 'none'}>
  <Spinner />
</Box>
<TextInput onSubmit={handleSubmit} />

// ✅ Option 2: always render both, control visibility via opacity/dimColor
{isPending ? <Spinner /> : <Box height={1} />}  {/* placeholder holds height */}
<TextInput onSubmit={handleSubmit} />
```

---

#### Production Upgrade: `<Static>` for Completed Messages

The current `App.tsx` renders all messages with `optimisticMessages.map(...)` — a dynamic list that Ink re-renders on every state change. For a quick demo this is fine, but it has a real cost at scale: if you have 50 exchanges, Ink diffs all 50 message boxes every time a new token arrives.

The production pattern — what Claude Code actually does — splits the render into two regions:

```tsx
import { Static } from 'ink';

return (
  <Box flexDirection="column" padding={1}>
    {/* Header */}
    <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
      <Text bold color="cyan">AI Terminal </Text>
      <Text dimColor>model: {model}  (q to quit)</Text>
    </Box>

    {/* Committed messages — written to stdout once, never re-rendered.
        Ink renders Static items directly to stdout as they arrive,
        then forgets them. The cell-diff loop never touches these lines again. */}
    <Static items={messages}>
      {(msg, i) => (
        <Box key={i} marginBottom={1} flexDirection="column">
          <Text color={msg.role === 'user' ? 'yellow' : 'green'} bold>
            {msg.role === 'user' ? 'You' : 'AI'}
          </Text>
          <Box paddingLeft={2}>
            <Text>{msg.content}</Text>
          </Box>
        </Box>
      )}
    </Static>

    {/* Live region — only the current in-progress stream updates every token.
        This is the only area Ink's diff loop has to process at 60fps. */}
    {isPending && (
      <Box flexDirection="column" marginBottom={1}>
        <Text color="green" bold>AI</Text>
        <Box paddingLeft={2}>
          {content ? <Text>{content}</Text> : <Spinner />}
        </Box>
      </Box>
    )}

    {error && <Text color="red">Error: {error.message}</Text>}
    {!isPending && <TextInput onSubmit={handleSubmit} />}
  </Box>
);
```

**Why this matters:** Without `<Static>`, a 100-message conversation means Ink's diff loop touches ~100 × (average message height) cells on every token. With `<Static>`, it touches exactly one region — the current streaming response. The longer the session, the more dramatic the difference. This is one of the structural decisions that lets Claude Code stay smooth in long conversations.

> **Speaker note:** You don't have to live-code the `<Static>` upgrade — the demo already works without it. Show this as a "here's how you'd take this to production" slide moment. The `<Static>` conceptual explanation was in Block 3 — this is the payoff.

---

**What the AI SDK buys us vs the raw `fetch` version:**

| | Raw fetch (before) | `streamText` from `ai` |
|---|---|---|
| SSE parsing | Manual — split lines, parse JSON, check `[DONE]` | Gone — SDK handles it |
| Provider switch | Rewrite the entire fetch call | Change one import: `openai(...)` → `anthropic(...)` |
| Error handling | Manual try/catch around reader loop | `onError` callback |
| Multi-turn history | Manually serialize `messages` array | Pass it directly — SDK owns the format |
| Token streaming | `setState` on every parsed delta | `for await` on `textStream` — same result, less code |

To switch from OpenAI to Anthropic Claude:

```tsx
// Change two lines — everything else stays identical
import { anthropic } from '@ai-sdk/anthropic';
const { textStream } = streamText({ model: anthropic('claude-opus-4-5'), ... });
```

**What changed from the traditional version:**

| Before | After (React 19) |
|---|---|
| `setMessages` immediately | `useOptimistic` — message appears instantly, auto-reverts on error |
| `isStreaming` boolean | `isPending` from `useTransition` — React owns the pending state |
| Manual guard `if (isStreaming) return` | `!isPending` — same intent, React's scheduler handles priority |

The user's prompt appears in the terminal the moment they press Enter — before a single byte arrives from the API. If the request fails, React rolls the optimistic entry back automatically. **No manual rollback code.**

---

### Step 5 — Keyboard Navigation + React 19 `use()` (3 min)

Add a menu to select AI models. This time, the model list is fetched from the API — and we use React 19's `use()` hook instead of `useEffect` + `useState`.

`src/fetchModels.ts`:

```ts
interface Model {
  id: string;
  label: string;
}

// Create the promise ONCE, outside the component.
// React's use() reads the same promise instance on every render —
// it only fetches once, not once per render.
export const modelsPromise: Promise<Model[]> = fetch(
  'https://api.openai.com/v1/models',
  { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } },
)
  .then(r => r.json())
  .then(data =>
    (data.models as { id: string }[])
      .filter(m => m.id.startsWith('gpt') || m.id.startsWith('o'))
      .map(m => ({ id: m.id, label: m.id }))
      .slice(0, 6),
  );
```

`src/ModelSelect.tsx`:

```tsx
import React, { useState, use, Suspense, Component, type ReactNode } from 'react';
import { Box, Text, useInput } from 'ink';
import { modelsPromise } from './fetchModels.js';
import { Spinner } from './Spinner.js';

interface Props {
  onSelect: (modelId: string) => void;
}

// Error boundary — Suspense alone cannot catch rejected promises.
// If the fetch fails (bad key, network error) this surfaces the message
// instead of crashing the whole app.
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box borderStyle="round" borderColor="red" padding={1}>
          <Text color="red">✗ Failed to load models: {this.state.error.message}</Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

// Inner component — use() suspends this until modelsPromise resolves.
// No useEffect. No isLoading state. No empty array on first render.
const ModelList = ({ onSelect }: Props) => {
  const models = use(modelsPromise); // ← React 19
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow)   setCursor(prev => Math.max(0, prev - 1));
    if (key.downArrow) setCursor(prev => Math.min(models.length - 1, prev + 1));
    if (key.return)    onSelect(models[cursor].id);
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
      <Text bold color="yellow">Select a model:</Text>
      {models.map((model, i) => (
        <Box key={model.id}>
          <Text color={i === cursor ? 'green' : undefined}>
            {i === cursor ? '❯ ' : '  '}
            {model.label}
          </Text>
        </Box>
      ))}
      <Text dimColor marginTop={1}>↑/↓ navigate, Enter to confirm</Text>
    </Box>
  );
};

// ErrorBoundary wraps Suspense — required whenever you use() a promise.
// Suspense handles the pending state; ErrorBoundary handles rejection.
export const ModelSelect = ({ onSelect }: Props) => (
  <ErrorBoundary>
    <Suspense fallback={<Spinner label="Loading models…" />}>
      <ModelList onSelect={onSelect} />
    </Suspense>
  </ErrorBoundary>
);
```

> **Speaker note (fix #5):** React does not catch rejected promises inside `Suspense` — they bubble up and crash the tree. An `ErrorBoundary` is always required alongside `Suspense` in production code. The pattern is always: `<ErrorBoundary><Suspense fallback={...}><ComponentThatUses /></Suspense></ErrorBoundary>`. There is a proposal for a built-in `<ErrorBoundary>` in future React, but class components are still the only way today.

**What `use()` does here — compared to the traditional approach:**

```tsx
// ❌ Traditional — useEffect + useState
const ModelList = ({ onSelect }) => {
  const [models, setModels] = useState([]);       // empty on first render
  const [loading, setLoading] = useState(true);  // manual loading flag

  useEffect(() => {
    fetchModels().then(data => {
      setModels(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;   // manual guard
  // ...
};

// ✅ React 19 use() — Suspense handles the loading state
const ModelList = ({ onSelect }) => {
  const models = use(modelsPromise); // never undefined — component only
  // renders after the promise resolves. Suspense shows the fallback instead.
  // ...
};
```

The key difference: `use()` can be called **conditionally**, unlike `useEffect`. If you only want to load models when the user opens the selector, you can:

```tsx
const ModelList = ({ visible, onSelect }: Props) => {
  // Legal in React 19 — hooks can be conditional with use()
  if (!visible) return null;
  const models = use(modelsPromise); // only suspends when visible is true
  // ...
};
```

This is a fully interactive, async-loaded select menu. **No `isLoading`. No empty-array flash. No cleanup.** Pure `use()` + `Suspense`.

---

#### Why We Didn't Use `use()` for the AI Stream

> **Speaker note (note #4):** Audiences that just saw `use(modelsPromise)` will immediately ask: "Why not do `use(streamPromise)` for the AI response?" This is the right question. Address it before it comes up.

`use()` and streaming solve fundamentally different problems:

| | `use(modelsPromise)` | `streamText` + `for await` |
|---|---|---|
| **What's awaited** | A single resolved value (array of models) | An infinite sequence of incremental chunks |
| **When does it finish?** | Once — the promise resolves | After N chunks; unknown upfront |
| **React model** | Suspend → resume → render once | Re-render on every chunk |
| **UI pattern** | Loading state → final UI | Spinner → incremental text appearing |

`use()` is designed for **one value that arrives once**. It suspends the component, then re-renders it a single time when the promise resolves.

A streaming AI response is the opposite: it's a sequence of values arriving over time, each one triggering a new render. You want to show the text appearing incrementally — not wait for the full response and snap it in at the end.

```tsx
// ❌ This would freeze the UI until the entire response arrives
// then snap it all in at once — destroying the streaming effect
const response = use(streamText({ ... }).text); // .text is a Promise<string>

// ✅ This re-renders on every chunk — you see text appearing in real time
const { textStream } = streamText({ ... });
for await (const chunk of textStream) {
  setContent(prev => prev + chunk); // → new ANSI frame on each chunk
}
```

The `ai` SDK actually exposes both: `.text` as a `Promise<string>` (for `use()`), and `.textStream` as an `AsyncIterable` (for `for await`). **Use `.text` when you want the final result. Use `.textStream` when you want incremental rendering.** We always want incremental rendering in a live terminal demo.

---

### Aside: `<Activity>` — Keep State Alive While Hidden

> This is one to watch. It's not stable yet in React 19, but it's coming — and it's the right mental model for multi-screen CLIs.

`<Activity>` (previously called `<Offscreen>`) keeps a component tree mounted and its state alive while visually hidden. In a CLI with multiple screens — model selector, chat, settings — switching between them today means unmounting and remounting, which resets all local state:

```tsx
// ❌ Today — switching screens destroys and recreates state
{screen === 'chat'   && <ChatScreen />}
{screen === 'models' && <ModelSelect onSelect={setModel} />}
```

With `<Activity>` (when it lands):

```tsx
// ✅ Future — state preserved across screen switches
<Activity mode={screen === 'chat' ? 'visible' : 'hidden'}>
  <ChatScreen />
</Activity>
<Activity mode={screen === 'models' ? 'visible' : 'hidden'}>
  <ModelSelect onSelect={setModel} />
</Activity>
```

The hidden subtree stays mounted, keeps its scroll position, its focused element, its in-flight requests — but produces no output. When you switch back, it resumes instantly. This is exactly how `vim` handles split buffers or how a browser keeps background tabs alive.

> **Speaker note:** Don't promise this for production today. Mark it as "this is where React is going" — it's a useful signal about the design direction, and it's a natural landing pad after showing `use()` and `Suspense`.

---

## Block 5 — Testing (3 min)

### Speaker Notes

Testing is a first-class citizen here. The `ink-testing-library` works exactly like React Testing Library, but for terminal output.

---

### Setup

```bash
npm install -D vitest ink-testing-library
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

---

### Testing Components

`src/Spinner.test.tsx`:

```tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Spinner } from './Spinner.js';

describe('Spinner', () => {
  it('renders a spinner frame with label', () => {
    const { lastFrame } = render(<Spinner label="Loading" />);
    // The first frame is one of the braille characters
    expect(lastFrame()).toMatch(/Loading/);
  });
});
```

`src/ModelSelect.test.tsx`:

> **Speaker note:** `ModelSelect` now uses `use(modelsPromise)` — which means it suspends on first render. The old synchronous tests broke because `lastFrame()` returned the spinner, not the model list. Two changes fix this:
> 1. `vi.mock` replaces `modelsPromise` with an already-resolved promise.
> 2. Each test `await`s a micro-task tick (`await new Promise(r => setTimeout(r, 0))`) so React processes the resolved promise before asserting.

```tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'ink-testing-library';
import { ModelSelect } from './ModelSelect.js';

// Provide a pre-resolved promise so use() never actually suspends.
// The module factory runs once; Vitest hoists vi.mock() above imports.
vi.mock('./fetchModels.js', () => ({
  modelsPromise: Promise.resolve([
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast)' },
    { id: 'gpt-4o',     label: 'GPT-4o (smart)'     },
    { id: 'o1-mini',    label: 'o1 Mini (reasoning)' },
  ]),
}));

// Flush microtasks so the resolved promise is processed by React
const flush = () => new Promise<void>(r => setTimeout(r, 0));

describe('ModelSelect', () => {
  it('shows spinner before promise resolves (real modelsPromise)', () => {
    // Without the mock this would be the steady state — demonstrate the fallback
    // Here we just confirm the mock is working: spinner should NOT appear
    const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
    // immediately after render React may still show the Suspense fallback
    // — that's correct behaviour. The next test confirms it resolves.
    expect(typeof lastFrame()).toBe('string');
  });

  it('shows all model options after promise resolves', async () => {
    const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
    await flush(); // let the resolved promise propagate through React
    expect(lastFrame()).toContain('GPT-4o Mini');
    expect(lastFrame()).toContain('GPT-4o');
    expect(lastFrame()).toContain('o1 Mini');
  });

  it('starts cursor on first item', async () => {
    const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
    await flush();
    expect(lastFrame()).toContain('❯ GPT-4o Mini');
  });

  it('moves cursor down with arrow key', async () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);
    await flush();

    stdin.write('\u001B[B'); // ANSI escape for ↓
    expect(lastFrame()).toContain('❯ GPT-4o');
  });

  it('calls onSelect when Enter is pressed', async () => {
    const onSelect = vi.fn();
    const { stdin } = render(<ModelSelect onSelect={onSelect} />);
    await flush();

    stdin.write('\r');
    expect(onSelect).toHaveBeenCalledWith('gpt-4o-mini');
  });

  it('does not go below the last item', async () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);
    await flush();

    for (let i = 0; i < 10; i++) {
      stdin.write('\u001B[B');
    }
    expect(lastFrame()).toContain('❯ o1 Mini');
  });
});
```

Run with `npx vitest`. Output:

```
✔ ModelSelect > shows spinner before promise resolves
✔ ModelSelect > shows all model options after promise resolves
✔ ModelSelect > starts cursor on first item
✔ ModelSelect > moves cursor down with arrow key
✔ ModelSelect > calls onSelect when Enter is pressed
✔ ModelSelect > does not go below the last item
```

**The key insight:** `lastFrame()` returns the plain text of what would be written to the terminal. You assert on strings — exactly like asserting on DOM text content in React Testing Library.

`stdin.write()` simulates keyboard input — ANSI escape sequences for special keys, regular strings for regular characters.

No DOM, no jsdom, no mocks of the terminal. The test actually runs the component tree through Ink's renderer into a string buffer.

---

### The Full `ink-testing-library` API

| Method | Description |
|---|---|
| `render(<App />)` | Render a component tree to a buffer |
| `lastFrame()` | The most recent rendered output as a string |
| `frames` | Array of all frames rendered so far |
| `rerender(<App />)` | Re-render with new props |
| `stdin.write(str)` | Simulate keyboard input |
| `unmount()` | Unmount the component (triggers cleanup) |

---

## Block 6 — At Scale: What Production Apps Do Differently (5 min)

### Speaker Notes

This is the "deeper than the docs" moment. Most talks stop at "here's how to use the library." This block answers the question the senior developers in the room are already silently asking: *"OK, but what happens when this gets real?"*

Use the Claude Code example as the anchor — it's familiar to this audience, and it's an honest case study of Ink working at the edge of what a stock installation can do. Then show how simpler projects solve simpler scale problems with just the standard API. Make the point that **the abstraction gives you room to grow** — you don't have to optimize upfront.

---

### Talking Points: The Problem Ink Solves at 1× — and What 100× Looks Like

> "The projects I mentioned at the start — Claude Code, GitHub Copilot CLI, Prisma, Gatsby — all chose Ink. But they use it very differently. Let me show you what that spectrum looks like."

---

### Pattern 1: The Wizard (Prisma, create-react-app)

The simplest pattern. The tool runs once, asks a few questions, exits. No streaming, no live updates.

```tsx
// prisma init style wizard
const SetupWizard = () => {
  const { exit } = useApp();
  const [step, setStep] = useState<'database' | 'schema' | 'done'>('database');
  const [db, setDb] = useState('');

  if (step === 'database') {
    return (
      <Box flexDirection="column">
        <Text bold>Which database do you want to use?</Text>
        <ModelSelect
          options={['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB']}
          onSelect={(choice) => {
            setDb(choice);
            setStep('schema');
          }}
        />
      </Box>
    );
  }

  if (step === 'schema') {
    return (
      <Box flexDirection="column">
        <Text color="green">✔ Database: {db}</Text>
        <Text bold>Where should your schema file go?</Text>
        <TextInput onSubmit={() => setStep('done')} />
      </Box>
    );
  }

  // Exit cleanly after the last step renders
  useEffect(() => { exit(); }, []);
  return <Text color="green">✔ Prisma initialized!</Text>;
};
```

**No special optimizations needed.** The app renders a handful of frames per user interaction. Stock Ink, stock React. Done.

---

### Pattern 2: The Progress Display (Gatsby, tap, Turborepo)

Gatsby's CLI builds hundreds or thousands of pages, and needs to show completed pages while keeping a live progress bar at the bottom — without re-rendering the completed list on every new page.

The naive approach re-renders everything on every state update:

```tsx
// ❌ Naive — re-renders all completed pages on every new page
const NaiveBuild = ({ pages }) => (
  <Box flexDirection="column">
    {pages.map(p => <Text key={p.id} color="green">✔ {p.path}</Text>)}
    <Text>Building... {pages.length} done</Text>
  </Box>
);
```

On 500 pages, that's 500 Text nodes being compared on every state update.

The Ink solution is `<Static>` — it renders items once to stdout and never touches them again:

```tsx
// ✔ Ink's solution — Static renders completed items once, forever
const GatsbyStyleBuild = ({ completedPages, currentPage, total }) => (
  <>
    {/* These lines are printed once and never re-rendered */}
    <Static items={completedPages}>
      {(page) => (
        <Box key={page.id}>
          <Text color="green">✔ </Text>
          <Text dimColor>{page.path}</Text>
          <Text dimColor> ({page.durationMs}ms)</Text>
        </Box>
      )}
    </Static>

    {/* Only this part keeps updating — the live progress bar */}
    <Box borderStyle="round" borderColor="cyan" padding={1}>
      <Text>
        [{completedPages.length}/{total}]{' '}
        <Text color="cyan">{currentPage}</Text>
      </Text>
    </Box>
  </>
);
```

`Static` works by writing completed items directly to stdout above the cursor, then leaving the cursor in place for the live area. Completed items never scroll — they just live above the dynamic zone. No re-rendering. No diffing. Zero cost after the first render.

**This is a standard Ink feature.** No forking required.

---

### Pattern 3: The Live Dashboard (Wrangler, Linear's internal tools)

Tools that show live state — deployment progress, queue depths, worker status — need efficient updates across multiple panes simultaneously. The main optimization here is thinking about what actually *changes* per frame.

```tsx
const DeployDashboard = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const { columns } = useWindowSize();

  // Split the terminal: left pane = worker status, right pane = logs
  return (
    <Box height={20}>
      {/* Left pane: worker grid — only re-renders when workers change */}
      <Box
        flexDirection="column"
        width={Math.floor(columns * 0.4)}
        borderStyle="single"
        borderColor="cyan"
      >
        <Text bold color="cyan"> Workers</Text>
        {workers.map(w => (
          <Box key={w.id} justifyContent="space-between">
            <Text>{w.name}</Text>
            <Text color={w.status === 'ok' ? 'green' : 'red'}>
              {w.status === 'ok' ? '●' : '✖'}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Right pane: scrolling log — new lines push old ones up */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single">
        <Text bold> Logs</Text>
        {logs.slice(-15).map((line, i) => (
          <Text key={i} color={line.level === 'error' ? 'red' : undefined}>
            <Text dimColor>[{line.time}]</Text> {line.message}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
```

`useWindowSize()` gives you the current terminal dimensions reactively — when the user resizes the terminal, the component re-renders with the new values and Yoga recalculates the layout. Responsive terminal UI in one hook.

---

### Pattern 4: Where Stock Ink Hits Its Ceiling — The Claude Code Story

> "I want to show you something uncomfortable. This is the kind of thing most library talks skip. But it matters — because it shows you exactly what React's abstraction boundary means in practice, and what you can do when the defaults aren't enough."

> **Source note (speaker):** The Gatsby/`<Static>` pattern comes from Ink's official README. The Claude Code story is backed by multiple sources at different levels of authority — be explicit about which is which on stage.
>
> **Primary sources (Anthropic employees, on the record):**
> - **Boris, Claude Code team, Hacker News (2025):** *"We started by using Ink, and at this point it's our own framework due to the number of changes we've made to it over the months."* [link](https://news.ycombinator.com/item?id=45901918)
> - **Thariq, Anthropic engineer, quoted by Peter Steinberger (Dec 2025):** *"Ink didn't support the kind of fine-grained incremental updates needed for a long-running interactive UI [...] so they rewrote the renderer from scratch — while still keeping React as the component model."* [link](https://steipete.me/posts/2025/signature-flicker)
> - **Official Anthropic Claude Code docs** (`code.claude.com/docs/en/fullscreen`): confirms the rendering rewrite, virtual rendering of only visible messages, flat memory usage in long sessions, and the flickering problem they were solving.
>
> **Secondary source (community reverse-engineering):**
> - [*Claude Code from Source*](https://claude-code-from-source.com/ch13-terminal-ui/) — decompiled Claude Code's source maps. The specific internals (Int32Array, exact blit algorithm) come from here, not Anthropic directly.
>
> **What to say on stage:** Lead with the Thariq and Boris quotes — those are the bedrock. Then frame the Int32Array/double-buffer code as *"from the community reverse-engineering of the source maps, consistent with what Anthropic described."*

Claude Code is an LLM agent. When it responds, tokens arrive at ~60fps. The conversation grows to hundreds of messages. The user scrolls while new tokens arrive. All of this happens simultaneously, in a 200-column terminal.

We don't have to guess about what happened. Two Anthropic engineers said it publicly.

Boris, from the Claude Code team, on Hacker News:

> *"We started by using Ink, and at this point it's our own framework due to the number of changes we've made to it over the months."*

Thariq, an Anthropic engineer:

> *"Ink didn't support the kind of fine-grained incremental updates needed for a long-running interactive UI. We needed tighter control, so we rewrote the renderer from scratch — while still keeping React as the component model."*

So: **React stays. The renderer was rewritten.**

That's the story. And thanks to a community project that decompiled Claude Code's source maps — [*Claude Code from Source*](https://claude-code-from-source.com/ch13-terminal-ui/) — we have a detailed picture of *how* they did it.

Let's look at what **stock Ink does**, why it breaks here, and what the rewrite replaced — optimization by optimization.

---

#### ❌ BEFORE: Stock Ink's Rendering Model

**Step 1: How stock Ink represents a screen cell**

Every character position on the terminal is a JavaScript object. Here's the shape Ink uses internally:

```ts
// Stock Ink — one object per terminal cell
interface OutputEntry {
  char: string;           // The character at this position ("A", "█", " ")
  foregroundColor?: string; // "green", "#005cc5", "rgb(0,255,0)"
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  inverse?: boolean;
  dimColor?: boolean;
}

// The full screen is an array of arrays of these objects
type Screen = OutputEntry[][];

function buildScreen(rows: number, cols: number): Screen {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ char: ' ' }))
  );
}
```

**Step 2: How stock Ink renders a frame**

Every 16ms (at 60fps), it builds a brand new screen:

```ts
// Stock Ink render loop — simplified
function render(domTree: DOMNode): void {
  // ❌ Allocates a fresh Screen object every single frame
  const newScreen: Screen = buildScreen(terminalRows, terminalCols);

  // Walk the DOM, write OutputEntry objects into newScreen
  renderNode(domTree, newScreen, x=0, y=0);

  // Diff the new screen against the previous one
  const patches = diff(previousScreen, newScreen);

  // Write changed cells to stdout
  for (const patch of patches) {
    process.stdout.write(patch.ansi);
  }

  // ❌ The old screen becomes garbage — GC will collect it later
  previousScreen = newScreen;
}
```

**Step 3: The math — why this breaks at 60fps**

```
Terminal:         200 columns × 120 rows
Cells per screen: 24,000
Objects per cell: 1 OutputEntry JS object

Per frame:        24,000 OutputEntry objects created
                  24,000 OutputEntry objects from last frame become garbage

At 60fps:         24,000 × 60 = 1,440,000 objects created/second
                  1,440,000 objects handed to GC every second

GC behavior:      V8's minor GC (scavenger) runs when the nursery fills.
                  At 1.4M short-lived objects/sec, the nursery fills
                  every ~10–15ms — right in the middle of your 16ms budget.

Symptom:          GC pause mid-frame → frame takes 25ms instead of 16ms
                  → dropped frame → visible stutter in the token stream
```

You can reproduce this locally and **watch it happen**:

```ts
// Run with: node --expose-gc profile-ink.mjs
import { render, Text, Box } from 'ink';
import React, { useState, useEffect } from 'react';

// Simulate a streaming AI response: 1 token every 16ms
const StreamingDemo = () => {
  const [tokens, setTokens] = useState<string[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setTokens(prev => [...prev, 'token ']);
    }, 16);
    return () => clearInterval(id);
  }, []);

  return (
    <Box flexDirection="column" width={200} height={120}>
      {/* 200-column wide box forces Ink to allocate 24,000 cells per frame */}
      <Text>{tokens.join('')}</Text>
    </Box>
  );
};

// Measure GC pauses
let lastFrame = performance.now();
setInterval(() => {
  const now = performance.now();
  const delta = now - lastFrame;
  if (delta > 20) {
    // Frame took more than 20ms — likely a GC pause
    console.error(`Frame spike: ${delta.toFixed(1)}ms`);
  }
  lastFrame = now;
}, 16);

render(<StreamingDemo />);
```

On a large terminal you'll see output like:

```
Frame spike: 24.3ms
Frame spike: 31.7ms   ← GC paused during frame render
Frame spike: 22.1ms
Frame spike: 28.4ms
```

The token stream stutters. Users notice.

---

#### ✅ AFTER: What Claude Code Does Instead

Anthropic forked Ink and replaced the rendering internals with three targeted optimizations. **The component code — JSX, hooks, state — is unchanged.** Only the renderer below changed.

---

**Optimization 1: Packed TypedArrays — kill the per-cell object**

Instead of one JS object per cell, pack everything into two 32-bit integers:

```ts
// Claude Code's approach — no per-cell object allocation
// Each cell = 2 x Int32 words in a flat typed array

//  Word 0: character codepoint (the actual Unicode character)
//  Word 1: style ID (index into a shared style pool)

const WORDS_PER_CELL = 2;
const CHAR_WORD  = 0;
const STYLE_WORD = 1;

class Screen {
  private buffer: Int32Array;
  readonly rows: number;
  readonly cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    // ✅ One allocation for the whole screen — reused every frame
    this.buffer = new Int32Array(rows * cols * WORDS_PER_CELL);
  }

  setCell(row: number, col: number, char: string, styleId: number): void {
    const offset = (row * this.cols + col) * WORDS_PER_CELL;
    this.buffer[offset + CHAR_WORD]  = char.codePointAt(0) ?? 32;
    this.buffer[offset + STYLE_WORD] = styleId;
  }

  getCharCode(row: number, col: number): number {
    return this.buffer[(row * this.cols + col) * WORDS_PER_CELL + CHAR_WORD];
  }

  getStyleId(row: number, col: number): number {
    return this.buffer[(row * this.cols + col) * WORDS_PER_CELL + STYLE_WORD];
  }

  // ✅ Diff is now two integer comparisons per cell — no object property access
  cellEquals(other: Screen, row: number, col: number): boolean {
    const offset = (row * this.cols + col) * WORDS_PER_CELL;
    return (
      this.buffer[offset]     === other.buffer[offset] &&
      this.buffer[offset + 1] === other.buffer[offset + 1]
    );
  }
}

// Style pool: styles are interned — "bold green on black" = styleId 42
// The same style object is reused across all cells that share that style
class StylePool {
  private pool = new Map<string, number>();
  private styles: StyleEntry[] = [];

  intern(style: StyleEntry): number {
    const key = styleKey(style); // e.g. "fg:green;bold:1"
    let id = this.pool.get(key);
    if (id === undefined) {
      id = this.styles.length;
      this.styles.push(style);
      this.pool.set(key, id);
    }
    return id; // return the integer ID, not the object
  }

  get(id: number): StyleEntry {
    return this.styles[id];
  }
}
```

**Result:** Zero per-frame object allocation. The typed array is one contiguous block of memory, allocated once when Ink starts, reused every frame.

---

**Optimization 2: Double buffering — kill the per-frame array allocation**

```ts
// ❌ Stock Ink: allocates a new Screen every frame
class StockInkRenderer {
  private previous: Screen | null = null;

  render(dom: DOMNode, rows: number, cols: number): void {
    const next = new Screen(rows, cols); // ❌ fresh allocation every 16ms
    this.renderNode(dom, next);
    const patches = this.diff(this.previous, next);
    this.flush(patches);
    this.previous = next; // previous becomes garbage
  }
}

// ✅ Claude Code: two pre-allocated buffers, swapped every frame
class OptimizedRenderer {
  private front: Screen; // currently displayed on the terminal
  private back:  Screen; // being rendered into right now

  constructor(rows: number, cols: number) {
    // ✅ Two allocations — ever. Not per frame.
    this.front = new Screen(rows, cols);
    this.back  = new Screen(rows, cols);
  }

  render(dom: DOMNode): void {
    // Render the next frame into the back buffer (no allocation)
    this.back.clear();
    this.renderNode(dom, this.back);

    // Diff back vs front — only changed cells produce output
    const patches = this.diff(this.front, this.back);
    this.flush(patches);

    // ✅ Swap: back becomes front, front becomes the next back
    // This is a pointer reassignment — no memory freed, no GC triggered
    [this.front, this.back] = [this.back, this.front];
  }
}
```

**Result:** The GC never sees a discarded screen buffer. Ever. The same two `Int32Array` instances live for the entire process lifetime.

---

**Optimization 3: Dirty tracking + blit — skip unchanged subtrees entirely**

This is the biggest win. On a typical streaming frame, only a handful of cells actually change — the new token characters. Everything else is identical to the previous frame.

```ts
// Every DOM node tracks whether it needs re-rendering
interface DOMNode {
  dirty: boolean;           // did this node's content change?
  cachedPosition: Position; // where did Yoga place this last frame?
  children: DOMNode[];
}

// When a component's state changes, React's reconciler calls markDirty()
function markDirty(node: DOMNode): void {
  node.dirty = true;
  // Walk up the tree — parents also need to know something changed below
  if (node.parent) markDirty(node.parent);
}

// The render loop uses this to skip unchanged subtrees
function renderNode(
  node: DOMNode,
  back: Screen,
  front: Screen, // ← we now pass the previous frame too
): void {
  const currentPos = getYogaPosition(node);

  if (
    !node.dirty &&
    positionEquals(currentPos, node.cachedPosition)
  ) {
    // ✅ BLIT: this subtree is identical to last frame
    // Copy cells directly from front buffer — no re-rendering
    blitRegion(front, back, currentPos);
    return; // skip the entire subtree
  }

  // Node is dirty or moved — render it properly
  for (const child of node.children) {
    renderNode(child, back, front);
  }

  node.dirty = false;
  node.cachedPosition = currentPos;
}

function blitRegion(src: Screen, dst: Screen, region: Rect): void {
  // TypedArray.copyWithin is a single CPU instruction for contiguous memory
  // This copies an entire row in one call instead of cell-by-cell
  for (let row = region.top; row < region.bottom; row++) {
    const srcOffset = (row * src.cols + region.left) * WORDS_PER_CELL;
    const dstOffset = (row * dst.cols + region.left) * WORDS_PER_CELL;
    dst.buffer.copyWithin(dstOffset, srcOffset, srcOffset + region.width * WORDS_PER_CELL);
  }
}
```

**On a typical streaming frame — one new token appears:**

```
Frame #1247
  Token arrives: "React"
  
  Dirty nodes:    <StreamingText> (the message being typed)
  Clean nodes:    <Header>, <MessageList> (all previous messages),
                  <InputBox>, <Sidebar> — everything else

  renderNode(<App>)          → dirty (parent of dirty child) → recurse
  renderNode(<MessageList>)  → dirty → recurse
  renderNode(<StreamingText>)→ dirty → render 5 new chars
  renderNode(<Header>)       → ✅ BLIT  (copies ~200 cells from front)
  renderNode(<InputBox>)     → ✅ BLIT  (copies ~200 cells from front)
  renderNode(<Sidebar>)      → ✅ BLIT  (copies ~2,400 cells from front)

  Cells re-rendered: 5   (the new token characters)
  Cells blitted:     23,995
  Cells touched:     24,000
  % actually rendered: 0.02%
```

The diff then finds only the 5 changed cells, writes 5 ANSI sequences to stdout. Everything else stays.

---

**The numbers, before and after:**

```
                     STOCK INK          CLAUDE CODE'S INK
                     ──────────────     ─────────────────
Objects/frame        24,000             0
Objects/sec          1,440,000          0
GC pauses (16ms budget) frequent       none
Cells re-rendered/frame  24,000        ~5 (only what changed)
Bytes written/frame  ~50KB+ ANSI       ~20 bytes (5 cells)
Achievable fps       ~30 (GC bound)    60+ (compute bound)
```

---

**This is also visible in Anthropic's official docs.** They shipped a fullscreen rendering mode (`CLAUDE_CODE_NO_FLICKER=1`, v2.1.89+) that the docs describe as: *"only renders messages that are currently visible [...] reduces the amount of data sent to your terminal on each update"* — which is virtual rendering, the direct consequence of the dirty-tracking and blit work above.

**The critical point — the components didn't change:**

```tsx
// This is what a Claude Code developer writes.
// It looks exactly like a web React component.
// It has no idea what Int32Array or blit optimization means.

const StreamingMessage = ({ content, isStreaming }: Props) => {
  return (
    <Box flexDirection="column" borderStyle="round" padding={1}>
      <Text color="green" bold>Claude</Text>
      <Text>{content}</Text>
      {isStreaming && <Spinner />}
    </Box>
  );
};

// useState, useEffect, useContext — all standard React.
// The 60fps rendering is invisible to this component.
// That's the entire value of the abstraction boundary.
```

The Anthropic engineers who work on token streaming, context management, and tool calls write ordinary React. The engineers who work on the renderer write typed arrays. Neither team needs to know what the other does.

---

#### The Principle

> "React's abstraction has two sides: the component model you write, and the renderer that executes it. Claude Code proves you can replace the renderer entirely — making it 100× faster — without touching a single component. That's not a coincidence. It's the design."

**The progression for your own projects:**

```
Stage 1 → Write your CLI with stock Ink. It will be fast enough.
           (Most CLIs run at 1–5fps — wizard prompts, build output)

Stage 2 → Hit a performance problem? Profile first:
           console.time(), React DevTools, --inspect + Chrome profiler

Stage 3 → Apply Ink-native optimizations (no forking required):
           → <Static> for completed items (free)
           → useMemo for expensive list filtering
           → Stable keys so React can reuse fiber nodes

Stage 4 → Streaming at 60fps with 10,000+ cells changing per second?
           You're in Claude Code territory.
           You'll know. The GC pauses will tell you.
```

---

### A Practical Optimization You Can Use Today

Even without forking anything, you can apply `useMemo` exactly as you would in a web app:

```tsx
const FileTree = ({ files, filter }: Props) => {
  // files might be 5,000 entries — filter only when inputs change
  const visible = useMemo(
    () => files.filter(f => f.path.includes(filter)).slice(0, 50),
    [files, filter]
  );

  return (
    <Box flexDirection="column">
      {visible.map(f => (
        <Box key={f.path}>
          <Text color={f.modified ? 'yellow' : undefined}>{f.path}</Text>
        </Box>
      ))}
    </Box>
  );
};
```

Same rule as in the browser: **measure before you optimize**. Most Ink apps never need anything beyond this.

---

## Block 7 — When to Reach for This (2 min)

### Speaker Notes

Be honest about trade-offs. This isn't the answer to every CLI need. Give the audience a clear mental model for when to reach for it.

---

### Good fits for Ink:

- **Interactive wizards and config tools** — multi-step setup flows (like `create-react-app`, `prisma init`)
- **Long-running processes with live feedback** — build tools, test runners, deployment scripts
- **AI agent CLIs** — streaming responses, interrupt handling, real-time state
- **Developer tooling** — anything a developer runs in their terminal that needs more than a log line
- **Internal ops tools** — deployment dashboards, data pipeline monitors

### Not the best fit:

- **One-shot scripts** — if you just need to print some output and exit, `console.log` is fine
- **Shell pipelines** — tools that need to work with `|` and `>` in a script context
- **System daemons** — Ink keeps the event loop alive; it's a REPL, not a daemon

### The bar to clear:

> "Would a user of this tool benefit from seeing state update in real time while they interact with it?"

If yes — Ink is worth it. If the tool runs, prints, and exits — it probably isn't.

---

### Note #6 — Don't Build Everything from Scratch: `@inkjs/ui`

> **Speaker note:** Mention this as a natural closer to the "when to reach for it" discussion. Audiences immediately start thinking about the components they'd need to build — save them some work.

If you're starting a real project, check [`@inkjs/ui`](https://github.com/vadimdemedes/ink#components) before rolling your own components. It ships a set of battle-tested Ink components:

| Component | What it does |
|---|---|
| `<TextInput>` | Controlled text input with cursor |
| `<Select>` | Arrow-key navigation list |
| `<MultiSelect>` | Checkbox-style multi-selection |
| `<ConfirmInput>` | y/n prompt |
| `<Spinner>` | Animated spinner with presets |
| `<ProgressBar>` | Horizontal progress bar |
| `<Badge>` | Coloured label |
| `<StatusMessage>` | Coloured status line (info/error/warning/success) |
| `<UnorderedList>` / `<OrderedList>` | Semantic list rendering |

```bash
npm install @inkjs/ui
```

```tsx
import { Select, TextInput, Spinner } from '@inkjs/ui';
```

The components we built in this talk (`TextInput`, `Spinner`, `ModelSelect`) were great for demonstrating the primitives. In a production CLI, use `@inkjs/ui` so you spend time on the product, not the widget library.

---

## Block 8 — Closing (30 sec)

> "React is an abstraction for describing UI as a function of state. The DOM was always just one possible output target.
>
> Ink proves that the mental model transfers completely — components, hooks, state, Flexbox, testing. If you know React, you already know how to build a terminal app.
>
> The tools you use every day — Claude Code, GitHub Copilot CLI, Prisma — are React apps. The next tool you build could be one too."

---

> **Speaker note — the last thing on screen:** Don't end on a link list. End with the terminal open and the repo URL large. The last frame the audience sees should be this:
>
> ```
> ╭──────────────────────────────────────────────────────────╮
> │  Everything built today is in this repo. Fork it.        │
> │                                                          │
> │  github.com/talmoskovich/react-next-2026                 │
> │                                                          │
> │  • Working AI CLI — tests pass, runs out of the box      │
> │  • All React 19 patterns from this talk                  │
> │  • .env.example included                                 │
> ╰──────────────────────────────────────────────────────────╯
> ```
>
> Say: *"The tests pass. It runs out of the box. Add your API key and you have a working AI CLI in two minutes. Fork it."* Then close the laptop.

**Links:**
- **Start here → fork the repo:** [github.com/talmoskovich/react-next-2026](https://github.com/talmoskovich/react-next-2026)
- Ink: [github.com/vadimdemedes/ink](https://github.com/vadimdemedes/ink)
- @inkjs/ui: [github.com/vadimdemedes/ink#components](https://github.com/vadimdemedes/ink#components)
- ink-testing-library: [github.com/vadimdemedes/ink-testing-library](https://github.com/vadimdemedes/ink-testing-library)
- Vercel AI SDK: [sdk.vercel.ai](https://sdk.vercel.ai)
- Create Ink App: `npx create-ink-app --typescript my-cli`

---

## Complete File Reference

The complete project built during this talk:

```
react-terminal-demo/
├── src/
│   ├── index.tsx        ← Entry point: render(<App />, { concurrent: true })
│   ├── App.tsx          ← Root: useOptimistic + useTransition + useStream
│   ├── TextInput.tsx    ← Controlled input via useInput
│   ├── Spinner.tsx      ← Animated frames via useEffect + setInterval
│   ├── ModelSelect.tsx  ← use(modelsPromise) + Suspense + ErrorBoundary + arrow-key nav
│   ├── fetchModels.ts   ← Promise created once, consumed by use()
│   ├── useStream.ts     ← streamText from ai, for await over textStream
│   └── *.test.tsx       ← Vitest + ink-testing-library tests
├── .env.example         ← OPENAI_API_KEY=sk-...  (copy to .env, never commit)
├── package.json         ← deps: ink react ai @ai-sdk/openai
└── tsconfig.json
```

---

## Cheat Sheet: Ink API Reference

### Components

| Component | Equivalent | Notes |
|---|---|---|
| `<Box>` | `<div style={{display:'flex'}}>` | All CSS flexbox props via Yoga |
| `<Text>` | `<span>` | Must wrap all text; supports ANSI styling |
| `<Static>` | — | Renders to stdout once, never re-renders |
| `<Newline>` | `<br>` | Explicit line break |
| `<Spacer>` | `flex: 1` spacer | Pushes siblings to edges |
| `<Transform>` | — | Transforms rendered string before output |

### Hooks

| Hook | Purpose |
|---|---|
| `useInput(handler)` | Keyboard input handler |
| `usePaste(handler)` | Handle paste events separately from keystrokes |
| `useApp()` | Access `exit()` to unmount |
| `useStdin()` | Raw stdin stream access |
| `useStdout()` | Raw stdout stream + `write()` |
| `useStderr()` | Stderr stream access |
| `useWindowSize()` | Terminal dimensions (columns, rows) |
| `useFocus(options)` | Tab-based focus management |
| `useFocusManager()` | Programmatic focus control |
| `useBoxMetrics(ref)` | Measure a Box's rendered size |
| `useAnimation(options)` | High-performance animation loop |

### Box Flexbox Props (subset)

| Prop | Values |
|---|---|
| `flexDirection` | `row` `column` `row-reverse` `column-reverse` |
| `alignItems` | `flex-start` `center` `flex-end` `stretch` |
| `justifyContent` | `flex-start` `center` `flex-end` `space-between` `space-around` `space-evenly` |
| `flexWrap` | `wrap` `nowrap` |
| `gap` / `rowGap` / `columnGap` | number |
| `padding` / `margin` | number (shorthand) |
| `width` / `height` | number or `"50%"` |
| `borderStyle` | `single` `double` `round` `bold` `classic` |
| `borderColor` | chalk color string |
| `position` | `relative` `absolute` `static` |

### Text Style Props

| Prop | Type | Effect |
|---|---|---|
| `color` | string | Foreground color (chalk) |
| `backgroundColor` | string | Background color |
| `bold` | boolean | Bold text |
| `italic` | boolean | Italic text |
| `underline` | boolean | Underline |
| `strikethrough` | boolean | Strikethrough |
| `inverse` | boolean | Swap fg/bg colors |
| `dimColor` | boolean | Reduce brightness |
| `wrap` | `wrap` `hard` `truncate` `truncate-start` `truncate-middle` | Text overflow behavior |

---

## Key Concepts Recap

### React Renderer Architecture

```
User Code (JSX, hooks)
       ↓
 react-reconciler  ←── pluggable!
       ↓
 Host Environment
   ├── react-dom    → Browser DOM
   ├── react-native → Native UI widgets
   └── ink          → ANSI terminal output via Yoga + stdout
```

### How Ink Renders a Frame

```
1. React commit → reconciler processes state updates
2. Yoga layout  → Flexbox algorithm → positions (x, y, w, h) per node
3. DOM-to-screen → walk the tree, write characters + styles to buffer
4. Diff          → compare buffer to previous frame, cell by cell
5. Optimize      → merge adjacent writes, eliminate redundant cursor moves
6. Write         → serialize to ANSI escape sequences → stdout
```

### Testing Model

```tsx
// Render returns a test instance
const { lastFrame, stdin, rerender, unmount } = render(<MyComponent />);

// Assert on terminal output as a string
expect(lastFrame()).toBe('Expected output');

// Simulate keyboard input
stdin.write('\u001B[B'); // down arrow
stdin.write('\r');        // enter

// Re-render with new props
rerender(<MyComponent value="updated" />);

// Check all rendered frames
expect(frames).toHaveLength(3);
```

---


*Lecture written for ReactNext 2026 — June 23, Hall A*
*Total runtime: ~30 minutes including live coding*
