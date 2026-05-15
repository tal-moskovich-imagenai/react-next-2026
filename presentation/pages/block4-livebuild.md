---
layout: section
---

# Block 4
## Live Build: An AI-Powered CLI

<!--
14 minutes. Type every line. Narrate as you go.
Have code/final/ ready as a safety net.
Goal: terminal app that streams AI responses token-by-token.
-->

---
layout: two-cols
---

## Step 1 — Scaffold <span class="text-sm font-mono text-gray-500">1 min</span>

```bash
mkdir react-terminal-demo && cd react-terminal-demo
npm init -y
npm install ink react ai @ai-sdk/openai
npm install -D typescript tsx @types/react @types/node
```

::right::

<v-click>

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

</v-click>

<v-click>

`package.json` additions:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch --env-file=.env src/index.tsx"
  }
}
```

</v-click>

---
layout: two-cols
---

## Step 2 — Shell Component <span class="text-sm font-mono text-gray-500">2 min</span>

`src/index.tsx`:

```tsx
import React from "react";
import { render } from "ink";
import { App } from "./App.js";

render(<App />, { concurrent: true });
```

<v-click>

`concurrent: true` enables React 19 features:
- `Suspense` + `use()`
- `useTransition`
- `useOptimistic`

Without it, these silently fall back.

</v-click>

::right::

<v-click>

`src/App.tsx`:

```tsx {all|3-4|6-11|12-13}
import React from "react";
import { Box, Text } from "ink";

