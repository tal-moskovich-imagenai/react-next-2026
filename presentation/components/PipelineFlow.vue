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
  padding: 10px 16px;
  border-radius: 8px;
  border: 1.5px solid #1E2733;
  background: #0D1117;
  width: 100%;
  transition: all 0.3s ease;
  opacity: 0.35;
}
.step-box.active {
  opacity: 1;
  border-color: #2A3A4A;
  background: #0F1822;
}
.step-box.current {
  border-color: #00FF9C;
  background: #0D2218;
  box-shadow: 0 0 12px rgba(0,255,156,0.15);
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1E2733;
  color: #6E7681;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.step-box.current .step-num {
  background: #00FF9C;
  color: #0A0E17;
}
.step-box.active:not(.current) .step-num {
  background: #1A3020;
  color: #00FF9C;
}

.step-content { flex: 1; }
.step-title {
  font-size: 14px;
  font-weight: bold;
  color: #F3EFF5;
}
.step-detail {
  font-size: 12px;
  color: #6E7681;
  margin-top: 1px;
}
.step-box.current .step-title { color: #00FF9C; }

.step-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.connector {
  margin-left: 28px;
  height: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.connector-line {
  width: 2px;
  height: 100%;
  background: #1E2733;
  transition: background 0.3s ease;
}
.connector.active .connector-line {
  background: #00FF9C;
}
.connector-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00FF9C;
  top: 4px;
  left: -3px;
  box-shadow: 0 0 6px rgba(0,255,156,0.8);
  animation: flow-down 0.5s ease forwards;
}

@keyframes flow-down {
  from { top: 0; opacity: 1; }
  to   { top: 12px; opacity: 0; }
}

.output-callout {
  margin-top: 8px;
  margin-left: 8px;
  padding: 8px 16px;
  background: #0A1410;
  border: 1px solid #00FF9C;
  border-radius: 6px;
  font-size: 13px;
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
