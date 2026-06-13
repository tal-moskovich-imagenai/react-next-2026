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

<TerminalPipeline :step="$clicks" />

<!--
[step 0] Terminal streams row is visible. "The terminal is just two byte streams — stdin in, stdout out. No DOM. No retained-mode graphics. Ink has to invent everything in between."
[click 1] setState() — "Your component calls setState"
[click 2] React runs — "React re-runs only changed components"
[click 3] Reconciler — "Patches Ink's node tree — changed nodes only"
[click 4] Ink boundary + Yoga — "Ink takes over: Yoga runs Flexbox → row/col positions for every node"
[click 5] Build Screen — "Ink walks the full tree and paints every cell"
[click 6] Diff + stdout — "Writes only changed cells as ANSI escape sequences to that stdout arrow you see up top"

"Same mental model as React's DOM reconciliation. Produce a diff. Apply only what changed. But the DOM is a 2D cell grid, and patching it means writing ANSI bytes."
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
