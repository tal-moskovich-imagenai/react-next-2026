---
layout: center
class: p-0
---

<div class="bridge-root">
  <!-- TrollCode ASCII art -->
  <div class="ascii-wrapper">
    <div class="ascii-troll">
      <div class="ascii-line green">████████╗██████╗  ██████╗ ██╗     ██╗     </div>
      <div class="ascii-line green">╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██║     </div>
      <div class="ascii-line green">   ██║   ██████╔╝ ██║   ██║██║     ██║     </div>
      <div class="ascii-line green">   ██║   ██╔══██╗ ██║   ██║██║     ██║     </div>
      <div class="ascii-line green">   ██║   ██║  ██║ ╚██████╔╝███████╗███████╗</div>
      <div class="ascii-line green">   ╚═╝   ╚═╝  ╚═╝  ╚═════╝ ╚══════╝╚══════╝</div>
    </div>
    <div class="ascii-code">
      <div class="ascii-line cyan"> ██████╗ ██████╗ ██████╗ ███████╗</div>
      <div class="ascii-line cyan">██╔════╝██╔═══██╗██╔══██╗██╔════╝</div>
      <div class="ascii-line cyan">██║     ██║   ██║██║  ██║█████╗  </div>
      <div class="ascii-line cyan">██║     ██║   ██║██║  ██║██╔══╝  </div>
      <div class="ascii-line cyan">╚██████╗╚██████╔╝██████╔╝███████╗</div>
      <div class="ascii-line cyan"> ╚═════╝ ╚═════╝ ╚═════╝╚══════╝</div>
    </div>
    <div class="ascii-subtitle">React in your terminal · powered by Ink 🧌</div>
  </div>

  <!-- Blinking prompt -->
  <div class="bridge-prompt">
    <span class="prompt-dollar">$</span>
    <span class="prompt-cmd">npm start</span>
    <span class="cursor-blink">█</span>
  </div>
</div>

<style scoped>
.bridge-root {
  width: 100%;
  height: 100%;
  min-height: 440px;
  background: #090B09;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  font-family: 'JetBrains Mono', monospace;
}

.ascii-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.ascii-troll, .ascii-code {
  display: flex;
  flex-direction: column;
}

.ascii-line {
  font-size: 11px;
  line-height: 1.25;
  white-space: pre;
}
.ascii-line.green { color: #3CFF7A; }
.ascii-line.cyan  { color: #00C4C4; }

.ascii-subtitle {
  margin-top: 12px;
  font-size: 12px;
  color: #3D5940;
  text-align: center;
}

.bridge-prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}

.prompt-dollar { color: #3CFF7A; }
.prompt-cmd    { color: #C8DEC4; }

.cursor-blink {
  color: #3CFF7A;
  animation: cursor-blink 1s step-end infinite;
  display: inline-block;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
</style>

<!--
Signal the switch to live coding. Nothing more — the demo explains itself.
Blocks 3 (Core API), 4 (Live Build), 5 (Testing) are live in the terminal.
-->
