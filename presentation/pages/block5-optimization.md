---
layout: center
clicks: 4
---

## The Hidden Cost of Stock Ink

<InkCostDiagram :step="$clicks" />

<!--
[click 0] React Phase 1 + Ink Phase 2 both shown as boxes
[click 1] React bails out — grays out unchanged components
[click 2] But Ink still rebuilds the entire screen — highlight that
[click 3] "24,000 objects allocated. Every. Frame."
[click 4] GC fires every ~10ms — stutter visible in the token stream
-->

---
layout: center
clicks: 2
---

## "We rewrote the renderer."

<AnthropicQuote :step="$clicks" />

<!--
[click 1] Boris (Claude Code team, HN 2025) quote appears
[click 2] Thariq (Anthropic engineer) quote appears
React stays. Only the renderer changed.
-->

---
layout: center
clicks: 3
---

## Fix 1 — Kill the GC

<OptFix1 :step="$clicks" />

<!--
[click 1] Before: OutputEntry object per cell — 24,000 objects every frame
[click 2] After: Int32Array — char + styleId packed, allocated ONCE
[click 3] GC pressure: 1.4M objects/sec → 0 objects/frame
-->

---
layout: center
clicks: 3
---

## Fix 2 — Double Buffer

<OptFix2 :step="$clicks" />

<!--
[click 1] Before: new Screen() every frame → handed to GC
[click 2] After: two Int32Arrays allocated at startup, swapped by pointer
[click 3] GC never sees a discarded buffer. Ever.
-->

---
layout: center
clicks: 3
---

## Fix 3 — Dirty Tracking

<OptFix3 :step="$clicks" />

<!--
[click 1] React bails out <Header /> — didn't re-render
[click 2] Ink marks header node "clean" → blit from front buffer
[click 3] Only the changed cells get re-rendered — dirty subtrees only
-->
