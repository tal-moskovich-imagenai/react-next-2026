# Presentation — React Runs Your Terminal

**ReactNext 2026 · June 23 · Hall A · 10:05–10:40**

Slidev presentation using `slidev-theme-the-unnamed` (dark terminal aesthetic).

## Quick start

```bash
pnpm install
pnpm dev
# Opens http://localhost:3030
```

## Export to PDF

```bash
pnpm add -D playwright-chromium
pnpm export
```

## Structure

```
slides.md           ← entry point + headmatter (theme, config)
pages/
  aboutme.md        ← About me slide
  block1-hook.md    ← The Hook (2 min) — the reveal
  block2-context.md ← How React Renderers Work (4 min) — theory + diagrams
  block3-api.md     ← Core API (5 min) — Box, Text, hooks
  block4-livebuild.md ← Live Build (14 min) — AI CLI, 6 steps
  block5-testing.md ← Testing (3 min) — ink-testing-library
  block6-scale.md   ← At Scale (4 min) — Claude Code renderer deep dive
  block7-when.md    ← When to Use (2 min) — fits / not fits / @inkjs/ui
  block8-close.md   ← Closing (30 sec) — final slide + repo URL
components/
  TerminalFrame.vue       ← ASCII terminal window wrapper
  ArchitectureDiagram.vue ← Animated 3-layer React diagram
  PipelineFlow.vue        ← 6-step render cycle, step-by-step reveal
  DiffCounter.vue         ← Animated 24,000 → 0 counter
images/
  cover-terminal.svg      ← Cover art: terminal with React inside
  arch-layers.svg         ← React's 3 layers with renderers
  ansi-explainer.svg      ← ANSI escape sequence breakdown
  cli-vs-browser.svg      ← useChat ❌ vs streamText ✅
  double-buffer.svg       ← Front/back buffer swap diagram
  dirty-blit.svg          ← 24,000-cell grid with 5 dirty cells
snippets/
  hello.tsx               ← Simplest Ink app
  text-input.tsx          ← TextInput component
  use-stream.ts           ← useStream hook
  spinner.tsx             ← Spinner component
  model-select.tsx        ← ModelSelect with use() + Suspense
```

## Key design decisions

- **Theme:** `slidev-theme-the-unnamed` — consistent with past presentations
- **Palette:** Dark `#0D1117` base, terminal-green `#00FF9C` primary accent, data-cyan `#00D4FF` secondary
- **All images are local** — no network requests during presentation
- **Vue components** for interactive theory explanations (click-to-reveal, animations)
- **Presenter notes** on every slide with timing cues

## Slide count

~35 slides across 8 blocks + cover + about me.

## Presenter shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide / click |
| `←` | Previous |
| `P` | Presenter view |
| `O` | Slide overview |
| `F` | Fullscreen |
| `D` | Dark/light toggle |
| `G` | Record with camera |
