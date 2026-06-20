<template>
  <div class="why-root">

    <!-- The contrast: console.log vs UI = f(state) -->
    <div v-if="step >= 1" class="versus">
      <div class="card card-bad">
        <div class="card-code">console.log</div>
        <div class="card-tag">static text ✗</div>
      </div>

      <div class="vs">vs</div>

      <div class="card card-good">
        <div class="card-code">UI = <span class="fn">f</span>(<span class="state">state</span>)</div>
        <div class="card-tag">live &amp; stateful ✓</div>
      </div>
    </div>

    <!-- One-line reason -->
    <div v-if="step >= 2" class="reason">
      Claude Code is a <b>real, stateful app</b> — not a script.
      <span class="react">That's React.</span>
    </div>

    <!-- On-distribution flow + tiny attribution -->
    <div v-if="step >= 3" class="flow-wrap">
      <div class="flow">
        <span class="chip chip-stack">React + TS</span>
        <span class="arrow">→</span>
        <span class="chip chip-dist">"on distribution"</span>
        <span class="arrow">→</span>
        <span class="chip chip-win">the agent writes it for you</span>
      </div>
      <div class="attr">
        “a stack we didn't need to teach — Claude Code builds itself.”
        <span class="attr-who">— Boris Cherny, creator of Claude Code</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)
</script>

<style scoped>
.why-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  font-family: 'JetBrains Mono', monospace;
  max-width: 760px;
  margin: 0 auto;
  padding-top: 8px;
  height: 400px;
}

/* ── Versus cards ───────────────────────────── */
.versus {
  display: flex;
  align-items: center;
  gap: 28px;
  animation: fade-up 0.3s ease-out both;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 26px;
  border-radius: 8px;
  border: 1.5px solid;
  min-width: 220px;
}
.card-bad {
  border-color: #FF4A4A;
  background: rgba(255,74,74,0.06);
}
.card-good {
  border-color: #3CFF7A;
  background: #0C180C;
}
.card-code { font-size: 22px; font-weight: 700; }
.card-bad  .card-code { color: #FF4A4A; }
.card-good .card-code { color: #C8DEC4; }
.fn    { color: #00C4C4; }
.state { color: #00C4C4; }
.card-tag { font-size: 12px; }
.card-bad  .card-tag { color: #FF4A4A; }
.card-good .card-tag { color: #3CFF7A; }

.vs {
  font-size: 14px;
  font-style: italic;
  color: #6B9E6B;
}

/* ── Reason ─────────────────────────────────── */
.reason {
  font-size: 18px;
  color: #C8DEC4;
  text-align: center;
  animation: fade-up 0.3s ease-out both;
}
.reason b { color: #C8DEC4; }
.react { color: #3CFF7A; font-weight: 700; }

/* ── Flow ───────────────────────────────────── */
.flow-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: fade-up 0.3s ease-out both;
}
.flow {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.chip {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #3d5940;
  white-space: nowrap;
}
.chip-stack { color: #C8DEC4; }
.chip-dist  { color: #3CFF7A; border-color: #3CFF7A; background: rgba(60,255,122,0.06); }
.chip-win   { color: #00C4C4; border-color: #00C4C4; background: rgba(0,196,196,0.06); }
.arrow { color: #6B9E6B; font-size: 16px; }

.attr {
  font-size: 12px;
  font-style: italic;
  color: #6B9E6B;
  text-align: center;
}
.attr-who {
  display: block;
  margin-top: 4px;
  font-style: normal;
  color: #4d6b4d;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
