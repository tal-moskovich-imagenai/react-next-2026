<template>
  <div class="diff-counter">
    <div class="counter-row">
      <div class="label">Stock Ink — objects/frame</div>
      <div class="value bad">
        <span class="number">{{ stockCount.toLocaleString() }}</span>
        <span class="unit">JS objects</span>
      </div>
    </div>
    <div class="counter-row">
      <div class="label">Claude Code — objects/frame</div>
      <div class="value good">
        <span class="number">{{ optimizedCount }}</span>
        <span class="unit">allocations</span>
      </div>
    </div>

    <div class="bar-comparison" v-if="animating || done">
      <div class="bar-row">
        <div class="bar-label">Stock</div>
        <div class="bar-track">
          <div class="bar-fill bar-bad" :style="{ width: badWidth + '%' }" />
          <span class="bar-text">{{ stockCount.toLocaleString() }}</span>
        </div>
      </div>
      <div class="bar-row">
        <div class="bar-label">Optimized</div>
        <div class="bar-track">
          <div class="bar-fill bar-good" :style="{ width: '0.5%' }" />
          <span class="bar-text" style="color: #3CFF7A">0</span>
        </div>
      </div>
    </div>

    <div class="reduction-badge" v-if="done">
      <span>∞× reduction</span>
      <span class="sub">GC never triggered again</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const STOCK_MAX = 24000
const stockCount = ref(0)
const optimizedCount = ref(24000)
const animating = ref(false)
const done = ref(false)

const badWidth = computed(() => (stockCount.value / STOCK_MAX) * 100)

onMounted(() => {
  animating.value = true

  // Count up stock
  let s = 0
  const up = setInterval(() => {
    s += 600
    stockCount.value = Math.min(s, STOCK_MAX)
    if (s >= STOCK_MAX) {
      clearInterval(up)
      // Then count down optimized
      let o = STOCK_MAX
      const down = setInterval(() => {
        o -= 800
        optimizedCount.value = Math.max(o, 0)
        if (o <= 0) {
          clearInterval(down)
          optimizedCount.value = 0
          done.value = true
        }
      }, 20)
    }
  }, 16)
})
</script>

<style scoped>
.diff-counter {
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  background: #0C0F0C;
  border: 1.5px solid #1E3320;
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
}

.counter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label {
  font-size: 13px;
  color: #3D5940;
}
.value {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.number {
  font-size: 28px;
  font-weight: bold;
}
.unit {
  font-size: 12px;
}
.bad .number  { color: #FF4A4A; }
.bad .unit    { color: #3D5940; }
.good .number { color: #3CFF7A; }
.good .unit   { color: #3D5940; }

.bar-comparison {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar-label {
  width: 72px;
  font-size: 11px;
  color: #3D5940;
  text-align: right;
  flex-shrink: 0;
}
.bar-track {
  flex: 1;
  height: 18px;
  background: #1E3320;
  border-radius: 4px;
  overflow: visible;
  position: relative;
}
.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.05s linear;
}
.bar-bad  { background: #FF4A4A; }
.bar-good { background: #3CFF7A; min-width: 3px; }
.bar-text {
  position: absolute;
  right: -60px;
  top: 1px;
  font-size: 11px;
  color: #FF4A4A;
  white-space: nowrap;
}

.reduction-badge {
  background: #0C150C;
  border: 1.5px solid #3CFF7A;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 18px;
  font-weight: bold;
  color: #3CFF7A;
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.reduction-badge .sub {
  font-size: 12px;
  color: #3D5940;
  font-weight: normal;
}

@keyframes pop-in {
  from { transform: scale(0.8); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
</style>
