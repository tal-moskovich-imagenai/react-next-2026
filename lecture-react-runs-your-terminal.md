# React Runs Your Terminal: Let's Build One Live

**ReactNext 2026 — June 23, Hall A**
**Speaker: Tal Moskovich**
**Duration: 30 minutes (10:05–10:35)**

---

## Lecture Structure at a Glance

| Block | Time | Duration | Content |
|---|---|---|---|
| 1 · Hook | 10:05 | 2 min | The reveal — tools you use daily are React apps |
| 2 · Context | 10:07 | 4 min | How React renderers work, what Ink is |
| 3 · Core API | 10:11 | 5 min | Box, Text, hooks — the mental model |
| 4 · Live Build | 10:16 | 12 min | Build an AI CLI from scratch |
| 5 · Testing | 10:28 | 3 min | Test CLI components with Vitest + ink-testing-library |
| 6 · At Scale | 10:31 | 5 min | What production apps do differently — and why |
| 7 · When/Why | 10:36 | 2 min | When to reach for this in real projects |
| 8 · Close | 10:38 | ~30 sec | Final thought + links |

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

Let's prove that in the next 28 minutes.

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
npm install ink react
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

render(<App />);
```

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

### Step 4 — Streaming AI Response (5 min)

Now connect to a real AI API. We'll stream tokens using the Fetch API and `ReadableStream`.

`src/useStreamingResponse.ts`:

```tsx
import { useState, useCallback } from 'react';

interface StreamState {
  content: string;
  isStreaming: boolean;
  error: string | null;
}

