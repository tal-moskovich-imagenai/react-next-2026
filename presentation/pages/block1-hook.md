---
layout: center
---

<div class="autocomplete-root">
  <div class="prompt-line">❯ which framework?<span class="cursor-blink" style="color:#3CFF7A">█</span></div>

  <div class="dropdown">
    <div class="dd-row dd-border">┌────────────────────────────────────┐</div>
    <div v-click class="dd-row dd-item">│  Claude Code                   →  │</div>
    <div v-click class="dd-row dd-item">│  GitHub Copilot CLI            →  │</div>
    <div v-click class="dd-row dd-item">│  Prisma CLI                    →  │</div>
    <div v-click class="dd-row dd-item">│  Gatsby                        →  │</div>
    <div v-click class="dd-row dd-item">│  Canva CLI                     →  │</div>
    <div class="dd-row dd-border">└────────────────────────────────────┘</div>
  </div>

  <v-click>
    <div class="reveal-box">
      <div class="reveal-line">╔══════════════════════════════════════╗</div>
      <div class="reveal-line">║  They're all React apps.             ║</div>
      <div class="reveal-line">║  Just not in your browser.           ║</div>
      <div class="reveal-line">╚══════════════════════════════════════╝</div>
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
  line-height: 1.8;
}

.dd-row {
  white-space: pre;
  display: block;
}

.dd-border {
  color: #6B9E6B;
}

.dd-item {
  color: #C8DEC4;
  animation: fade-up 0.2s ease-out both;
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

<!--
React is NOT "a web framework". It's an abstraction for describing UI as a function of state.
The DOM was always just one possible output target.
-->
