<template>
  <div class="pipeline">
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="step-row"
    >
      <div
        class="step-box"
        :class="{ active: currentStep >= i, current: currentStep === i }"
      >
        <span class="step-num">{{ i + 1 }}</span>
        <div class="step-content">
          <div class="step-title">{{ step.title }}</div>
          <div class="step-detail">{{ step.detail }}</div>
        </div>
        <span class="step-icon">{{ step.icon }}</span>
      </div>
      <div v-if="i < steps.length - 1" class="connector" :class="{ active: currentStep > i }">
        <div class="connector-line" />
        <!-- Moving dot when transitioning -->
        <div class="connector-dot" v-if="currentStep > i" />
      </div>
    </div>

    <!-- Output callout — always in DOM to keep height constant, fades in at last step -->
    <div class="output-callout" :class="{ visible: currentStep >= steps.length - 1 }">
      <span style="color: #3CFF7A">stdout</span>
      <span style="color: #C8DEC4"> ← minimal ANSI, only changed cells</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ currentStep?: number }>()
const currentStep = computed(() => props.currentStep ?? 0)

const steps = [
  {
    title: 'setState() called',
    detail: 'React schedules a re-render',
    icon: '⚡',
  },
  {
    title: 'React runs components',
    detail: 'Produces new virtual tree',
    icon: '🌲',
  },
  {
    title: 'Reconciler diffs',
    detail: '"Box at row 2: text changed"',
    icon: '🔍',
  },
  {
    title: 'Yoga layout',
    detail: 'Flexbox → (row, col) per node',
    icon: '📐',
  },
  {
    title: 'Cell-level diff',
    detail: 'Compare new grid vs previous',
    icon: '📊',
  },
  {
    title: 'Write ANSI to stdout',
    detail: '\\x1b[2;5H  Counter: 1',
    icon: '📺',
  },
]

</script>

<style scoped>
.pipeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  max-width: 540px;
  /* fixed height prevents title from jumping; sized to fit all 6 steps + callout */
  height: 350px;
}

.step-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.step-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1.5px solid #3D5940;
  background: #0C0F0C;
  width: 100%;
  /* start invisible — appear on v-click */
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.35s ease, transform 0.35s ease,
              border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
}
.step-box.active {
  opacity: 1;
  transform: translateX(0);
  border-color: #6B9E6B;
  background: #0C130C;
}
.step-box.current {
  border-color: #3CFF7A;
  background: #0C150C;
  box-shadow: 0 0 12px rgba(60,255,122,0.12);
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1E3320;
  color: #C8DEC4;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s ease, color 0.3s ease;
}
.step-box.current .step-num {
  background: #3CFF7A;
  color: #090B09;
}
.step-box.active:not(.current) .step-num {
  background: #0C1A10;
  color: #3CFF7A;
}

.step-content { flex: 1; }
.step-title {
  font-size: 13px;
  font-weight: bold;
  color: #C8DEC4;
  transition: color 0.3s ease;
}
.step-detail {
  font-size: 11px;
  color: #6B9E6B;
  margin-top: 1px;
}
.step-box.current .step-title { color: #3CFF7A; }

.step-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.connector {
  margin-left: 24px;
  height: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  /* connector line invisible until next step appears */
  opacity: 0;
  transition: opacity 0.3s ease 0.2s;
}
.connector.active {
  opacity: 1;
}
.connector-line {
  width: 2px;
  height: 100%;
  background: #3CFF7A;
}
.connector-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3CFF7A;
  top: 0;
  left: -2px;
  box-shadow: 0 0 5px rgba(60,255,122,0.8);
  animation: flow-down 0.4s ease forwards;
}

@keyframes flow-down {
  from { top: 0; opacity: 1; }
  to   { top: 8px; opacity: 0; }
}

.output-callout {
  margin-top: 4px;
  padding: 5px 12px;
  background: #0C0F0C;
  border: 1px solid #3CFF7A;
  border-radius: 6px;
  font-size: 12px;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.output-callout.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
