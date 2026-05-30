<template>
  <div class="quote-root">

    <!-- Quote 1: Boris -->
    <div v-if="step >= 1" class="quote-card quote-1">
      <div class="quote-marks">"</div>
      <div class="quote-text">
        We started by using Ink, and at this point it's our own framework due to the number of changes we've made to it over the months.
      </div>
      <div class="quote-attr">
        <span class="attr-name">Boris</span>
        <span class="attr-role">Claude Code team · Hacker News · 2025</span>
      </div>
    </div>

    <!-- Quote 2: Thariq -->
    <div v-if="step >= 2" class="quote-card quote-2">
      <div class="quote-marks">"</div>
      <div class="quote-text">
        Ink didn't support the kind of fine-grained incremental updates needed for a long-running interactive UI... so we rewrote the renderer from scratch — while still keeping React as the component model.
      </div>
      <div class="quote-attr">
        <span class="attr-name">Thariq</span>
        <span class="attr-role">Anthropic engineer · via Peter Steinberger · 2025</span>
      </div>
    </div>

    <!-- Bottom conclusion -->
    <div v-if="step >= 2" class="conclusion">
      <span class="con-react">React stays.</span>
      <span class="con-sep"> Only </span>
      <span class="con-renderer">the renderer</span>
      <span class="con-sep"> was rewritten.</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)
</script>

<style scoped>
.quote-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-family: 'JetBrains Mono', monospace;
  max-width: 700px;
  margin: 0 auto;
  padding-top: 8px;
  height: 360px;
}

/* ── Quote cards ──────────────────────────────── */
.quote-card {
  position: relative;
  padding: 16px 20px 16px 28px;
  border-left: 3px solid #3CFF7A;
  background: #0C130C;
  border-radius: 0 8px 8px 0;
  width: 100%;
  animation: slide-in 0.4s ease-out both;
}
.quote-2 {
  border-left-color: #00C4C4;
  background: #0A1212;
}

.quote-marks {
  position: absolute;
  top: -4px;
  left: 8px;
  font-size: 48px;
  color: #3CFF7A;
  opacity: 0.25;
  line-height: 1;
  font-family: Georgia, serif;
}
.quote-2 .quote-marks { color: #00C4C4; }

.quote-text {
  font-size: 13px;
  line-height: 1.65;
  color: #C8DEC4;
  font-style: italic;
}

.quote-attr {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 10px;
}

.attr-name {
  font-size: 12px;
  font-weight: 700;
  color: #3CFF7A;
}
.quote-2 .attr-name { color: #00C4C4; }

.attr-role {
  font-size: 11px;
  color: #6B9E6B;
}

/* ── Conclusion ──────────────────────────────── */
.conclusion {
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  animation: fade-up 0.3s ease-out both;
}
.con-react    { color: #3CFF7A; }
.con-renderer { color: #FF4A4A; }
.con-sep      { color: #6B9E6B; }

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
