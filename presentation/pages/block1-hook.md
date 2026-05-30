---
layout: center
---

## which framework?

<div class="autocomplete-root">

  <div class="dropdown">
    <div v-click class="dd-item">
      <span class="dd-name">Claude Code</span>
      <span class="dd-arrow">→</span>
    </div>
    <div v-click class="dd-item">
      <span class="dd-name">GitHub Copilot CLI</span>
      <span class="dd-arrow">→</span>
    </div>
    <div v-click class="dd-item">
      <span class="dd-name">Prisma CLI</span>
      <span class="dd-arrow">→</span>
    </div>
    <div v-click class="dd-item">
      <span class="dd-name">Gatsby</span>
      <span class="dd-arrow">→</span>
    </div>
    <div v-click class="dd-item">
      <span class="dd-name">Canva CLI</span>
      <span class="dd-arrow">→</span>
    </div>
  </div>

  <v-click>
    <div class="reveal-box">
      <div class="reveal-line">They're all React apps.</div>
      <div class="reveal-line">Just not in your browser.</div>
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

/* ── Dropdown ──────────────────────────────── */
.dropdown {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1.5px solid #3D5940;
  border-radius: 8px;
  background: #0C0F0C;
  overflow: hidden;
  width: 340px;
}

.dd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  border-bottom: 1px solid #1E3320;
  font-size: 14px;
  animation: fade-up 0.2s ease-out both;
}
.dd-item:last-child { border-bottom: none; }

.dd-name  { color: #C8DEC4; }
.dd-arrow { color: #3D5940; font-size: 13px; }

/* ── Reveal box ────────────────────────────── */
.reveal-box {
  border: 1.5px solid #3CFF7A;
  border-radius: 8px;
  background: rgba(60,255,122,0.05);
  padding: 14px 24px;
  width: 340px;
  animation: fade-up 0.4s ease-out both;
}

.reveal-line {
  font-size: 16px;
  font-weight: 700;
  color: #3CFF7A;
  line-height: 1.7;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<!--
[Show Claude Code in terminal before this slide]
Pause after each tool. Let them connect the dots.
Then: "What do they have in common?"
[Pause. Let the audience think.]
-->

<!--
React is NOT "a web framework". It's an abstraction for describing UI as a function of state.
The DOM was always just one possible output target.
-->
