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
clicks: 6
---

## The terminal has no DOM

<NodomFlow :step="$clicks" />

<!--
[click 1] keyboard appears
[click 2] stdin arrow + Node.js process appears
[click 3] stdout arrow + terminal appears
[click 4] Ink's pipeline: Yoga — "Flexbox gives every node a (row, col)"
[click 5] ANSI — "converts positions → escape codes"
[click 6] stdout — "writes only changed cells — zero flicker"
-->

---
layout: center
clicks: 5
---

## ANSI Escape Sequences

<AnsiExplainer :step="$clicks" />

<!--
[click 1] \x1b[ = ESC — Control Sequence Introducer
[click 2] 32 = green foreground — token lights up green
[click 3] m = end of sequence
[click 4] 0 = reset — token lights up cyan
[click 5] Terminal renders "Hello, ReactNext!" + footer badge
-->

---
layout: center
clicks: 6
---

## The Full Render Cycle

<div class="flex justify-center">
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
clicks: 4
---

## Cell-level diffing

<div class="cell-diff-root">

  <!-- Left: naive — visible from start, badge revealed on click 1 -->
  <TerminalFrame title="naive approach" borderColor="#FF4A4A" class="diff-frame">
    <div class="diff-body">
      <div class="diff-line">
        <span class="ansi-red">\x1b[2J</span>
        <span class="diff-comment">← clear screen</span>
      </div>
      <div class="diff-line">[reprint 1,920 cells]</div>
      <Transition name="badge">
        <div v-if="$clicks >= 1" class="diff-badge badge-red">~~~~ FLICKER ~~~~</div>
      </Transition>
    </div>
  </TerminalFrame>

  <!-- Right: ink — frame appears on click 2, badge on click 3 -->
  <Transition name="frame">
    <TerminalFrame v-if="$clicks >= 2" title="ink cell-diff" borderColor="#3CFF7A" class="diff-frame">
      <div class="diff-body">
        <div class="diff-line">
          <span class="ansi-green">\x1b[2;5H</span>
          <span class="diff-comment">← move cursor to changed cell</span>
        </div>
        <div class="diff-line">Counter: 1</div>
        <div class="diff-line diff-secondary">[9 other cells — unchanged]</div>
        <Transition name="badge">
          <div v-if="$clicks >= 3" class="diff-badge badge-green">~10 bytes</div>
        </Transition>
      </div>
    </TerminalFrame>
  </Transition>

</div>

<!-- Caption appears last -->
<Transition name="caption">
  <div v-if="$clicks >= 4" class="diff-caption">
    80 × 24 = 1,920 cells · one word changed · Ink writes <strong style="color:#3CFF7A">10 bytes</strong>
  </div>
</Transition>

<style scoped>
.cell-diff-root {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
  min-height: 210px;
}

.diff-frame {
  width: 340px;
  /* ensures both frames are same height regardless of revealed badges */
  min-height: 180px;
}

.diff-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  min-height: 130px;
}

.diff-line    { color: #C8DEC4; }
.diff-secondary { color: #C8DEC4; font-style: italic; }
.diff-comment { color: #C8DEC4; font-size: 12px; }

.ansi-red   { color: #FF4A4A; font-weight: 700; }
.ansi-green { color: #3CFF7A; font-weight: 700; }

.diff-badge {
  margin-top: 4px;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  display: block;
  text-align: center;
  width: 100%;
}
.badge-red   { background: rgba(255,74,74,0.15); color: #FF4A4A; border: 1px solid #FF4A4A; }
.badge-green { background: rgba(60,255,122,0.1);  color: #3CFF7A; border: 1px solid #3CFF7A; }

.diff-caption {
  text-align: center;
  margin-top: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #C8DEC4;
}

/* Transitions */
.badge-enter-active  { transition: opacity 0.3s ease, transform 0.3s ease; }
.badge-enter-from    { opacity: 0; transform: translateY(6px); }

.frame-enter-active  { transition: opacity 0.4s ease, transform 0.4s ease; }
.frame-enter-from    { opacity: 0; transform: translateX(20px); }

.caption-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.caption-enter-from   { opacity: 0; transform: translateY(8px); }
</style>

<!--
[click 0] Naive side: "\x1b[2J = clear screen, reprint 1,920 cells"
[click 1] FLICKER badge — "that's why terminals flicker on naive redraws"
[click 2] Ink side appears — "Ink knows only Counter changed"
[click 3] ~10 bytes badge — "moves cursor there, writes the new value. Done."
[click 4] Caption — "1,920 cells touched, 10 bytes written"
-->
