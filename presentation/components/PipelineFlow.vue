<template>
  <div class="pipeline">
    <div v-for="(step, i) in steps" :key="i" class="step-row">
      <!-- React → Ink boundary — appears when Ink's first step activates -->
      <div
        v-if="i === INK_START"
        class="ink-boundary"
        :class="{ visible: currentStep >= INK_START }"
      >
        <div class="boundary-line" />
        <span class="boundary-label">Ink renderer</span>
        <div class="boundary-line" />
      </div>

      <div
        class="step-box"
        :class="{
          active: currentStep >= i,
          current: currentStep === i,
          ink: step.owner === 'ink',
        }"
      >
        <span class="step-num">{{ i + 1 }}</span>
        <div class="step-content">
          <div class="step-title">{{ step.title }}</div>
          <div class="step-detail">{{ step.detail }}</div>
        </div>
        <span class="step-icon">{{ step.icon }}</span>
      </div>
      <div
        v-if="i < steps.length - 1"
        class="connector"
        :class="{ active: currentStep > i, ink: i >= INK_START }"
      >
        <div class="connector-line" />
        <div class="connector-dot" v-if="currentStep > i" />
      </div>
    </div>

    <!-- Output callout — always in DOM to keep height constant, fades in at last step -->
    <div
      class="output-callout"
      :class="{ visible: currentStep >= steps.length - 1 }"
    >
      <span style="color: #0db7dd">stdout</span>
      <span style="color: #c8dec4"> ← Ink writes only the changed cells</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ currentStep?: number }>();
const currentStep = computed(() => props.currentStep ?? 0);

const INK_START = 3;

const steps = [
  {
    title: "setState() called",
    detail: "React schedules a re-render",
    icon: "⚡",
    owner: "react",
  },
  {
    title: "React runs components",
    detail: "Only changed components re-execute",
    icon: "🌲",
    owner: "react",
  },
  {
    title: "Reconciler diffs",
    detail: "Patches Ink's node tree — changed nodes only",
    icon: "🔍",
    owner: "react",
  },
  {
    title: "Yoga layout",
    detail: "Flexbox → (row, col) for every node",
    icon: "📐",
    owner: "ink",
  },
  {
    title: "Build Screen()",
    detail: "Walk full tree → paint all cells (even unchanged)",
    icon: "🖥",
    owner: "ink",
  },
  {
    title: "Diff + write stdout",
    detail: "\\x1b[2;5H Counter: 1  (changed cells only)",
    icon: "📺",
    owner: "ink",
  },
];
</script>

<style scoped>
.pipeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  font-family: "JetBrains Mono", "SF Mono", monospace;
  max-width: 540px;
  /* fixed height prevents title from jumping; sized to fit all 6 steps + boundary + callout */
  height: 390px;
}

/* ── React → Ink boundary ───────────────────────── */
.ink-boundary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0 4px;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.ink-boundary.visible {
  opacity: 1;
}

.boundary-line {
  flex: 1;
  height: 1px;
  background: #0db7dd;
  opacity: 0.4;
}
.boundary-label {
  font-size: 10px;
  color: #0db7dd;
  letter-spacing: 0.1em;
  white-space: nowrap;
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
  border: 1.5px solid #3d5940;
  background: #0c0f0c;
  width: 100%;
  /* start invisible — appear on v-click */
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}
.step-box.active {
  opacity: 1;
  transform: translateX(0);
  border-color: #6b9e6b;
  background: #0c130c;
}
.step-box.current {
  border-color: #3cff7a;
  background: #0c150c;
  box-shadow: 0 0 12px rgba(60, 255, 122, 0.12);
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1e3320;
  color: #c8dec4;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}
.step-box.current .step-num {
  background: #3cff7a;
  color: #090b09;
}
.step-box.active:not(.current) .step-num {
  background: #0c1a10;
  color: #3cff7a;
}

/* Ink-owned steps use cyan accent */
.step-box.ink.active {
  border-color: #0a6080;
  background: #090e12;
}
.step-box.ink.current {
  border-color: #0db7dd;
  background: #071014;
  box-shadow: 0 0 12px rgba(13, 183, 221, 0.15);
}
.step-box.ink.current .step-num {
  background: #0db7dd;
  color: #090b09;
}
.step-box.ink.active:not(.current) .step-num {
  background: #071218;
  color: #0db7dd;
}
.step-box.ink.current .step-title {
  color: #0db7dd;
}

.connector.ink .connector-line {
  background: #0db7dd;
}
.connector.ink .connector-dot {
  background: #0db7dd;
  box-shadow: 0 0 5px rgba(13, 183, 221, 0.8);
}

.step-content {
  flex: 1;
}
.step-title {
  font-size: 13px;
  font-weight: bold;
  color: #c8dec4;
  transition: color 0.3s ease;
}
.step-detail {
  font-size: 11px;
  color: #6b9e6b;
  margin-top: 1px;
}
.step-box.current .step-title {
  color: #3cff7a;
}

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
  background: #3cff7a;
}
.connector-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3cff7a;
  top: 0;
  left: -2px;
  box-shadow: 0 0 5px rgba(60, 255, 122, 0.8);
  animation: flow-down 0.4s ease forwards;
}

@keyframes flow-down {
  from {
    top: 0;
    opacity: 1;
  }
  to {
    top: 8px;
    opacity: 0;
  }
}

.output-callout {
  margin-top: 4px;
  padding: 5px 12px;
  background: #0c0f0c;
  border: 1px solid #3cff7a;
  border-radius: 6px;
  font-size: 12px;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.output-callout.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
