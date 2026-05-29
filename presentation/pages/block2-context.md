---
layout: center
clicks: 6
---

## The Three Layers

<ArchitectureDiagram :step="$clicks" />

<!--
[click 1] Layer 1 — "This is what most React devs see: components, JSX, hooks"
[click 2] Layer 2 — "The reconciler is what React actually IS"
[click 3] Pluggable badge — "Layer 3 is a plug: you can swap the renderer"
[click 4] react-dom — "Browser: what you already know"
[click 5] react-native — "iOS/Android: same model, different target"
[click 6] ink — "TODAY: we plug in a terminal renderer"
-->

---
layout: center
---

## The terminal has no DOM

<div class="stream-viz">
  <!-- Stream diagram -->
  <div class="stream-row">
    <div class="stream-node">
      <div class="node-icon">⌨</div>
      <div class="node-label">keyboard</div>
    </div>
    <div class="stream-arrow">
      <div class="arrow-line"></div>
      <div class="arrow-label">stdin</div>
    </div>
    <div class="stream-node node-center">
      <div class="node-icon">⚙</div>
      <div class="node-label">Node.js process</div>
    </div>
    <div class="stream-arrow">
      <div class="arrow-line"></div>
      <div class="arrow-label">stdout</div>
    </div>
    <div class="stream-node">
      <div class="node-icon">▬</div>
      <div class="node-label">terminal</div>
    </div>
  </div>

  <!-- Ink's solution callouts -->
  <div class="ink-solution">
    <v-click>
      <div class="solution-item">
        <span class="sol-num">1.</span>
        <span class="sol-key">Yoga</span>
        <span class="sol-desc">Flexbox algorithm → (row, col) per node</span>
      </div>
    </v-click>
    <v-click>
      <div class="solution-item">
        <span class="sol-num">2.</span>
        <span class="sol-key">ANSI</span>
        <span class="sol-desc">positions → escape sequences</span>
      </div>
    </v-click>
    <v-click>
      <div class="solution-item">
        <span class="sol-num">3.</span>
        <span class="sol-key">stdout</span>
        <span class="sol-desc">only changed cells written</span>
      </div>
    </v-click>
  </div>
</div>

<style scoped>
.stream-viz {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  font-family: 'JetBrains Mono', monospace;
  margin-top: 16px;
}

.stream-row {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  max-width: 700px;
  justify-content: center;
}

.stream-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  border: 1px solid #1E3320;
  background: #0C0F0C;
  border-radius: 6px;
  min-width: 120px;
}
.node-center {
  border-color: #3CFF7A;
  background: #0C150C;
}
.node-icon {
  font-size: 22px;
  color: #3D5940;
}
.node-center .node-icon { color: #3CFF7A; }
.node-label {
  font-size: 11px;
  color: #3D5940;
  text-align: center;
}
.node-center .node-label { color: #C8DEC4; }

.stream-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  max-width: 100px;
}
.arrow-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #1E3320, #3CFF7A, #1E3320);
  position: relative;
}
.arrow-line::after {
  content: '►';
  position: absolute;
  right: -8px;
  top: -8px;
  color: #3CFF7A;
  font-size: 10px;
}
.arrow-label {
  font-size: 11px;
  color: #3CFF7A;
  font-weight: 600;
}

.ink-solution {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
}

.solution-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 16px;
  border: 1px solid #1E3320;
  background: #0C0F0C;
  border-radius: 4px;
  animation: fade-up 0.25s ease-out both;
}
.sol-num { color: #3D5940; font-size: 13px; min-width: 20px; }
.sol-key { color: #3CFF7A; font-size: 14px; font-weight: 700; min-width: 70px; }
.sol-desc { color: #C8DEC4; font-size: 13px; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<!--
Yoga runs the full Flexbox algorithm — flex-direction, align-items, justify-content, gap — and returns pixel positions.
Ink converts those positions into ANSI escape sequences.
-->

---
layout: center
clicks: 6
---

## ANSI Escape Sequences

<AnsiExplainer :step="$clicks" />

<!--
[click 1] ESC annotation — "\x1b[ is the Control Sequence Introducer"
[click 2] 32=green lights up — "32 means green foreground"
[click 3] m=end — "m closes the sequence"
[click 4] 0=reset lights up — "0 resets all styles"
[click 5] Terminal renders result — "This is what the terminal draws"
[click 6] More examples + footer badge
-->

---
layout: center
clicks: 6
---

## The Full Render Cycle

<div class="flex justify-center mt-4">
  <PipelineFlow :currentStep="$clicks" />
</div>

<!--
[click 0] Shows step 1 lit — setState()
[click 1] Step 2 — React runs components
[click 2] Step 3 — Reconciler diffs
[click 3] Step 4 — Yoga layout
[click 4] Step 5 — Cell diff
[click 5] Step 6 — Write ANSI

"Same mental model as React's DOM reconciliation.
Produce a diff. Apply only what changed.
But the DOM is a 2D array of terminal cells."
-->

---
layout: center
---

## Cell-level diffing

<div class="cell-diff-root">
  <!-- Left: naive -->
  <TerminalFrame title="naive approach" borderColor="#FF4A4A" class="diff-frame">
    <div class="diff-body">
      <div class="diff-line"><span class="ansi-red">\x1b[2J</span> <span class="diff-comment">← clear screen</span></div>
      <div class="diff-line">[reprint 1,920 cells]</div>
      <div class="diff-badge badge-red">~~~~ FLICKER ~~~~</div>
    </div>
  </TerminalFrame>

  <!-- Right: ink -->
  <TerminalFrame title="ink cell-diff" borderColor="#3CFF7A" class="diff-frame">
    <div class="diff-body">
      <div class="diff-line"><span class="ansi-green">\x1b[2;5H</span> <span class="diff-comment">← move cursor</span></div>
      <div class="diff-line">Counter: 1</div>
      <div class="diff-line diff-dim">[9 other cells unchanged]</div>
      <div class="diff-badge badge-green">~10 bytes</div>
    </div>
  </TerminalFrame>
</div>

<div class="diff-caption">
  80 × 24 = 1,920 cells · one word changed · Ink writes <span style="color:#3CFF7A">10 bytes</span>
</div>

<style scoped>
.cell-diff-root {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 16px;
}

.diff-frame {
  width: 340px;
}

.diff-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.diff-line {
  color: #C8DEC4;
}
.diff-dim { color: #3D5940; }
.diff-comment { color: #3D5940; font-size: 11px; }

.ansi-red   { color: #FF4A4A; font-weight: 700; }
.ansi-green { color: #3CFF7A; font-weight: 700; }

.diff-badge {
  margin-top: 8px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
}
.badge-red  { background: rgba(255,74,74,0.15); color: #FF4A4A; border: 1px solid #FF4A4A; }
.badge-green { background: rgba(60,255,122,0.1); color: #3CFF7A; border: 1px solid #3CFF7A; }

.diff-caption {
  text-align: center;
  margin-top: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #3D5940;
}
</style>

<!--
"If your component renders 1,920 cells but only one word changed, Ink writes ~10 bytes."
This is the same property Claude Code had to preserve when pushing to 60fps.
-->
