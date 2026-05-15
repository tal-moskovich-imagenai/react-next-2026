---
layout: section
---

# Block 3
## Core API

<!--
5 minutes. Type each snippet as you talk. Show output live.
-->

---
layout: two-cols
---

## Installation

```bash
npm install ink react

# TypeScript (recommended):
npx create-ink-app --typescript my-cli
```

<v-click>

### The simplest possible Ink app

```tsx
import React from "react";
import { render, Text } from "ink";

const Hello = () => (
  <Text color="green">Hello, ReactNext!</Text>
);

render(<Hello />);
```

```bash
node --loader tsx hello.tsx
```

</v-click>

<v-click>

That's your first terminal app in React.

</v-click>

::right::

<v-click>

<TerminalFrame title="hello.tsx">
  <div style="font-family: 'SF Mono', monospace; font-size: 14px">
    <span style="color: #00FF9C">Hello, ReactNext!</span>
  </div>
</TerminalFrame>

</v-click>

---
layout: two-cols
---

## `<Text>` — Styled Text

```tsx
<Text color="green">Green text</Text>
<Text color="#005cc5">Hex blue</Text>
<Text bold>Bold</Text>
<Text italic>Italic</Text>
<Text underline>Underline</Text>
<Text inverse>Inversed</Text>
<Text backgroundColor="red" color="white">
  Red bg
</Text>
```

<v-click>

Text wrapping:

```tsx
<Box width={20}>
  <Text wrap="truncate">
    This is a very long string...
  </Text>
</Box>
// => "This is a very long…"
```

</v-click>

::right::

<TerminalFrame title="Text styles">
  <div style="font-family: 'SF Mono', monospace; font-size: 14px; line-height: 2">
    <div style="color: #27C93F">Green text</div>
    <div style="color: #005cc5">Hex blue</div>
    <div style="font-weight: bold; color: #F3EFF5">Bold</div>
    <div style="font-style: italic; color: #F3EFF5">Italic</div>
    <div style="text-decoration: underline; color: #F3EFF5">Underline</div>
    <div style="background: #F3EFF5; color: #0D1117">Inversed</div>
    <div style="background: #FE4A49; color: white">Red bg</div>
  </div>
</TerminalFrame>

---
layout: two-cols
---

## `<Box>` — Flexbox Layout

```tsx
// Row (default)
<Box gap={2}>
  <Text>Left</Text>
  <Text>Right</Text>
</Box>

// Column with border
<Box flexDirection="column"
     borderStyle="round" padding={1}>
  <Text bold>Title</Text>
  <Text dimColor>Subtitle</Text>
</Box>
```

<v-click>

Border styles:

```
single  ┌─────┐   double  ╔═════╗
round   ╭─────╮   bold    ┏━━━━━┓
```

</v-click>

::right::

<TerminalFrame title="Box layout">
  <div style="font-family: 'SF Mono', monospace; font-size: 13px; line-height: 1.8">
    <div style="color: #F3EFF5">Left&nbsp;&nbsp;Right</div>
    <div style="margin-top: 12px; border: 1px solid #F3EFF5; border-radius: 4px; padding: 8px; display: inline-block">
      <div style="font-weight: bold; color: #F3EFF5">Title</div>
      <div style="color: #6E7681">Subtitle</div>
    </div>
  </div>
</TerminalFrame>

<v-click>

<TerminalFrame title="justifyContent">
  <div style="font-family: 'SF Mono', monospace; font-size: 13px; display: flex; justify-content: space-between; width: 100%">
    <span style="color: #F3EFF5">Left</span>
    <span style="color: #F3EFF5">Right</span>
  </div>
</TerminalFrame>

</v-click>

---
layout: two-cols
---

## `useInput` — Keyboard Navigation

```tsx {all|5-7|8-10|11-13|14-16}
import { useInput } from "ink";

const Nav = () => {
  useInput((input, key) => {
    if (key.upArrow)   { /* move up */ }
    if (key.downArrow) { /* move down */ }
    if (key.return)    { /* select */ }
    if (input === "q") { /* quit */ }
    if (key.ctrl && input === "c") {
      /* force quit */
    }
  });
  return <Text>↑↓ navigate, Q quit</Text>;
};
```

::right::

<v-click>

### Full key object

<TerminalFrame title="key properties">
  <div style="font-family: 'SF Mono', monospace; font-size: 12px; line-height: 1.8; color: #5EADF2">
    leftArrow · rightArrow · upArrow · downArrow<br/>
    return · escape · ctrl · shift · tab<br/>
    backspace · delete · pageUp · pageDown<br/>
    home · end · meta
  </div>
</TerminalFrame>

</v-click>

<v-click>

### `useApp` — lifecycle

```tsx
const { exit } = useApp();

useEffect(() => {
  doWork().then(() => exit());
}, []);
```

</v-click>

---
layout: two-cols
---

## `<Static>` — High-Performance Output

For items that render **once and never change**:

```tsx {1-8|10-14}
<Static items={completedSteps}>
  {(step) => (
    <Box key={step.id}>
      <Text color="green">✔ {step.label}</Text>
    </Box>
  )}
</Static>

{/* Only this keeps updating */}
<Text>
  Progress: {completedSteps.length}/{total}
</Text>
```

<v-click>

`Static` renders items **directly to stdout** and never re-renders them.

Used by Gatsby, tap, Turborepo for thousands of completed steps.

</v-click>

::right::

<v-click>

## `useWindowSize` — Responsive

```tsx {all|3-8|10-18}
const { columns, rows } = useWindowSize();

// Narrow: stack vertically
if (columns < 80) return (
  <Box flexDirection="column">
    <Sidebar /><Main />
  </Box>
);

// Wide: side by side
return (
  <Box>
    <Box width={24} flexShrink={0}>
      <Sidebar />
    </Box>
    <Box flexGrow={1}><Main /></Box>
  </Box>
);
```

</v-click>

<!--
Static is a payoff for the <Static> concept you just explained.
useWindowSize updates in real time as the user resizes — same as useMediaQuery.
-->
