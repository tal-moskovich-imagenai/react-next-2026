---
layout: section
---

# Block 6
## At Scale

<!--
4 minutes. This is the "deeper than the docs" moment.
Most talks stop at "here's how to use the library."
Anchor on Claude Code — familiar to this audience.
-->

---
layout: two-cols
---

## The spectrum of Ink usage

<v-clicks>

**Pattern 1: The Wizard** (Prisma, create-react-app)

Runs once. Asks questions. Exits. Stock Ink, zero optimization needed.

**Pattern 2: Progress Display** (Gatsby, Turborepo)

Hundreds of items. Use `<Static>` — already shown.

**Pattern 3: Live Dashboard** (Wrangler, Linear)

Multiple panes updating simultaneously. Use `useWindowSize()` + split layout.

</v-clicks>

<v-click>

**Pattern 4: Where stock Ink hits its ceiling...**

</v-click>

::right::

<v-click>

<TerminalFrame title="prisma init">
  <div style="font-family: 'SF Mono', monospace; font-size: 13px; line-height: 1.8">
    <div style="font-weight: bold; color: #F3EFF5">Which database?</div>
    <div style="color: #00FF9C">❯ PostgreSQL</div>
    <div style="color: #F3EFF5">&nbsp;&nbsp;MySQL</div>
    <div style="color: #F3EFF5">&nbsp;&nbsp;SQLite</div>
    <div style="color: #6E7681; margin-top: 8px">↑↓ navigate · Enter confirm</div>
  </div>
</TerminalFrame>

</v-click>

---
layout: quote
---

> "This might sound weird, but the way we build this is we want people to **feel the model as raw as possible**.
> Every time there's a new model release, we **delete a bunch of code**.
> With the 4.0 models, we deleted around half the system prompt."

<div class="mt-4 text-sm font-mono" style="color: #6E7681">
  Boris Cherny, Pragmatic Engineer interview, Sep 2025
</div>

<v-click>

<div class="mt-6 font-mono text-base" style="color: var(--slidev-theme-color)">
  The complexity in Claude Code's renderer isn't there because they love complexity.<br/>
  It's there because they <span style="color: var(--slidev-theme-accents-teal)">exhausted every simpler option first.</span>
</div>

</v-click>

---
layout: two-cols
---

## Stock Ink at 60fps — the math

<v-clicks>

Terminal: 200 × 120 = **24,000 cells**

Per frame: 24,000 `OutputEntry` JS objects created

At 60 tokens/sec: **1,440,000 objects/second**

V8's nursery fills every ~10ms → GC scavenger runs

Budget: 16ms. GC pause: 10–20ms.

**Result: frame spikes 25–30ms → visible stutter**

</v-clicks>

::right::

<v-click>

```ts
// Stock Ink — per cell object
interface OutputEntry {
  char: string;
  foregroundColor?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  // ... 4 more props
}

// Full screen on every frame:
const screen: OutputEntry[][] =
  Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () =>
      ({ char: ' ' })
    )
  ); // ← 24,000 objects, EVERY FRAME
```

</v-click>

<v-click>

```
Frame spike: 24.3ms
Frame spike: 31.7ms  ← GC mid-commit
Frame spike: 22.1ms
```

</v-click>

<!--
You can reproduce this locally and watch it happen.
The token stream stutters. Users notice.
-->

---
layout: center
---

## Optimization 1: Typed Arrays

<DiffCounter />

<!--
[Auto-animates: counts from 0 to 24,000, then counts optimized from 24,000 to 0]
Before: 1,440,000 objects/sec. After: 0.
-->

---
layout: two-cols
---

## Packed Int32Array

```ts {all|4-5|8-10|13-16}
// One Int32Array for the whole screen
// Word 0: character codepoint
// Word 1: style ID (index into shared pool)

class Screen {
  private buffer: Int32Array;

  constructor(rows: number, cols: number) {
    // ONE allocation — reused every frame
    this.buffer = new Int32Array(
      rows * cols * 2
    );
  }

  // Diff = two integer comparisons per cell
  // No object property access
  cellEquals(other: Screen, r: number, c: number) {
    const o = (r * this.cols + c) * 2;
    return this.buffer[o]   === other.buffer[o]
        && this.buffer[o+1] === other.buffer[o+1];
  }
}
```

::right::

<v-click>

## Optimization 2: Double Buffer

<img src="/images/double-buffer.svg" alt="Double buffering" class="w-full rounded-lg" />

</v-click>

---
layout: two-cols
---

## Optimization 3: Dirty Tracking + Blit

<img src="/images/dirty-blit.svg" alt="Dirty blit" class="w-full rounded-lg" />

::right::

<v-click>

```ts {all|4-8|10-14}
function renderNode(node, back, front) {
  const pos = getYogaPosition(node);

  if (!node.dirty && posEq(pos, node.cachedPos)) {
    // BLIT: copy from front buffer — skip subtree
    blitRegion(front, back, pos);
    return;
  }

  // Only dirty nodes actually render
  for (const child of node.children)
    renderNode(child, back, front);

  node.dirty = false;
  node.cachedPos = pos;
}
```

</v-click>

<v-click>

One new token arrives:
- **Dirty nodes:** `<StreamingText>` (5 cells)
- **Blitted:** everything else (23,995 cells)
- **ANSI written:** ~20 bytes

</v-click>

<!--
React stays. The renderer was rewritten.
The components didn't change.
THAT is the value of the abstraction.
-->

---
layout: two-cols
---

## The result

```
                 STOCK INK     CLAUDE CODE
Objects/frame    24,000        0
GC pauses        frequent      none
Cells/frame      24,000        ~5
Bytes/frame      ~50KB ANSI    ~20 bytes
fps              ~30           60+
```

<v-click>

Boris Cherny, HN 2025:
> "We started by using Ink, and at this point it's **our own framework** due to the number of changes we've made to it over the months."

</v-click>

::right::

<v-click>

### The component still looks like this

```tsx
// A Claude Code developer writes this.
// No Int32Array. No blit. Just React.
const StreamingMessage = ({ content, isStreaming }) => (
  <Box flexDirection="column"
       borderStyle="round" padding={1}>
    <Text color="green" bold>Claude</Text>
    <Text>{content}</Text>
    {isStreaming && <Spinner />}
  </Box>
);
```

</v-click>

<v-click>

**The 60fps rendering is invisible to this component.**

That's the entire value of the abstraction boundary.

</v-click>

---
layout: center
---

## Your progression

```
Stage 1 → Write with stock Ink. It will be fast enough.
           (Most CLIs: 1–5fps — wizard prompts, build output)

Stage 2 → Hit a problem? Profile first.
           console.time() · React DevTools · --inspect

Stage 3 → Ink-native fixes (no fork required):
           <Static> for completed items (free)
           useMemo for expensive filtering
           Stable keys for fiber reuse

Stage 4 → 60fps + 10,000 cells/sec?
           You're in Claude Code territory.
           You'll know. The GC pauses will tell you.
```

<!--
"Apply optimizations progressively. Don't optimize upfront."
-->
