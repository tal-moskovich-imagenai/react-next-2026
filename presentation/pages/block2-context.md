---
layout: section
---

# Block 2
## How React Renderers Work

<!--
4 minutes. Keep it visual. Don't get lost in fiber internals.
Goal: audience understands WHY this is possible, not HOW it works in detail.
-->

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
layout: two-cols
---

## The terminal has no DOM

<v-clicks>

- No retained-mode graphics pipeline
- Just two streams:
  - `stdin` — bytes coming in (keyboard)
  - `stdout` — bytes going out (what you see)

</v-clicks>

<v-click>

Everything in between — layout, colors, cursor movement — **has to be invented.**

</v-click>

<v-click>

**Ink's solution:**

1. Layout with **Yoga** — Meta's Flexbox engine (same one React Native uses)
2. Convert positions → **ANSI escape sequences**
3. Write to stdout

</v-click>

::right::

<div class="flex items-center justify-center h-full">
  <div class="font-mono text-center" style="color:#6E7681; font-size:13px; line-height:2.2">
    <div style="font-size:32px; color:#FE4A49; margin-bottom:8px">\x1b[32m</div>
    <div style="color:#00FF9C; font-size:18px; font-weight:bold">Hello, ReactNext!</div>
    <div style="font-size:32px; color:#FE4A49; margin-top:8px">\x1b[0m</div>
    <div style="margin-top:16px; font-size:12px">↓ next slide ↓</div>
  </div>
</div>

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
layout: two-cols
---

## Why this matters for performance

<v-click>

**80×24 = 1,920 cells**

Only one word changed?

**Ink writes ~10 bytes.**

</v-click>

<v-click>

Naive approach: clear screen (`\x1b[2J`) + reprint everything = **thousands of bytes + flicker**.

</v-click>

<v-click>

Ink's **cell-level diffing** is what makes smooth, flicker-free terminal UIs possible.

Claude Code had to push this to **60fps**. More on that in Block 6.

</v-click>

::right::

<v-click>

<TerminalFrame title="the key insight">
  <div style="font-size: 13px; line-height: 2; color: #F3EFF5">
    <div>Every <span style="color:#00FF9C">&lt;Box&gt;</span> = flexbox container</div>
    <div style="color:#6E7681; padding-left:16px">like &lt;div style="display:flex"&gt;</div>
    <div style="margin-top:8px">Every <span style="color:#00FF9C">&lt;Text&gt;</span> = styled text node</div>
    <div style="margin-top:8px">All React features work <span style="color:#00FF9C">exactly the same</span>:</div>
    <div style="color:#5EADF2; padding-left:16px">useState · useEffect</div>
    <div style="color:#5EADF2; padding-left:16px">useContext · useMemo</div>
    <div style="color:#5EADF2; padding-left:16px">custom hooks</div>
  </div>
</TerminalFrame>

</v-click>

<!--
"If your component renders 1,920 cells but only one word changed, Ink writes ~10 bytes."
This is the same property Claude Code had to preserve when pushing to 60fps.
-->

---
layout: quote
---

> "With an off-distribution stack, the model can still learn it.
> But you have to show it the ropes and put in the work.
> **We wanted a tech stack which we didn't need to teach**:
> one where Claude Code could build itself."

<div class="mt-4 text-sm font-mono" style="color: #6E7681">
  Boris Cherny, Pragmatic Engineer interview, Sep 2025
</div>

<v-click>

<div class="mt-6 font-mono text-base" style="color: var(--slidev-theme-color)">
  TypeScript + React = "on distribution" — Claude is genuinely fluent in both.<br/>
  Choosing them means <span style="color: var(--slidev-theme-accents-teal)">Claude Code can write its own code from day one.</span>
</div>

</v-click>

<!--
"On distribution" = the model has seen so much of a technology that it's genuinely fluent.
TypeScript and React are two of the most well-represented in Claude's training data.
-->
