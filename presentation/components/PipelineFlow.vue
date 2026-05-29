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

    <!-- Output callout -->
    <div class="output-callout" v-if="currentStep >= steps.length - 1">
      <span style="color: #00FF9C">stdout</span>
      <span style="color: #6E7681"> ← minimal ANSI, only changed cells</span>
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
  font-family: 'SF Mono', 'Fira Code', monospace;
  max-width: 560px;
}

.step-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.step-box {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 7px 16px;
  border-radius: 8px;
  border: 1.5px solid #1E3320;
  background: #0C0F0C;
  width: 100%;
  transition: all 0.3s ease;
  opacity: 0.35;
}
.step-box.active {
  opacity: 1;
  border-color: #1E3320;
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
  color: #3D5940;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
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
  font-size: 14px;
  font-weight: bold;
  color: #C8DEC4;
}
.step-detail {
  font-size: 12px;
  color: #3D5940;
  margin-top: 1px;
}
.step-box.current .step-title { color: #3CFF7A; }

.step-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.connector {
  margin-left: 28px;
  height: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.connector-line {
  width: 2px;
  height: 100%;
  background: #1E3320;
  transition: background 0.3s ease;
}
.connector.active .connector-line {
  background: #3CFF7A;
}
.connector-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3CFF7A;
  top: 2px;
  left: -3px;
  box-shadow: 0 0 6px rgba(60,255,122,0.8);
  animation: flow-down 0.5s ease forwards;
}

@keyframes flow-down {
  from { top: 0; opacity: 1; }
  to   { top: 12px; opacity: 0; }
}

.output-callout {
  margin-top: 6px;
  margin-left: 8px;
  padding: 6px 16px;
  background: #0C0F0C;
  border: 1px solid #3CFF7A;
  border-radius: 6px;
  font-size: 13px;
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