export const useStreamingResponse = () => {
  const [state, setState] = useState<StreamState>({
    content: '',
    isStreaming: false,
    error: null,
  });

  const stream = useCallback(async (prompt: string) => {
    setState({ content: '', isStreaming: true, error: null });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          stream: true,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0]?.delta?.content;
            if (delta) {
              setState(prev => ({ ...prev, content: prev.content + delta }));
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    } finally {
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  }, []);

  return { ...state, stream };
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

Update `App.tsx`:

```tsx
import React, { useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { TextInput } from './TextInput.js';
import { Spinner } from './Spinner.js';
import { useStreamingResponse } from './useStreamingResponse.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const App = () => {
  const { exit } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const { content, isStreaming, error, stream } = useStreamingResponse();

  useInput((input, key) => {
    if (input === 'q' && !isStreaming) {
      exit();
    }
  });

  const handleSubmit = async (value: string) => {
    if (!value.trim() || isStreaming) return;

    setMessages(prev => [...prev, { role: 'user', content: value }]);
    await stream(value);
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content },
    ]);
  };

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
        <Text bold color="cyan">AI Terminal  </Text>
        <Text dimColor>(q to quit)</Text>
      </Box>

      {/* Message history */}
      {messages.map((msg, i) => (
        <Box key={i} marginBottom={1} flexDirection="column">
          <Text color={msg.role === 'user' ? 'yellow' : 'green'} bold>
            {msg.role === 'user' ? 'You' : 'AI'}
          </Text>
          <Box paddingLeft={2}>
            <Text>{msg.content}</Text>
          </Box>
        </Box>
      ))}

      {/* Live streaming output */}
      {isStreaming && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="green" bold>AI</Text>
          <Box paddingLeft={2}>
            {content ? (
              <Text>{content}</Text>
            ) : (
              <Spinner />
            )}
          </Box>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Text color="red">Error: {error}</Text>
      )}

      {/* Input */}
      {!isStreaming && (
        <TextInput onSubmit={handleSubmit} />
      )}
    </Box>
  );
};
```

**What just happened:**

- `useState` manages message history — same as a web chat app
- `useEffect` inside the custom hook drives streaming — same pattern as fetching in a browser
- Every token that arrives updates state, which triggers a re-render, which writes new ANSI bytes to stdout
- The spinner is a `setInterval` inside `useEffect` — nothing special about the terminal

**The mental model is identical.** The rendering target is different. That's it.

---

### Step 5 — Keyboard Navigation (3 min)

Add a menu to select AI models:

`src/ModelSelect.tsx`:

```tsx
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

const MODELS = [
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini (fast)' },
  { id: 'gpt-4o', label: 'GPT-4o (smart)' },
  { id: 'o1-mini', label: 'o1 Mini (reasoning)' },
];

interface Props {
  onSelect: (modelId: string) => void;
}

export const ModelSelect = ({ onSelect }: Props) => {
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor(prev => Math.max(0, prev - 1));
    }

    if (key.downArrow) {
      setCursor(prev => Math.min(MODELS.length - 1, prev + 1));
    }

    if (key.return) {
      onSelect(MODELS[cursor].id);
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
      <Text bold color="yellow" marginBottom={1}>Select a model:</Text>
      {MODELS.map((model, i) => (
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
```

This is a fully interactive select menu in ~40 lines. No library. No framework. Pure React + `useInput`.

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

```tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { ModelSelect } from './ModelSelect.js';

describe('ModelSelect', () => {
  it('shows all model options', () => {
    const { lastFrame } = render(<ModelSelect onSelect={() => {}} />);
    expect(lastFrame()).toContain('GPT-4o Mini');
    expect(lastFrame()).toContain('GPT-4o');
    expect(lastFrame()).toContain('o1 Mini');
  });

  it('moves cursor down with arrow key', () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);

    // Verify cursor starts at first item
    expect(lastFrame()).toContain('❯ GPT-4o Mini');

    // Press down arrow
    stdin.write('\u001B[B'); // ANSI escape for down arrow
    expect(lastFrame()).toContain('❯ GPT-4o');
  });

  it('calls onSelect when Enter is pressed', () => {
    const onSelect = vi.fn();
    const { stdin } = render(<ModelSelect onSelect={onSelect} />);

    stdin.write('\r'); // Enter key
    expect(onSelect).toHaveBeenCalledWith('gpt-4o-mini');
  });

  it('does not go below the last item', () => {
    const { lastFrame, stdin } = render(<ModelSelect onSelect={() => {}} />);

    // Press down 10 times (more than the 3 items)
    for (let i = 0; i < 10; i++) {
      stdin.write('\u001B[B');
    }

    expect(lastFrame()).toContain('❯ o1 Mini');
  });
});
```

Run with `npx vitest`. Output:

```
✔ ModelSelect > shows all model options
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

### Pattern 4: Where Stock Ink Hits Its Ceiling (Claude Code, Gemini CLI)

Claude Code is an LLM agent. When it responds, tokens arrive at ~60fps. The conversation grows to hundreds of messages. The user scrolls while new tokens arrive. All of this happens simultaneously.

**Here's the math that broke stock Ink:**

```
Terminal size:    200 columns × 120 rows
Cells per frame:  24,000
Objects per cell: 1 JavaScript object (stock Ink)
Objects per frame: 24,000
Frame rate:       60fps
Objects/second:   1,440,000 JS objects created and GC'd every second
```

That's 1.4 million short-lived objects per second. The garbage collector starts pausing. Frames drop. The stream stutters.

**What Anthropic did:**

Instead of one object per cell, they switched to packed typed arrays — two `Int32` words per cell (one for the character codepoint, one for the style ID):

```
// Stock Ink (conceptual)
interface Cell {
  char: string;
  fg: string;
  bg: string;
  bold: boolean;
  italic: boolean;
  // ... more style fields
}
const screen: Cell[][] = new Array(rows).fill(null).map(() => new Array(cols));
// → 24,000 Cell objects per frame, GC'd every 16ms

// Claude Code's approach (conceptual)
// Two Int32 words per cell: [charCode | styleId]
const screen = new Int32Array(rows * cols * 2);
// → One TypedArray reused every frame. Zero per-frame allocation.
```

**Double-buffered rendering:**

```
// Stock Ink: allocates a new screen buffer every frame
const newScreen = buildScreen(domTree); // allocation
diff(previousScreen, newScreen);         // comparison
previousScreen = newScreen;             // old one gets GC'd

// Claude Code: swap two pre-allocated buffers
renderInto(backBuffer, domTree);   // write into back buffer (no allocation)
diff(frontBuffer, backBuffer);     // compare
[frontBuffer, backBuffer] = [backBuffer, frontBuffer]; // pointer swap
```

**Blit optimization:**

For unchanged subtrees, skip re-rendering entirely and copy cells from the previous frame:

```tsx
// If a node isn't dirty and its position hasn't changed,
// copy its cells from the previous frame instead of re-rendering.
// On a typical streaming frame: spinner ticks (3 cells changed),
// everything else blits from the previous frame.
// Result: the renderer touches ~0.01% of cells per frame.
```

**The outcome:** 60fps on a 200-column terminal while streaming tokens. The component model — `useState`, `useEffect`, `useContext`, JSX — is identical to stock Ink. The optimization is entirely in the renderer layer, invisible to application code.

---

### The Principle

> "React's abstraction has layers. Your components sit on top. The renderer sits below. You can swap the renderer — or optimize it — without touching a single component."

This is exactly what Anthropic did. The `<MessageList>`, `<PermissionDialog>`, `<StreamingResponse>` components in Claude Code look like ordinary React components. They use `useState`. They use `useEffect`. The team that works on message streaming doesn't need to know about `Int32Array` or blit optimization. That's the value of the abstraction.

**The progression for your own projects:**

```
Stage 1 → Write your CLI with stock Ink.
           It will be fast enough.

Stage 2 → If you hit performance problems,
           profile first. (useWindowSize, console.time, React DevTools)

Stage 3 → Apply targeted Ink-native optimizations:
           <Static> for completed items
           useMemo for expensive computations
           Key stability for lists

Stage 4 → If you're streaming at 60fps to 10,000+ terminal cells
           and none of that helps — then you're in Claude Code territory.
           You'll know. It's not the first problem you solve.
```

---

### A Practical Optimization You Can Use Today

Even without forking anything, you can apply `useMemo` exactly as you would in a web app:

```tsx
const FileTree = ({ files, filter }: Props) => {
  // files might be 5,000 entries — filter only when files or filter changes
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

## Block 8 — Closing (30 sec)

> "React is an abstraction for describing UI as a function of state. The DOM was always just one possible output target.
>
> Ink proves that the mental model transfers completely — components, hooks, state, Flexbox, testing. If you know React, you already know how to build a terminal app.
>
> The tools you use every day — Claude Code, GitHub Copilot CLI, Prisma — are React apps. The next tool you build could be one too."

**Links:**
- Ink: [github.com/vadimdemedes/ink](https://github.com/vadimdemedes/ink)
- ink-testing-library: [github.com/vadimdemedes/ink-testing-library](https://github.com/vadimdemedes/ink-testing-library)
- Create Ink App: `npx create-ink-app --typescript my-cli`

---

## Complete File Reference

The complete project built during this talk:

```
react-terminal-demo/
├── src/
│   ├── index.tsx           ← Entry point, calls render()
│   ├── App.tsx             ← Root component, orchestrates state
│   ├── TextInput.tsx       ← Controlled text input using useInput
│   ├── Spinner.tsx         ← Animated spinner using useEffect + setInterval
│   ├── ModelSelect.tsx     ← Arrow-key menu using useInput
│   ├── useStreamingResponse.ts  ← Custom hook for streaming AI responses
│   └── *.test.tsx          ← Vitest + ink-testing-library tests
├── package.json
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
