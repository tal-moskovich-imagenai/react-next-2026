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

    <!-- Phase 2: TrollCode ASCII art -->
    <Transition name="ascii-in">
      <div v-if="phase === 2" class="ascii-wrapper">
        <div class="ascii-banner-row">
          <div class="ascii-text-block">
            <div class="ascii-troll">
              <div
                v-for="(line, i) in trollLines"
                :key="'t' + i"
                class="ascii-line ascii-green"
                :style="{ animationDelay: `${i * 0.06}s` }"
              >{{ line }}</div>
            </div>
            <div class="ascii-code">
              <div
                v-for="(line, i) in codeLines"
                :key="'c' + i"
                class="ascii-line ascii-cyan"
                :style="{ animationDelay: `${(trollLines.length + i) * 0.06}s` }"
              >{{ line }}</div>
            </div>
          </div>
          <TrollDollFigure
            :delay="(trollLines.length + codeLines.length) * 0.06"
            :size="13"
          />
        </div>
        <div
          class="ascii-subtitle"
          :style="{ animationDelay: `${(trollLines.length + codeLines.length) * 0.06 + 0.4}s` }"
        >
          React in your terminal
        </div>
      </div>
    </Transition>

    <!-- Phase 3: Title card -->
    <Transition name="title-in">
      <div v-if="phase >= 3" class="title-card">
        <div class="title-brand">
          <div class="brand-logo">
            <div class="brand-troll">
              <span v-for="(l, i) in trollLines" :key="i" class="brand-troll-line ascii-green">{{ l }}</span>
            </div>
            <div class="brand-code">
              <span v-for="(l, i) in codeLines" :key="i" class="brand-troll-line ascii-cyan">{{ l }}</span>
            </div>
          </div>
          <div class="brand-sep">×</div>
          <div class="react-atom">⚛</div>
        </div>
        <div class="title-divider" />
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
import { ref, computed, watch, onMounted } from 'vue'
import TrollDollFigure from './TrollDollFigure.vue'

const props = defineProps<{ started?: boolean }>()
const emit = defineEmits<{ completed: [] }>()

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
  { cmd: 'connecting react-reconciler',     val: 'done',  valClass: 'dim' },
  { cmd: 'react 19 concurrent mode',        val: 'enabled', valClass: 'green' },
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

const visibleBootLines = computed(() => bootLines.slice(0, shownBootLines.value))

const startSequence = () => {
  if (phase.value > 0) return
  phase.value = 1

  const showNext = () => {
    if (shownBootLines.value < bootLines.length) {
      shownBootLines.value++
      setTimeout(showNext, shownBootLines.value <= 2 ? 600 : 200)
    } else {
      setTimeout(() => {
        phase.value = 2
        const asciiDuration = (trollLines.length + codeLines.length) * 60 + 600 + 2000
        setTimeout(() => {
          phase.value = 3
          emit('completed')
        }, asciiDuration)
      }, 400)
    }
  }

  setTimeout(showNext, 200)
}

onMounted(() => {
  if (props.started) startSequence()
})

watch(() => props.started, (val) => {
  if (val) startSequence()
})
</script>

<style scoped>
.boot-root {
  width: 100%;
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

@media (max-width: 640px) {
  .boot-root { padding: 32px 16px; }
}

/* ── Boot log ───────────────────────────────── */
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
.boot-cmd   { color: #C8DEC4; }
.boot-val   { margin-left: auto; padding-left: 16px; }
.boot-val.green { color: #3CFF7A; }
.boot-val.dim   { color: #6B9E6B; }
.boot-plain { color: #6B9E6B; font-size: 11px; }

/* ── ASCII art ──────────────────────────────── */
.ascii-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ascii-banner-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
}
.ascii-text-block { display: flex; flex-direction: column; }
.ascii-troll, .ascii-code { display: flex; flex-direction: column; align-items: flex-start; }
.ascii-line {
  font-size: 13px;
  line-height: 1.25;
  letter-spacing: 0;
  white-space: pre;
  animation: fade-up 0.2s ease-out both;
}

@media (max-width: 640px) {
  .ascii-line { font-size: 2.8vw; }
  :deep(.doll) { display: none; }
  .ascii-banner-row { gap: 0; }
}
.ascii-green { color: #3CFF7A; }
.ascii-cyan  { color: #00C4C4; }
.ascii-subtitle {
  margin-top: 10px;
  font-size: 12px;
  color: #6B9E6B;
  animation: fade-in 0.4s ease-out both;
}

/* ── Title card ─────────────────────────────── */
.title-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  width: 100%;
  max-width: 700px;
}
.title-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}
.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
}
.brand-troll-line {
  display: block;
  font-size: 3px;
  white-space: pre;
  letter-spacing: 0;
}
.brand-sep { font-size: 14px; color: #3D5940; }
.react-atom {
  font-size: 40px;
  color: #61DAFB;
  line-height: 1;
  filter: drop-shadow(0 0 12px rgba(97,218,251,0.4));
  animation: atom-spin 12s linear infinite;
}
.title-divider {
  width: 280px;
  height: 1px;
  background: linear-gradient(to right, transparent, #3D5940, transparent);
  margin: 4px 0;
}
.talk-main {
  font-size: 30px;
  font-weight: 700;
  color: #C8DEC4;
  letter-spacing: 0.01em;
  line-height: 1.2;
}
.talk-sub  { font-size: 18px; font-weight: 400; color: #3CFF7A; }
.talk-meta { font-size: 12px; color: #6B9E6B; margin-top: 4px; }
.cursor-blink {
  color: #3CFF7A;
  animation: cursor-blink 1s step-end infinite;
  display: inline-block;
}

/* ── Transitions ────────────────────────────── */
.ascii-in-enter-active { transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
.ascii-in-enter-from   { opacity: 0; transform: translateY(12px); }
.ascii-in-leave-active { transition: opacity 0.4s ease-in, transform 0.4s ease-in; }
.ascii-in-leave-to     { opacity: 0; transform: scale(0.92) translateY(-8px); }

.title-in-enter-active { transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
.title-in-enter-from   { opacity: 0; transform: translateY(16px); }

/* ── Keyframes ──────────────────────────────── */
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
@keyframes atom-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
