<template>
  <div class="fix-root">

    <div class="before-after">

      <!-- BEFORE -->
      <div class="side side-before">
        <div class="side-label label-red">BEFORE — stock Ink</div>
        <div class="code-block">
          <div class="code-line"><span class="kw">interface</span> <span class="typ">OutputEntry</span> {</div>
          <div class="code-line">  char: <span class="typ">string</span>;</div>
          <div class="code-line">  foregroundColor?: <span class="typ">string</span>;</div>
          <div class="code-line">  bold?: <span class="typ">boolean</span>;</div>
          <div class="code-line">  <span class="cmt">// ... 5 more fields</span></div>
          <div class="code-line">}</div>
          <div class="code-line code-gap" />
          <div class="code-line"><span class="cmt">// Per frame:</span></div>
          <div class="code-line"><span class="kw">const</span> screen = <span class="fn">buildScreen</span>(rows, cols);</div>
          <div class="code-line"><span class="cmt">// ❌ 24,000 objects, every frame</span></div>
        </div>
        <div v-if="step >= 1" class="side-stat stat-bad">
          <div class="stat-num">24,000</div>
          <div class="stat-label">JS objects / frame</div>
          <div class="stat-sub">→ 1.4M objects/sec → GC every ~10ms</div>
        </div>
      </div>

      <!-- VS divider -->
      <div class="vs-divider">
        <div class="vs-line" />
        <div class="vs-text">vs</div>
        <div class="vs-line" />
      </div>

      <!-- AFTER -->
      <div class="side side-after" :class="{ visible: step >= 2 }">
        <div class="side-label label-green">AFTER — Claude Code</div>
        <div class="code-block">
          <div class="code-line"><span class="cmt">// Each cell = 2 × Int32 words</span></div>
          <div class="code-line"><span class="cmt">// Word 0 = char codepoint</span></div>
          <div class="code-line"><span class="cmt">// Word 1 = style ID (interned)</span></div>
          <div class="code-line code-gap" />
          <div class="code-line"><span class="kw">class</span> <span class="typ">Screen</span> {</div>
          <div class="code-line">  buffer = <span class="kw">new</span> <span class="typ">Int32Array</span>(</div>
          <div class="code-line">    rows × cols × <span class="num">2</span></div>
          <div class="code-line">  ); <span class="cmt">// ✅ ONE allocation, reused</span></div>
          <div class="code-line">}</div>
        </div>
        <div v-if="step >= 3" class="side-stat stat-good">
          <div class="stat-num">0</div>
          <div class="stat-label">JS objects / frame</div>
          <div class="stat-sub">GC pressure: eliminated</div>
        </div>
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
.fix-root {
  font-family: 'JetBrains Mono', monospace;
  padding-top: 8px;
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Before / After layout ──────────────────────── */
.before-after {
  display: flex;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  max-width: 760px;
}

.side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.side-after {
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.side-after.visible {
  opacity: 1;
  transform: translateX(0);
}

/* ── Labels ─────────────────────────────────────── */
.side-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}
.label-red   { color: #FF4A4A; }
.label-green { color: #3CFF7A; }

/* ── Code blocks ─────────────────────────────────── */
.code-block {
  background: #0A0D0A;
  border: 1px solid #1E3320;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 11.5px;
  line-height: 1.65;
}

.code-line  { color: #C8DEC4; }
.code-gap   { height: 6px; }
.kw  { color: #00C4C4; }
.typ { color: #3CFF7A; }
.fn  { color: #C8DEC4; }
.cmt { color: #6B9E6B; }
.num { color: #FF4A4A; }

/* ── Stats ──────────────────────────────────────── */
.side-stat {
  padding: 10px 14px;
  border-radius: 6px;
  animation: fade-up 0.3s ease-out both;
}
.stat-bad  { background: rgba(255,74,74,0.08); border: 1px solid #FF4A4A; }
.stat-good { background: rgba(60,255,122,0.08); border: 1px solid #3CFF7A; }

.stat-num {
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}
.stat-bad  .stat-num { color: #FF4A4A; }
.stat-good .stat-num { color: #3CFF7A; }

.stat-label {
  font-size: 12px;
  color: #C8DEC4;
  margin-top: 2px;
}
.stat-sub {
  font-size: 11px;
  color: #6B9E6B;
  margin-top: 4px;
}

/* ── VS divider ─────────────────────────────────── */
.vs-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 48px;
  flex-shrink: 0;
  padding-top: 40px;
}
.vs-line { flex: 1; width: 1px; background: #1E3320; min-height: 60px; }
.vs-text { font-size: 12px; color: #6B9E6B; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
