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
