<template>
  <div class="boot-root">
    <!-- Phase 1: boot log lines -->
    <div class="boot-log" :class="{ 'fade-out': phase >= 2 }">
      <div
        v-for="(line, i) in visibleBootLines"
        :key="i"
        class="boot-log-line"
        :style="{ animationDelay: `${i * 0.08}s` }"
      >
        <span v-if="line.cmd" class="boot-cmd">{{ line.cmd }}</span>
        <span v-if="line.val" class="boot-val" :class="line.valClass">{{ line.val }}</span>
        <span v-if="line.plain" class="boot-plain">{{ line.plain }}</span>
      </div>
    </div>

    <!-- Phase 2+: TrollCode ASCII art -->
    <Transition name="ascii-in">
      <div v-if="phase >= 2" class="ascii-wrapper">
        <!-- TROLL lines -->
        <div class="ascii-troll">
          <div
            v-for="(line, i) in trollLines"
            :key="'t' + i"
            class="ascii-line ascii-green"
            :style="{ animationDelay: `${i * 0.06}s` }"
          >{{ line }}</div>
        </div>
        <!-- CODE lines -->
        <div class="ascii-code">
          <div
            v-for="(line, i) in codeLines"
            :key="'c' + i"
            class="ascii-line ascii-cyan"
            :style="{ animationDelay: `${(trollLines.length + i) * 0.06}s` }"
          >{{ line }}</div>
        </div>
        <!-- Subtitle -->
        <div class="ascii-subtitle" :style="{ animationDelay: `${(trollLines.length + codeLines.length) * 0.06 + 0.1}s` }">
          React in your terminal · powered by Ink 🧌
        </div>
      </div>
    </Transition>

    <!-- Phase 3: Talk title -->
    <Transition name="title-in">
      <div v-if="phase >= 3" class="talk-title">
        <div class="talk-main">React Runs Your Terminal</div>
        <div class="talk-sub">Let's Build One Live</div>
        <div class="talk-meta">
          Tal Moskovich · ReactNext 2026 · June 23
          <span class="cursor-blink">█</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const phase = ref(0)
const shownBootLines = ref(0)

const bootLines = [
  { cmd: '$ node --version', val: 'v22.4.0', valClass: 'green' },
  { cmd: '$ npm start' },
  { plain: '' },
  { plain: '> troll-code@1.0.0 start' },
  { plain: '> node --loader tsx src/index.tsx' },
  { plain: '' },
  { cmd: 'initializing yoga layout engine', val: 'ready', valClass: 'dim' },
  { cmd: 'connecting react-reconciler', val: 'done', valClass: 'dim' },
  { cmd: 'react 19 concurrent mode', val: 'enabled', valClass: 'green' },
]

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

const visibleBootLines = computed(() =>
  bootLines.slice(0, shownBootLines.value)
)

onMounted(() => {
  // Phase 0 → 1: reveal boot lines one by one
  phase.value = 1

  const showNext = () => {
    if (shownBootLines.value < bootLines.length) {
      shownBootLines.value++
      setTimeout(showNext, shownBootLines.value <= 2 ? 600 : 200)
    } else {
      // All boot lines shown → ASCII phase
      setTimeout(() => {
        phase.value = 2
        // After ASCII finishes rendering → show title
        const asciiDuration = (trollLines.length + codeLines.length) * 60 + 600
        setTimeout(() => {
          phase.value = 3
        }, asciiDuration)
      }, 400)
    }
  }

  setTimeout(showNext, 200)
})
</script>

<style scoped>
.boot-root {
  width: 100%;
  height: 100%;
  min-height: 472px;
  background: #090B09;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px 48px;
  box-sizing: border-box;
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
}

/* ── Boot log ─────────────────────────────────────────────── */
.boot-log {
  width: 100%;
  max-width: 560px;
  transition: opacity 0.4s ease;
}

.boot-log.fade-out {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}

.boot-log-line {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 1.7;
  animation: fade-up 0.25s ease-out both;
  color: #C8DEC4;
}

.boot-cmd {
  color: #C8DEC4;
}

.boot-val {
  margin-left: auto;
  padding-left: 16px;
}
.boot-val.green  { color: #3CFF7A; }
.boot-val.dim    { color: #6B9E6B; }

.boot-plain {
  color: #6B9E6B;
  font-size: 11px;
}

/* ── ASCII art ────────────────────────────────────────────── */
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
  align-items: flex-start;
}

.ascii-line {
  font-size: 13px;
  line-height: 1.25;
  letter-spacing: 0;
  white-space: pre;
  animation: fade-up 0.2s ease-out both;
}

.ascii-green { color: #3CFF7A; }
.ascii-cyan  { color: #00C4C4; }

.ascii-subtitle {
  margin-top: 10px;
  font-size: 12px;
  color: #6B9E6B;
  animation: fade-in 0.4s ease-out both;
}

/* ── Talk title ───────────────────────────────────────────── */
.talk-title {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.talk-main {
  font-size: 22px;
  font-weight: 700;
  color: #C8DEC4;
  letter-spacing: 0.01em;
}

.talk-sub {
  font-size: 16px;
  font-weight: 400;
  color: #6B9E6B;
}

.talk-meta {
  margin-top: 8px;
  font-size: 11px;
  color: #6B9E6B;
}

.cursor-blink {
  color: #3CFF7A;
  animation: cursor-blink 1s step-end infinite;
  display: inline-block;
}

/* ── Transitions ──────────────────────────────────────────── */
.ascii-in-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.ascii-in-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.title-in-enter-active {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  transition-delay: 0.1s;
}
.title-in-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

/* ── Keyframes ────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
</style>
