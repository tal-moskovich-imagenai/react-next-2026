---
layout: center
clicks: 4
---

## Ink in the wild — 4 patterns

<PatternStack :step="$clicks" />

<!--
After the live demo, audience just built a Wizard-pattern app.
Now: what are ALL the patterns?
[click 1-4] Each tile reveals
-->

---
layout: two-cols
---

## Stock Ink at 60fps — the math

<div class="math-block">
  <v-clicks>
    <div class="math-line">
      <span class="math-eq">200 × 120</span>
      <span class="math-eq-sep">=</span>
      <span class="math-val">24,000 cells/frame</span>
    </div>
    <div class="math-line">
      <span class="math-eq">× 1 object/cell</span>
      <span class="math-eq-sep">=</span>
      <span class="math-val">24,000 JS objects</span>
    </div>
    <div class="math-line">
      <span class="math-eq">× 60 frames/sec</span>
      <span class="math-eq-sep">=</span>
      <span class="math-val math-warn">1,440,000 objects/sec</span>
    </div>
    <div class="math-line">
      <span class="math-eq">V8 nursery fills</span>
      <span class="math-eq-sep">→</span>
      <span class="math-val math-warn">GC every ~10ms</span>
    </div>
    <div class="math-divider">────────────────────────────</div>
    <div class="math-result">
      <div class="math-result-row">frame budget: <span class="math-neutral">16ms</span></div>
      <div class="math-result-row">GC pause: <span class="math-warn">10–20ms</span></div>
      <div class="math-result-row">result: <span class="math-red">STUTTER</span></div>
    </div>
  </v-clicks>
</div>

::right::

<v-click>

```ts
// Stock Ink — per cell object
interface OutputEntry {
  char: string;
  foregroundColor?: string;
  backgroundColor?: string;
  bold?: boolean;
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

<style scoped>
.math-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  margin-top: 16px;
}

.math-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 13px;
  animation: fade-up 0.25s ease-out both;
}

.math-eq      { color: #3D5940; min-width: 160px; }
.math-eq-sep  { color: #3D5940; }
.math-val     { color: #C8DEC4; }
.math-warn    { color: #FF4A4A; }

.math-divider {
  color: #1E3320;
  font-size: 12px;
  margin: 4px 0;
}

.math-result {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: #0C0F0C;
  border: 1px solid #1E3320;
  border-radius: 4px;
}

.math-result-row {
  font-size: 13px;
  color: #3D5940;
}

.math-neutral { color: #C8DEC4; }
.math-red     { color: #FF4A4A; font-weight: 700; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

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

<div style="font-family:'JetBrains Mono',monospace; font-size:13px; margin-top:12px">
  <div style="color:#3D5940">new token arrives ──►</div>
  <div style="color:#C8DEC4; padding-left:16px">dirty:&nbsp;&nbsp;&nbsp;<span style="color:#3CFF7A">5 cells</span> rendered</div>
  <div style="color:#C8DEC4; padding-left:16px">blitted: <span style="color:#3CFF7A">23,995 cells</span></div>
  <div style="color:#C8DEC4; padding-left:16px">written: <span style="color:#3CFF7A">~20 bytes</span> ANSI</div>
</div>

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

<div class="result-table">
  <div class="table-line border">╔═══════════════╦══════════════╦══════════════╗</div>
  <div class="table-line header">║               ║  STOCK INK   ║ CLAUDE CODE  ║</div>
  <div class="table-line border">╠═══════════════╬══════════════╬══════════════╣</div>
  <div class="table-line">║ objects/frame ║ <span class="bad">   24,000    </span>║ <span class="good">      0      </span>║</div>
  <div class="table-line">║ GC pauses     ║ <span class="bad">  frequent   </span>║ <span class="good">    none     </span>║</div>
  <div class="table-line">║ cells/frame   ║ <span class="bad">   24,000    </span>║ <span class="good">     ~5      </span>║</div>
  <div class="table-line">║ bytes/frame   ║ <span class="bad">   ~50KB     </span>║ <span class="good">  ~20 bytes  </span>║</div>
  <div class="table-line">║ fps           ║ <span class="bad">    ~30      </span>║ <span class="good">    60+      </span>║</div>
  <div class="table-line border">╚═══════════════╩══════════════╩══════════════╝</div>
</div>

<style scoped>
.result-table {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}
.table-line { color: #3D5940; white-space: pre; line-height: 1.6; }
.table-line.border { color: #1E3320; }
.table-line.header { color: #C8DEC4; }
.bad  { color: #FF4A4A; }
.good { color: #3CFF7A; }
</style>

::right::

<v-click>

### The component still looks like this

```tsx
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

<div style="font-family:'JetBrains Mono',monospace; font-size:13px; color:#3CFF7A; margin-top:16px; line-height:1.8">
  React stays.<br/>
  The renderer was rewritten.<br/>
  The components didn't change.<br/>
  <span style="color:#C8DEC4">That's the abstraction.</span>
</div>

</v-click>

---
layout: center
---

## Your progression

<div class="stages">
  <v-click>
    <div class="stage stage-1">
      <div class="stage-label">Stage 1</div>
      <div class="stage-box">
        <div class="stage-title">Stock Ink</div>
        <div class="stage-desc">1–5fps</div>
        <div class="stage-note">most CLIs</div>
      </div>
    </div>
  </v-click>
  <div class="stage-arrow">→</div>
  <v-click>
    <div class="stage stage-2">
      <div class="stage-label">Stage 2</div>
      <div class="stage-box">
        <div class="stage-title">Profile</div>
        <div class="stage-desc">first</div>
        <div class="stage-note">DevTools · --inspect</div>
      </div>
    </div>
  </v-click>
  <div class="stage-arrow">→</div>
  <v-click>
    <div class="stage stage-3">
      <div class="stage-label">Stage 3</div>
      <div class="stage-box">
        <div class="stage-title">&lt;Static&gt;</div>
        <div class="stage-desc">useMemo</div>
        <div class="stage-note">common fix</div>
      </div>
    </div>
  </v-click>
  <div class="stage-arrow">→</div>
  <v-click>
    <div class="stage stage-4">
      <div class="stage-label">Stage 4</div>
      <div class="stage-box stage-warn-box">
        <div class="stage-title">60fps</div>
        <div class="stage-desc warn-text">⚠ rare</div>
        <div class="stage-note warn-text">Claude Code terr.</div>
      </div>
    </div>
  </v-click>
</div>

<style scoped>
.stages {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  justify-content: center;
  margin-top: 24px;
}

.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: fade-up 0.3s ease-out both;
}

.stage-label {
  font-size: 10px;
  color: #3D5940;
  letter-spacing: 0.04em;
}

.stage-box {
  width: 120px;
  padding: 12px 8px;
  border: 1px solid #1E3320;
  background: #0C0F0C;
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stage-warn-box {
  border-color: #FF4A4A;
  background: #0F0C0C;
}

.stage-title {
  font-size: 14px;
  font-weight: 700;
  color: #C8DEC4;
}

.stage-desc {
  font-size: 12px;
  color: #3CFF7A;
}

.stage-note {
  font-size: 10px;
  color: #3D5940;
}

.warn-text { color: #FF4A4A !important; }

.stage-arrow {
  font-size: 18px;
  color: #1E3320;
  flex-shrink: 0;
  padding-top: 20px;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<!--
"Apply optimizations progressively. Don't optimize upfront."
-->
