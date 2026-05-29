<template>
  <div class="ansi-explainer">

    <!-- Title -->
    <div class="title">ANSI Escape Sequences</div>
    <div class="subtitle">How Ink talks to your terminal</div>

    <!-- Raw bytes row -->
    <div class="bytes-row">
      <span class="bytes-label">raw bytes:</span>
      <span class="token esc">
        <span class="token-text">\x1b[</span>
      </span>
      <span class="token param" :class="{ lit: step >= 2 }">
        <span class="token-text">32</span>
      </span>
      <span class="token esc">
        <span class="token-text">m</span>
      </span>
      <span class="token content">
        <span class="token-text">Hello, ReactNext!</span>
      </span>
      <span class="token esc">
        <span class="token-text">\x1b[</span>
      </span>
      <span class="token reset" :class="{ lit: step >= 4 }">
        <span class="token-text">0</span>
      </span>
      <span class="token esc">
        <span class="token-text">m</span>
      </span>
    </div>

    <!-- Annotation row -->
    <div class="annotations">

      <!-- ESC annotation -->
      <Transition name="ann">
        <div v-if="step >= 1" class="ann ann-esc">
          <div class="ann-arrow" />
          <div class="ann-label">
            <span class="ann-code">\x1b[ = ESC</span>
            <span class="ann-desc">Control Sequence<br/>Introducer</span>
          </div>
        </div>
      </Transition>

      <!-- 32 = green annotation -->
      <Transition name="ann">
          <div v-if="step >= 2" class="ann ann-param">
          <div class="ann-arrow" />
          <div class="ann-label">
            <span class="ann-code" style="color:#3CFF7A">32 = green</span>
            <span class="ann-desc">foreground<br/>color code</span>
          </div>
        </div>
      </Transition>

      <!-- m = end annotation -->
      <Transition name="ann">
        <div v-if="step >= 3" class="ann ann-m">
          <div class="ann-arrow" />
          <div class="ann-label">
            <span class="ann-code" style="color:#C8DEC4;opacity:0.8">m = end</span>
            <span class="ann-desc">of sequence</span>
          </div>
        </div>
      </Transition>

      <!-- 0 = reset annotation -->
      <Transition name="ann">
        <div v-if="step >= 4" class="ann ann-reset">
          <div class="ann-arrow" />
          <div class="ann-label">
            <span class="ann-code" style="color:#00C4C4">0 = reset</span>
            <span class="ann-desc">all styles</span>
          </div>
        </div>
      </Transition>

    </div>

    <!-- Rendered result -->
    <Transition name="result">
      <div v-if="step >= 5" class="result-row">
        <span class="result-label">terminal renders:</span>
        <div class="result-box">
          <span class="result-text">Hello, ReactNext!</span>
        </div>
      </div>
    </Transition>

    <!-- More examples -->
    <Transition name="result">
      <div v-if="step >= 6" class="examples">
        <span class="ex-code" style="color:#FF4A4A">\x1b[2J</span>
        <span class="ex-desc">= clear screen</span>
        <span class="ex-sep">&middot;</span>
        <span class="ex-code" style="color:#00C4C4">\x1b[3;10H</span>
        <span class="ex-desc">= move cursor to row 3, col 10</span>
        <span class="ex-sep">&middot;</span>
        <span class="ex-code" style="color:#3CFF7A">\x1b[1m</span>
        <span class="ex-desc">= bold</span>
      </div>
    </Transition>

    <!-- Footer badge -->
    <Transition name="result">
      <div v-if="step >= 6" class="footer-badge">
        Ink writes all of this. You write React.
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
  gap: 12px;
  padding: 12px 24px 16px;
  width: 100%;
}

/* ── Title ─────────────────────────────────────── */
.title {
  font-size: 22px;
  font-weight: bold;
  color: #C8DEC4;
  letter-spacing: -0.01em;
}
.subtitle {
  font-size: 13px;
  color: #3D5940;
  margin-top: -8px;
}

/* ── Bytes row ─────────────────────────────────── */
.bytes-row {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #0C0F0C;
  border: 1px solid #1E3320;
  border-radius: 10px;
  padding: 12px 20px;
  width: 100%;
  max-width: 820px;
  flex-wrap: wrap;
}
.bytes-label {
  font-size: 12px;
  color: #3D5940;
  margin-right: 12px;
  flex-shrink: 0;
}
.token { display: inline-flex; align-items: center; }
.token-text { font-size: 18px; font-weight: bold; }

.token.esc   .token-text { color: #FF4A4A; }
.token.param .token-text { color: #3D5940; transition: color 0.4s ease; }
.token.param.lit .token-text { color: #3CFF7A; }
.token.content .token-text { color: #C8DEC4; }
.token.reset .token-text { color: #3D5940; transition: color 0.4s ease; }
.token.reset.lit .token-text { color: #00C4C4; }

/* ── Annotations ───────────────────────────────── */
.annotations {
  display: flex;
  justify-content: flex-start;
  gap: 0;
  width: 100%;
  max-width: 820px;
  height: 80px;
  position: relative;
  padding-left: 108px; /* align with token start */
}

.ann {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
}
.ann-esc   { left: 108px; }
.ann-param { left: 215px; }
.ann-m     { left: 278px; }
.ann-reset { left: 640px; }

.ann-arrow {
  width: 1.5px;
  height: 14px;
  background: #1E3320;
  flex-shrink: 0;
}
.ann-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 4px;
}
.ann-code {
  font-size: 12px;
  font-weight: bold;
  color: #FF4A4A;
  white-space: nowrap;
}
.ann-desc {
  font-size: 11px;
  color: #3D5940;
  text-align: center;
  line-height: 1.4;
  white-space: nowrap;
}

/* ── Result ────────────────────────────────────── */
.result-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 820px;
}
.result-label {
  font-size: 12px;
  color: #3D5940;
}
.result-box {
  background: #0C150C;
  border: 1.5px solid #3CFF7A;
  border-radius: 8px;
  padding: 12px 24px;
}
.result-text {
  font-size: 22px;
  font-weight: bold;
  color: #3CFF7A;
  text-shadow: 0 0 16px rgba(60,255,122,0.4);
}

/* ── Examples ──────────────────────────────────── */
.examples {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
  max-width: 820px;
  width: 100%;
}
.ex-code { font-weight: bold; }
.ex-desc { color: #3D5940; }
.ex-sep  { color: #1E3320; }

/* ── Footer badge ──────────────────────────────── */
.footer-badge {
  background: #0C150C;
  border: 1px solid #3CFF7A;
  border-radius: 6px;
  padding: 6px 20px;
  font-size: 13px;
  color: #3CFF7A;
}

/* ── Transitions ───────────────────────────────── */
.ann-enter-active    { transition: opacity 0.35s ease, transform 0.35s ease; }
.ann-enter-from      { opacity: 0; transform: translateY(-10px); }

.result-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.result-enter-from   { opacity: 0; transform: translateY(12px); }
</style>
