<template>
  <div class="logo-root">

    <!-- ASCII art — same as cover BootSequence phase 2 -->
    <div class="ascii-wrapper">
      <div class="ascii-troll">
        <div v-for="(line, i) in trollLines" :key="'t' + i"
          class="ascii-line ascii-green"
          :style="{ animationDelay: `${i * 0.06}s` }"
        >{{ line }}</div>
      </div>
      <div class="ascii-code">
        <div v-for="(line, i) in codeLines" :key="'c' + i"
          class="ascii-line ascii-cyan"
          :style="{ animationDelay: `${(trollLines.length + i) * 0.06}s` }"
        >{{ line }}</div>
      </div>
      <div class="ascii-subtitle"
        :style="{ animationDelay: `${(trollLines.length + codeLines.length) * 0.06 + 0.1}s` }"
      >
        React in your terminal · powered by Ink 🧌
      </div>
    </div>

    <!-- Prompt line -->
    <div class="prompt-line">
      <span class="prompt-dollar">$</span>
      <span class="prompt-cmd"> npm start</span>
      <span class="cursor-blink">█</span>
    </div>

  </div>
</template>

<script setup lang="ts">
const trollLines = [
  '████████╗██████╗  ██████╗ ██╗     ██╗     ',
  '╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██║     ',
  '   ██║   ██████╔╝ ██║   ██║██║     ██║     ',
  '   ██║   ██╔══██╗ ██║   ██║██║     ██║     ',
  '   ██║   ██║  ██║ ╚██████╔╝███████╗███████╗',
  '   ╚═╝   ╚═╝  ╚═╝  ╚═════╝ ╚══════╝╚══════╝',
]

const codeLines = [
  ' ██████╗ ██████╗ ██████╗ ███████╗',
  '██╔════╝██╔═══██╗██╔══██╗██╔════╝',
  '██║     ██║   ██║██║  ██║█████╗  ',
  '██║     ██║   ██║██║  ██║██╔══╝  ',
  '╚██████╗╚██████╔╝██████╔╝███████╗',
  ' ╚═════╝ ╚═════╝ ╚═════╝╚══════╝',
]
</script>

<style scoped>
.logo-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  width: 100%;
  height: 100%;
  min-height: 400px;
  font-family: 'JetBrains Mono', monospace;
  background: #090B09;
}

/* ── ASCII art ─────────────────────────────────── */
.ascii-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.ascii-troll,
.ascii-code {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ascii-line {
  line-height: 1.2;
  white-space: pre;
  font-size: 10px;
  animation: ascii-drop 0.4s ease-out both;
}

.ascii-green { color: #3CFF7A; }
.ascii-cyan  { color: #00C4C4; }

.ascii-subtitle {
  margin-top: 10px;
  font-size: 14px;
  color: #6B9E6B;
  letter-spacing: 0.04em;
  animation: ascii-drop 0.4s ease-out both;
}

@keyframes ascii-drop {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Prompt ────────────────────────────────────── */
.prompt-line {
  font-size: 20px;
  color: #C8DEC4;
}

.prompt-dollar { color: #3CFF7A; font-weight: 700; }
.prompt-cmd    { color: #C8DEC4; }

.cursor-blink {
  color: #3CFF7A;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
</style>