export const App = () => (
  <Box flexDirection="column" padding={1}>
    <Box borderStyle="round"
         borderColor="cyan"
         paddingX={2} marginBottom={1}>
      <Text bold color="cyan">
        React Terminal Demo
      </Text>
    </Box>
    <Text>Hello from your terminal!</Text>
  </Box>
);
```

</v-click>

<v-click>

<TerminalFrame title="npm run dev">
  <div style="font-family: 'SF Mono', monospace; font-size: 13px; line-height: 1.6">
    <div style="color: #00D4FF">╭──────────────────────╮</div>
    <div style="color: #00D4FF">│ <span style="font-weight:bold">React Terminal Demo</span>  │</div>
    <div style="color: #00D4FF">╰──────────────────────╯</div>
    <div style="color: #F3EFF5">Hello from your terminal!</div>
  </div>
</TerminalFrame>

</v-click>

<!--
"Run npm run dev. The terminal shows a styled box. This is React. Same components, same mental model."
-->

---
layout: two-cols
---

## Step 3 — Input State <span class="text-sm font-mono text-gray-500">3 min</span>

`src/TextInput.tsx`:

```tsx {all|1-3|6-14|16-22}
export const TextInput = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  useInput((input, key) => {
    if (key.return) {
      onSubmit(value); setValue(""); return;
    }
    if (key.backspace || key.delete) {
      setValue(prev => prev.slice(0, -1)); return;
    }
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

::right::

<v-click>

<TerminalFrame title="controlled input">
  <div style="font-family: 'SF Mono', monospace; font-size: 14px; line-height: 1.8">
    <div style="color: #6E7681">› Ask me anything</div>
    <div style="color: #F5C518">You</div>
    <div style="padding-left: 12px; color: #F3EFF5">What is React?</div>
    <div style="margin-top: 8px">
      <span style="color: #00FF9C">❯ </span>
      <span style="color: #F3EFF5">type here</span>
      <span style="color: #00FF9C; animation: blink 1s infinite">█</span>
    </div>
  </div>
</TerminalFrame>

</v-click>

<v-click>

```diff
// App.tsx gets:
+ const [messages, setMessages] = useState([]);
+ const handleSubmit = (value) => {
+   if (value.trim())
+     setMessages(prev => [...prev, value]);
+ };
```

"Type into the terminal. State updates. UI re-renders. **This is React in your terminal.**"

</v-click>

---
layout: center
---

## The Most Important Decision in This Talk

<v-click>

<img src="/images/cli-vs-browser.svg" alt="useChat vs streamText" class="mx-auto rounded-lg" style="max-height: 400px" />

</v-click>

<!--
Pause here. This is the conceptual moment.
Most React devs' first instinct: useChat.
Don't do this in a CLI. There is no browser. There is no HTTP server.
You're in Node.js. Just call the model.
-->

---
layout: two-cols
---

## Step 4 — Streaming AI <span class="text-sm font-mono text-gray-500">5 min</span>

```bash
# .env
OPENAI_API_KEY=sk-...
```

`src/useStream.ts`:

```tsx {all|1-2|8-14|16-24}
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const useStream = (model = "gpt-4o-mini") => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const send = useCallback(async (messages) => {
    setContent(""); setError(null);
    let accumulated = "";

    const { textStream } = streamText({
      model: openai(model), messages,
      onError: ({ error }) => setError(error),
    });

    for await (const chunk of textStream) {
      accumulated += chunk;
      setContent(accumulated);
      // ↑ each call triggers Ink re-render
      // ↑ Ink writes new ANSI to stdout
    }

    return accumulated;
  }, [model]);

  return { content, error, send };
};
```

::right::

<v-click>

`src/Spinner.tsx`:

```tsx
const FRAMES = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];

export const Spinner = ({ label }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const t = setInterval(() =>
      setFrame(f => (f + 1) % FRAMES.length),
    80);
    return () => clearInterval(t);
  }, []);
  return (
    <Text color="cyan">
      {FRAMES[frame]} {label ?? "Thinking..."}
    </Text>
  );
};
```

</v-click>

<v-click>

<TerminalFrame title="streaming">
  <div style="font-family: 'SF Mono', monospace; font-size: 13px; line-height: 1.8">
    <div style="color: #F5C518; font-weight: bold">You</div>
    <div style="padding-left: 12px">What is Ink?</div>
    <div style="color: #00FF9C; font-weight: bold; margin-top:8px">AI</div>
    <div style="padding-left: 12px; color: #F3EFF5">Ink is a React renderer for the</div>
    <div style="padding-left: 12px; color: #F3EFF5">terminal. It lets you build CLI<span style="color:#00FF9C; animation: blink 1s infinite">█</span></div>
  </div>
</TerminalFrame>

</v-click>

---
layout: two-cols
---

## React 19: `useOptimistic` + `useTransition`

```tsx {all|3-4|6-10|12-16|18-22}
export const App = () => {
  const { exit } = useApp();
  const [messages, setMessages] = useState([]);
  const { content, error, send } = useStream(model);
  const [isPending, startTransition] = useTransition();

  const [optimisticMessages, addOptimisticMessage] =
    useOptimistic(messages,
      (current, newMsg) =>
        [...current, { ...newMsg, pending: true }]
    );

  const handleSubmit = (value) => {
    startTransition(async () => {
      const userMsg = { role: "user", content: value };
      addOptimisticMessage(userMsg);    // appears instantly

      const history = [...messages, userMsg];
      const finalText = await send(history);

      setMessages(prev => [...prev, userMsg,
        { role: "assistant", content: finalText }]);
    });
  };
```

::right::

<v-click>

### Before vs After (React 19)

| Before | After |
|--------|-------|
| `setMessages` immediately | `useOptimistic` — auto-reverts on error |
| `isStreaming` boolean | `isPending` from `useTransition` |
| Manual guard | React's scheduler handles priority |

</v-click>

<v-click>

The user's prompt appears **before a single byte arrives from the API.**

If the request fails, React **rolls back automatically.** No manual rollback code.

</v-click>

<!--
useOptimistic + useTransition are the key React 19 patterns.
The message appears instantly. The transition runs the async work.
React handles the pending state — you don't.
-->

---
layout: two-cols
---

## Step 5 — `use()` + Model Selector <span class="text-sm font-mono text-gray-500">3 min</span>

`src/fetchModels.ts`:

```tsx {all|4-6}
// Create ONCE — outside the component.
// React's use() reads the same Promise instance
// on every render — only fetches once.
export const modelsPromise = fetch(
  "https://api.openai.com/v1/models",
  { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
).then(r => r.json())
 .then(data => data.models
   .filter(m => m.id.startsWith("gpt"))
   .map(m => ({ id: m.id, label: m.id }))
   .slice(0, 6)
 );
```

::right::

<v-click>

`src/ModelSelect.tsx`:

```tsx {all|2|6-7|10-12}
const ModelList = ({ onSelect }) => {
  const models = use(modelsPromise); // React 19 ✨
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow)   setCursor(c => Math.max(0, c-1));
    if (key.downArrow) setCursor(c => Math.min(models.length-1, c+1));
    if (key.return)    onSelect(models[cursor].id);
  });

  // ↓ no isLoading · no useEffect · no empty array flash
  return models.map((m, i) => (
    <Text color={i === cursor ? "green" : undefined}>
      {i === cursor ? "❯ " : "  "}{m.label}
    </Text>
  ));
};

export const ModelSelect = ({ onSelect }) => (
  <ErrorBoundary>
    <Suspense fallback={<Spinner label="Loading models…" />}>
      <ModelList onSelect={onSelect} />
    </Suspense>
  </ErrorBoundary>
);
```

</v-click>

<!--
use() suspends the component until the Promise resolves.
No useEffect. No isLoading. No empty array on first render.
ALWAYS wrap use() in both Suspense AND ErrorBoundary.
-->

---
layout: two-cols
---

## Production Upgrade: `<Static>`

```tsx {all|5-14|16-24}
return (
  <Box flexDirection="column" padding={1}>
    <Header />

    {/* Committed messages — printed once, never re-rendered */}
    <Static items={messages}>
      {(msg, i) => (
        <Box key={i} flexDirection="column" marginBottom={1}>
          <Text color={msg.role === "user" ? "yellow" : "green"} bold>
            {msg.role === "user" ? "You" : "AI"}
          </Text>
          <Box paddingLeft={2}><Text>{msg.content}</Text></Box>
        </Box>
      )}
    </Static>

    {/* Live region — only this diffs on every token */}
    {isPending && (
      <Box flexDirection="column" marginBottom={1}>
        <Text color="green" bold>AI</Text>
        <Box paddingLeft={2}>
          {content ? <Text>{content}</Text> : <Spinner />}
        </Box>
      </Box>
    )}
    {!isPending && <TextInput onSubmit={handleSubmit} />}
  </Box>
);
```

::right::

<v-click>

### Why this matters

Without `<Static>`: 100-message conversation → Ink diffs all 100 boxes on every token.

With `<Static>`: diffs **exactly one region** — the current stream.

</v-click>

<v-click>

This is what lets Claude Code stay smooth in long conversations.

</v-click>

<!--
You don't have to live-code the Static upgrade — the demo already works.
Show this as a "here's how you'd take this to production" moment.
-->
