<template>
  <div class="terminal-pipeline">

    <!-- ── Zone A: Terminal context (always visible) ──────────────────── -->
    <div class="context-row">
      <div class="ctx-node">
        <div class="ctx-icon">⌨</div>
        <div class="ctx-label">keyboard</div>
      </div>

      <div class="ctx-arrow">
        <div class="ctx-arrow-track">
          <div class="ctx-arrow-line" />
          <div class="ctx-arrow-head">→</div>
        </div>
        <div class="ctx-arrow-label">stdin</div>
      </div>

      <div class="ctx-node ctx-node-center">
        <div class="ctx-icon ctx-icon-center">⚙</div>
        <div class="ctx-label ctx-label-center">Node.js process</div>
      </div>

      <div class="ctx-arrow" :class="{ lit: step >= 6 }">
        <div class="ctx-arrow-track">
          <div class="ctx-arrow-line" />
          <div class="ctx-arrow-head">→</div>
        </div>
        <div class="ctx-arrow-label">stdout</div>
      </div>

      <div class="ctx-node" :class="{ lit: step >= 6 }">
        <div class="ctx-icon">▬</div>
        <div class="ctx-label">terminal</div>
      </div>
    </div>

    <!-- connector from Node.js box down into pipeline -->
    <div class="zone-connector" :class="{ visible: step >= 1 }">
      <div class="zone-connector-line" />
      <div class="zone-connector-label">when setState() fires inside ↓</div>
    </div>

    <!-- ── Zone B: React→Ink pipeline ──────────────────────────────────── -->
    <div class="pipeline">
      <div v-for="(s, i) in steps" :key="i" class="step-row">
        <!-- React → Ink boundary -->
        <div
          v-if="i === INK_START"
          class="ink-boundary"
          :class="{ visible: step >= INK_START }"
        >
          <div class="boundary-line" />
          <span class="boundary-label">Ink renderer</span>
          <div class="boundary-line" />
        </div>

        <div
          class="step-box"
          :class="{
            active: step >= i + 1,
            current: step === i + 1,
            ink: s.owner === 'ink',
          }"
        >
          <span class="step-num">{{ i + 1 }}</span>
          <div class="step-content">
            <div class="step-title">{{ s.title }}</div>
            <div class="step-detail">{{ s.detail }}</div>
          </div>
          <span class="step-icon">{{ s.icon }}</span>
        </div>

        <div
          v-if="i < steps.length - 1"
          class="connector"
          :class="{ active: step > i + 1, ink: i >= INK_START }"
        />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ step?: number }>();
const step = computed(() => props.step ?? 0);

const INK_START = 3;

const steps = [
  { title: "setState() called",       detail: "React schedules a re-render",                       icon: "⚡", owner: "react" },
  { title: "React runs components",   detail: "Only changed components re-execute",                 icon: "🌲", owner: "react" },
  { title: "Reconciler diffs",        detail: "Patches Ink's node tree — changed nodes only",       icon: "🔍", owner: "react" },
  { title: "Yoga layout",             detail: "Flexbox → (row, col) for every node",                icon: "📐", owner: "ink"   },
  { title: "Build Screen()",          detail: "Walk full tree → paint all cells",                   icon: "🖥",  owner: "ink"   },
  { title: "Diff + write stdout",     detail: "\\x1b[2;5H Counter: 1  (changed cells only)",        icon: "📺", owner: "ink"   },
];
</script>

<style scoped>
.terminal-pipeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  font-family: "JetBrains Mono", "SF Mono", monospace;
  width: 100%;
}

/* ── Zone A: context row ─────────────────────────── */
.context-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 0;
}

.ctx-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: 1px solid #3d5940;
  background: #0c0f0c;
  border-radius: 8px;
  min-width: 100px;
}
.ctx-node-center {
  border-color: #3cff7a;
  background: #0c150c;
  box-shadow: 0 0 16px rgba(60, 255, 122, 0.1);
}

.ctx-icon {
  font-size: 18px;
  color: #6b9e6b;
}
.ctx-icon-center {
  color: #3cff7a;
}
.ctx-label {
  font-size: 10px;
  color: #c8dec4;
  white-space: nowrap;
}
.ctx-label-center {
  color: #3cff7a;
  font-weight: 600;
}

.ctx-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 64px;
  flex-shrink: 0;
}
.ctx-arrow-track {
  position: relative;
  width: 100%;
  height: 18px;
}
/* line stretches across but leaves room for the arrowhead character */
.ctx-arrow-line {
  position: absolute;
  left: 0;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  height: 1.5px;
  background: linear-gradient(90deg, #3d5940, #3cff7a);
  transition: box-shadow 0.4s ease, background 0.4s ease;
}
/* arrowhead pinned to right edge, centered on the line */
.ctx-arrow-head {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  line-height: 0; /* removes ascender/descender space so translateY centers the glyph */
  color: #3cff7a;
}
.ctx-arrow-label {
  font-size: 9px;
  color: #3cff7a;
  font-weight: 600;
  transition: color 0.4s ease, text-shadow 0.4s ease;
}

/* stdout arrow + terminal node light up at step 6 */
.ctx-arrow.lit .ctx-arrow-line {
  background: linear-gradient(90deg, #3cff7a, #3cff7a);
  box-shadow: 0 0 6px rgba(60, 255, 122, 0.8);
}
.ctx-arrow.lit .ctx-arrow-label {
  color: #fff;
  text-shadow: 0 0 8px rgba(60, 255, 122, 1);
}
.ctx-node.lit {
  border-color: #3cff7a;
  box-shadow: 0 0 18px rgba(60, 255, 122, 0.25);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}
.ctx-node.lit .ctx-icon {
  color: #3cff7a;
  transition: color 0.4s ease;
}
.ctx-node.lit .ctx-label {
  color: #3cff7a;
  transition: color 0.4s ease;
}

/* ── Zone connector ─────────────────────────────── */
.zone-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: 2px 0 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.zone-connector.visible {
  opacity: 1;
}
.zone-connector-line {
  width: 1.5px;
  height: 14px;
  background: #3cff7a;
  opacity: 0.4;
}
.zone-connector-label {
  font-size: 9px;
  color: #6b9e6b;
  letter-spacing: 0.04em;
}

/* ── Zone B: pipeline ────────────────────────────── */
.pipeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 500px;
  width: 100%;
}

.ink-boundary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0 3px;
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
  font-size: 9px;
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
  padding: 4px 12px;
  border-radius: 6px;
  border: 1.5px solid #3d5940;
  background: #0c0f0c;
  width: 100%;
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
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #1e3320;
  color: #c8dec4;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s ease, color 0.3s ease;
}
.step-box.current .step-num {
  background: #3cff7a;
  color: #090b09;
}
.step-box.active:not(.current) .step-num {
  background: #0c1a10;
  color: #3cff7a;
}

/* Ink-owned steps */
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

.step-content {
  flex: 1;
}
.step-title {
  font-size: 12px;
  font-weight: bold;
  color: #c8dec4;
  transition: color 0.3s ease;
}
.step-box.current .step-title {
  color: #3cff7a;
}
.step-detail {
  font-size: 10px;
  color: #6b9e6b;
  margin-top: 1px;
}

.step-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.connector {
  margin-left: 23px;
  width: 1.5px;
  height: 5px;
  background: #3cff7a;
  opacity: 0;
  transition: opacity 0.25s ease 0.15s;
}
.connector.active {
  opacity: 0.5;
}
.connector.ink {
  background: #0db7dd;
}

</style>
