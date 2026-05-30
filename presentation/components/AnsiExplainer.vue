<template>
  <div class="ansi-explainer">

    <!-- Raw bytes row -->
    <div class="bytes-row">
      <span class="bytes-label">raw bytes:</span>
      <span class="token esc">\x1b[</span>
      <span class="token param" :class="{ lit: step >= 2 }">32</span>
      <span class="token esc">m</span>
      <span class="token content">Hello, ReactNext!</span>
      <span class="token esc">\x1b[</span>
      <span class="token reset" :class="{ lit: step >= 4 }">0</span>
      <span class="token esc">m</span>
    </div>

    <!-- Decode table — each row revealed on its click -->
    <div class="decode-table">

      <Transition name="row">
        <div v-if="step >= 1" class="decode-row">
          <span class="dc-token esc-color">\x1b[</span>
          <span class="dc-arrow">→</span>
          <span class="dc-desc">ESC &nbsp;<span class="dc-dim">Control Sequence Introducer</span></span>
        </div>
      </Transition>

      <Transition name="row">
        <div v-if="step >= 2" class="decode-row">
          <span class="dc-token green-color">32</span>
          <span class="dc-arrow">→</span>
          <span class="dc-desc">green foreground &nbsp;<span class="dc-dim">color code</span></span>
        </div>
      </Transition>

      <Transition name="row">
        <div v-if="step >= 3" class="decode-row">
          <span class="dc-token esc-color">m</span>
          <span class="dc-arrow">→</span>
          <span class="dc-desc">end of sequence</span>
        </div>
      </Transition>

      <Transition name="row">
        <div v-if="step >= 4" class="decode-row">
          <span class="dc-token cyan-color">0</span>
          <span class="dc-arrow">→</span>
          <span class="dc-desc">reset all styles</span>
        </div>
      </Transition>

    </div>

    <!-- Terminal renders result -->
    <Transition name="result">
      <div v-if="step >= 5" class="result-area">
        <div class="result-row">
          <span class="result-label">terminal renders:</span>
          <div class="result-box">
            <span class="result-text">Hello, ReactNext!</span>
          </div>
        </div>
        <div class="footer-badge">
          Ink writes all of this. You write React.
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)
</script>

<style scoped>
.ansi-explainer {
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 8px 24px;
  width: 100%;
  /* fixed height prevents the slide title from jumping as content appears */
  height: 360px;
}

/* ── Bytes row ─────────────────────────────────── */
.bytes-row {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #0C0F0C;
  border: 1px solid #3D5940;
  border-radius: 10px;
  padding: 12px 20px;
  width: 100%;
  max-width: 720px;
}
.bytes-label {
  font-size: 12px;
  color: #6B9E6B;
  margin-right: 12px;
  flex-shrink: 0;
}
.token { font-size: 18px; font-weight: bold; }
.token.esc     { color: #FF4A4A; }
.token.param   { color: #6B9E6B; transition: color 0.4s ease; }
.token.param.lit { color: #3CFF7A; }
.token.content { color: #C8DEC4; }
.token.reset   { color: #6B9E6B; transition: color 0.4s ease; }
.token.reset.lit { color: #00C4C4; }

/* ── Decode table ──────────────────────────────── */
.decode-table {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 720px;
}

.decode-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 7px 16px;
  border: 1px solid #3D5940;
  border-radius: 4px;
  background: #0C0F0C;
}

.dc-token {
  font-size: 15px;
  font-weight: 700;
  min-width: 52px;
}
.esc-color   { color: #FF4A4A; }
.green-color { color: #3CFF7A; }
.cyan-color  { color: #00C4C4; }

.dc-arrow {
  color: #6B9E6B;
  font-size: 13px;
}
.dc-desc {
  font-size: 13px;
  color: #C8DEC4;
}
.dc-dim {
  color: #6B9E6B;
  font-size: 12px;
}

/* ── Result ────────────────────────────────────── */
.result-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 720px;
}
.result-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.result-label {
  font-size: 12px;
  color: #6B9E6B;
}
.result-box {
  background: #0C150C;
  border: 1.5px solid #3CFF7A;
  border-radius: 8px;
  padding: 10px 24px;
}
.result-text {
  font-size: 22px;
  font-weight: bold;
  color: #3CFF7A;
  text-shadow: 0 0 16px rgba(60,255,122,0.4);
}

/* ── Footer badge ──────────────────────────────── */
.footer-badge {
  background: #0C150C;
  border: 1px solid #3CFF7A;
  border-radius: 6px;
  padding: 7px 20px;
  font-size: 13px;
  color: #3CFF7A;
  text-align: center;
}

/* ── Transitions ───────────────────────────────── */
.row-enter-active    { transition: opacity 0.3s ease, transform 0.3s ease; }
.row-enter-from      { opacity: 0; transform: translateY(6px); }

.result-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.result-enter-from   { opacity: 0; transform: translateY(10px); }
</style>
