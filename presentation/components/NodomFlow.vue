<template>
  <div class="nodom-root">

    <!-- ── Main flow row ─────────────────────────── -->
    <div class="flow-row">

      <!-- keyboard -->
      <div class="flow-node" :class="{ visible: step >= 1 }">
        <div class="node-icon">⌨</div>
        <div class="node-label">keyboard</div>
      </div>

      <!-- stdin arrow -->
      <div class="flow-arrow" :class="{ visible: step >= 2 }">
        <div class="arrow-track">
          <div class="arrow-line" />
          <div class="arrow-head">→</div>
        </div>
        <div class="arrow-label">stdin</div>
      </div>

      <!-- Node.js process (center, highlighted) -->
      <div class="flow-node node-center" :class="{ visible: step >= 2 }">
        <div class="node-icon node-icon-center">⚙</div>
        <div class="node-label node-label-center">Node.js process</div>
      </div>

      <!-- stdout arrow -->
      <div class="flow-arrow" :class="{ visible: step >= 3 }">
        <div class="arrow-track">
          <div class="arrow-line" />
          <div class="arrow-head">→</div>
        </div>
        <div class="arrow-label">stdout</div>
      </div>

      <!-- terminal -->
      <div class="flow-node" :class="{ visible: step >= 3 }">
        <div class="node-icon">▬</div>
        <div class="node-label">terminal</div>
      </div>

    </div>

    <!-- ── What Ink does inside ─────────────────── -->
    <div class="ink-section" :class="{ visible: step >= 4 }">
      <div class="section-label">Inside the Node.js process — Ink handles:</div>
      <div class="steps-row">
        <div class="ink-step" :class="{ visible: step >= 4 }">
          <div class="step-num">1</div>
          <div class="step-body">
            <div class="step-key">Yoga</div>
            <div class="step-desc">Flexbox → (row, col) per component</div>
          </div>
        </div>
        <div class="step-connector" :class="{ visible: step >= 5 }">→</div>
        <div class="ink-step" :class="{ visible: step >= 5 }">
          <div class="step-num">2</div>
          <div class="step-body">
            <div class="step-key">ANSI</div>
            <div class="step-desc">positions → escape sequences</div>
          </div>
        </div>
        <div class="step-connector" :class="{ visible: step >= 6 }">→</div>
        <div class="ink-step" :class="{ visible: step >= 6 }">
          <div class="step-num">3</div>
          <div class="step-body">
            <div class="step-key">stdout</div>
            <div class="step-desc">only changed cells written</div>
          </div>
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
.nodom-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  font-family: 'JetBrains Mono', monospace;
  padding-top: 8px;
  height: 310px;
}

/* ── Flow row ──────────────────────────────────── */
.flow-row {
  display: flex;
  align-items: center;
  gap: 0;
}

.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  border: 1px solid #3D5940;
  background: #0C0F0C;
  border-radius: 8px;
  min-width: 120px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.flow-node.visible {
  opacity: 1;
  transform: translateY(0);
}

.node-center {
  border-color: #3CFF7A;
  background: #0C150C;
  box-shadow: 0 0 20px rgba(60,255,122,0.1);
}

.node-icon        { font-size: 24px; color: #6B9E6B; }
.node-icon-center { color: #3CFF7A; }
.node-label       { font-size: 12px; color: #C8DEC4; text-align: center; white-space: nowrap; }
.node-label-center { color: #3CFF7A; font-weight: 600; }

/* ── Arrows ────────────────────────────────────── */
.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 80px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.flow-arrow.visible { opacity: 1; }

/* line + arrowhead share a horizontal row */
.arrow-track {
  display: flex;
  align-items: center;
  width: 100%;
}

.arrow-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #3D5940, #3CFF7A);
}
.arrow-head {
  font-size: 15px;
  color: #3CFF7A;
  line-height: 1;
  margin-left: -1px;
}
.arrow-label {
  font-size: 11px;
  color: #3CFF7A;
  font-weight: 600;
}

/* ── Ink section ──────────────────────────────── */
.ink-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.ink-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-label {
  font-size: 11px;
  color: #6B9E6B;
  letter-spacing: 0.05em;
}

.steps-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ink-step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: 1px solid #3D5940;
  background: #0C0F0C;
  border-radius: 6px;
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.ink-step.visible {
  opacity: 1;
  transform: translateX(0);
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #3CFF7A;
  color: #090B09;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-body { display: flex; flex-direction: column; gap: 2px; }
.step-key  { font-size: 13px; font-weight: 700; color: #3CFF7A; }
.step-desc { font-size: 11px; color: #C8DEC4; white-space: nowrap; }

.step-connector {
  font-size: 18px;
  color: #3CFF7A;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.step-connector.visible { opacity: 1; }
</style>
