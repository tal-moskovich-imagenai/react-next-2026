<template>
  <div class="fix2-root">

    <!-- Visual diagram -->
    <div class="diagram">

      <!-- Stock Ink: new allocation every frame -->
      <div class="renderer-block renderer-before">
        <div class="rb-label label-red">Stock Ink — per frame</div>
        <div class="rb-row">
          <div class="rb-frame frame-new" :class="{ pulse: step >= 1 }">
            <div class="frame-title">new Screen()</div>
            <div class="frame-cells">
              <div v-for="i in 6" :key="i" class="cell cell-new" />
            </div>
          </div>
          <div class="rb-arrow">→</div>
          <div class="rb-frame frame-gc" :class="{ lit: step >= 1 }">
            <div class="frame-title" style="color:#FF4A4A">GC 🗑</div>
            <div class="frame-sub">previous frame</div>
          </div>
        </div>
        <div v-if="step >= 1" class="rb-note note-red">Every frame: allocate → render → discard → GC</div>
      </div>

      <!-- After: double buffer swap -->
      <div class="renderer-block renderer-after" :class="{ visible: step >= 2 }">
        <div class="rb-label label-green">Claude Code — startup allocation only</div>
        <div class="rb-row db-row">
          <div class="db-buffer" :class="{ front: !swapped, back: swapped }">
            <div class="buf-label">{{ swapped ? 'back' : 'front' }}</div>
            <div class="frame-cells">
              <div v-for="i in 6" :key="i" class="cell" :class="swapped ? 'cell-back' : 'cell-front'" />
            </div>
          </div>

          <div class="swap-arrow" :class="{ animate: step >= 2 }">
            <div class="sa-up">⇄</div>
            <div class="sa-label">swap pointer</div>
          </div>

          <div class="db-buffer" :class="{ front: swapped, back: !swapped }">
            <div class="buf-label">{{ swapped ? 'front' : 'back' }}</div>
            <div class="frame-cells">
              <div v-for="i in 6" :key="i" class="cell" :class="swapped ? 'cell-front' : 'cell-back'" />
            </div>
          </div>
        </div>
        <div v-if="step >= 3" class="rb-note note-green">Two Int32Arrays — alive for the entire process. GC never sees them.</div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)

const swapped = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

watch(step, (val) => {
  if (val >= 2 && !intervalId) {
    intervalId = setInterval(() => { swapped.value = !swapped.value }, 1200)
  }
})
</script>

<style scoped>
.fix2-root {
  font-family: 'JetBrains Mono', monospace;
  padding-top: 4px;
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.diagram {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 700px;
}

/* ── Renderer blocks ──────────────────────────────── */
.renderer-block {
  padding: 14px 18px;
  border-radius: 10px;
  border: 1.5px solid #3D5940;
  background: #0C0F0C;
}
.renderer-before { border-color: #FF4A4A; background: #120808; }
.renderer-after  {
  border-color: #3CFF7A;
  background: #0C150C;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.renderer-after.visible { opacity: 1; transform: translateY(0); }

.rb-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}
.label-red   { color: #FF4A4A; }
.label-green { color: #3CFF7A; }

.rb-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ── Frames ──────────────────────────────────────── */
.rb-frame {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #1E3320;
  background: #0A0D0A;
  text-align: center;
}
.frame-new { border-color: #FF4A4A; }
.frame-gc  { border-color: #1E3320; }
.frame-gc.lit { border-color: #FF4A4A; background: #150A0A; }

.frame-title { font-size: 12px; color: #C8DEC4; margin-bottom: 6px; }
.frame-sub   { font-size: 11px; color: #6B9E6B; }

.frame-cells {
  display: flex;
  gap: 3px;
  justify-content: center;
}
.cell {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}
.cell-new  { background: rgba(255,74,74,0.3); border: 1px solid #FF4A4A; }
.cell-front { background: rgba(60,255,122,0.3); border: 1px solid #3CFF7A; }
.cell-back  { background: rgba(0,196,196,0.3); border: 1px solid #00C4C4; }

.rb-arrow { font-size: 20px; color: #FF4A4A; flex-shrink: 0; }

/* ── Double buffer ──────────────────────────────── */
.db-row { justify-content: center; }

.db-buffer {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid;
  text-align: center;
  transition: all 0.5s ease;
  min-width: 120px;
}
.db-buffer.front { border-color: #3CFF7A; background: rgba(60,255,122,0.06); }
.db-buffer.back  { border-color: #00C4C4; background: rgba(0,196,196,0.06); }

.buf-label {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
}
.front .buf-label { color: #3CFF7A; }
.back  .buf-label { color: #00C4C4; }

/* ── Swap arrow ─────────────────────────────────── */
.swap-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 60px;
}
.sa-up {
  font-size: 22px;
  color: #6B9E6B;
}
.swap-arrow.animate .sa-up {
  animation: pulse 1.2s ease-in-out infinite;
}
.sa-label {
  font-size: 10px;
  color: #6B9E6B;
  white-space: nowrap;
}

/* ── Notes ───────────────────────────────────────── */
.rb-note {
  margin-top: 10px;
  font-size: 12px;
  animation: fade-up 0.3s ease-out both;
}
.note-red   { color: #FF4A4A; }
.note-green { color: #3CFF7A; }

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.2); opacity: 0.6; }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
