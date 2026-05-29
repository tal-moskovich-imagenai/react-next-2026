---
layout: center
---

<div class="autocomplete-root">
  <div class="prompt-line">❯ which framework?<span class="cursor-blink" style="color:#3CFF7A">█</span></div>

  <div class="dropdown" v-click-hide="6">
    <div class="dd-border dd-top">┌────────────────────────────────────┐</div>
    <div v-click class="dd-item">  Claude Code              <span class="dd-arrow">→</span></div>
    <div v-click class="dd-item">  GitHub Copilot CLI       <span class="dd-arrow">→</span></div>
    <div v-click class="dd-item">  Prisma CLI               <span class="dd-arrow">→</span></div>
    <div v-click class="dd-item">  Gatsby                   <span class="dd-arrow">→</span></div>
    <div v-click class="dd-item">  Canva CLI                <span class="dd-arrow">→</span></div>
    <div class="dd-border dd-bot">└────────────────────────────────────┘</div>
  </div>

  <v-click>
    <div class="reveal-box">
      <div class="reveal-line">╔══════════════════════════════════════════╗</div>
      <div class="reveal-line">║  They're all React apps.                 ║</div>
      <div class="reveal-line">║  Just not in your browser.               ║</div>
      <div class="reveal-line">╚══════════════════════════════════════════╝</div>
    </div>
  </v-click>
</div>

<style scoped>
.autocomplete-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-family: 'JetBrains Mono', monospace;
}

.prompt-line {
  font-size: 18px;
  color: #C8DEC4;
  align-self: flex-start;
  margin-left: 40px;
}

.dropdown {
  font-size: 15px;
  color: #C8DEC4;
  line-height: 1.8;
  min-width: 360px;
}

.dd-border {
  color: #3D5940;
  white-space: pre;
}

.dd-item {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
  border-left: 1px solid #3D5940;
  border-right: 1px solid #3D5940;
  padding-left: 2px;
  padding-right: 12px;
  animation: fade-up 0.2s ease-out both;
}

.dd-arrow {
  color: #3CFF7A;
  margin-left: auto;
}

.reveal-box {
  font-size: 15px;
  color: #3CFF7A;
  line-height: 1.8;
  white-space: pre;
  font-weight: 600;
  animation: fade-up 0.4s ease-out both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<!--
[Show Claude Code in terminal before this slide]
Pause after each tool. Let them connect the dots.
Then: "What do they have in common?"
[Pause. Let the audience think.]
-->

---
layout: two-cols
---

## React is a rendering paradigm

<div class="paradigm-left">
  <div v-click class="layer-block layer-1">
    <div class="layer-border-top">┌──────────────────────────────┐</div>
    <div class="layer-row">│  <span class="layer-title">Your Components</span>             │</div>
    <div class="layer-row layer-dim">│  JSX · hooks · state          │</div>
    <div class="layer-border-bot">└──────────────┬───────────────┘</div>
    <div class="layer-arrow">              ↓  <span class="layer-dim-text">what changed?</span></div>
  </div>

  <div v-click class="layer-block layer-2">
    <div class="layer-border-top">┌──────────────────────────────┐</div>
    <div class="layer-row">│  <span class="layer-title">The Reconciler</span>  <span class="layer-accent">⚡</span>          │</div>
    <div class="layer-row layer-dim">│  react-reconciler              │</div>
    <div class="layer-border-bot">└──────────────┬───────────────┘</div>
    <div class="layer-arrow">              ↓  <span class="layer-dim-text">how to apply it</span></div>
  </div>

  <div v-click class="layer-block layer-3">
    <div class="layer-border-top">┌──────────────────────────────┐</div>
    <div class="layer-row">│  <span class="layer-title">The Renderer</span>  <span class="layer-pluggable">pluggable</span>   │</div>
    <div class="layer-row layer-dim">│  react-dom / native / <span class="layer-accent">ink</span>   │</div>
    <div class="layer-border-bot">└──────────────────────────────┘</div>
  </div>
</div>

::right::

<v-click>

### The library: **Ink**

<TerminalFrame title="npm info ink">
  <div style="font-size: 13px; line-height: 1.8">
    <div><span style="color:#3D5940">name:</span> <span style="color:#3CFF7A">ink</span></div>
    <div><span style="color:#3D5940">stars:</span> <span style="color:#C8DEC4">38,000 ★</span></div>
    <div><span style="color:#3D5940">downloads/week:</span> <span style="color:#C8DEC4">3.7M</span></div>
    <div><span style="color:#3D5940">used by:</span></div>
    <div style="padding-left: 16px; color: #00C4C4">Anthropic · GitHub</div>
    <div style="padding-left: 16px; color: #00C4C4">Cloudflare · Shopify</div>
    <div style="padding-left: 16px; color: #00C4C4">HashiCorp · Google</div>
    <div style="margin-top: 8px; color: #3CFF7A">If you know React, you know Ink.</div>
  </div>
</TerminalFrame>

</v-click>

<style scoped>
.paradigm-left {
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 16px;
}

.layer-block {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  animation: fade-up 0.3s ease-out both;
}

.layer-border-top, .layer-border-bot { color: #3D5940; white-space: pre; }
.layer-row { color: #C8DEC4; white-space: pre; }
.layer-dim  { color: #3D5940 !important; }
.layer-dim-text { color: #3D5940; font-size: 11px; }

.layer-title  { color: #C8DEC4; font-weight: 700; }
.layer-accent { color: #3CFF7A; }
.layer-pluggable { color: #3CFF7A; font-size: 11px; }

.layer-1 .layer-border-top, .layer-1 .layer-border-bot { color: #3CFF7A; }
.layer-2 .layer-border-top, .layer-2 .layer-border-bot { color: #3CFF7A; }
.layer-3 .layer-border-top, .layer-3 .layer-border-bot { color: #00C4C4; }

.layer-arrow { color: #C8DEC4; white-space: pre; font-size: 12px; padding-left: 4px; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<!--
React is NOT "a web framework". It's an abstraction for describing UI as a function of state.
The DOM was always just one possible output target.
-->
