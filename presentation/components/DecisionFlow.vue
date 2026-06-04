<template>
  <div class="decision-root">
    <!-- Root question — always visible -->
    <div class="node node-root">
      <span class="nd-name">Should I use Ink?</span>
    </div>

    <div class="v-conn" />

    <!-- Question 1 -->
    <div class="node node-question" :class="{ visible: step >= 1 }">
      <span class="nd-name">Do users see state updates in real time?</span>
    </div>

    <!-- Branch row -->
    <div class="branch-row" :class="{ visible: step >= 2 }">
      <!-- YES branch -->
      <div class="branch">
        <div class="branch-label branch-yes">YES</div>
        <div class="v-conn short" />
        <div class="node node-yes">
          <span class="nd-name">Ink</span>
          <span class="nd-badge badge-clean">worth it ✓</span>
        </div>
      </div>

      <!-- NO branch -->
      <div class="branch" :class="{ visible: step >= 3 }">
        <div class="branch-label branch-no">NO</div>
        <div class="v-conn short" />
        <div class="node node-no">
          <span class="nd-name">console.log</span>
          <span class="nd-badge badge-dim">is fine</span>
        </div>
      </div>
    </div>

    <!-- Pattern picker — below YES branch
    <div class="pattern-picker" :class="{ visible: step >= 4 }">
      <div class="v-conn short" />
      <div class="pattern-bar">
        <div class="pat-row">
          <span class="pat-q">One-shot?</span>
          <span class="pat-sep">→</span>
          <span class="pat-name">Wizard pattern</span>
        </div>
        <div class="pat-row">
          <span class="pat-q">Progress?</span>
          <span class="pat-sep">→</span>
          <span class="pat-name">Static pattern</span>
        </div>
        <div class="pat-row">
          <span class="pat-q">Dashboard?</span>
          <span class="pat-sep">→</span>
          <span class="pat-name">WindowSize pattern</span>
        </div>
        <div class="pat-row">
          <span class="pat-q">60fps AI?</span>
          <span class="pat-sep">→</span>
          <span class="pat-warn">Claude Code territory</span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ step?: number }>();
const step = computed(() => props.step ?? 0);
</script>

<style scoped>
.decision-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "JetBrains Mono", monospace;
  gap: 0;
  height: 360px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

/* ── Connectors ──────────────────────────────── */
.v-conn {
  width: 2px;
  height: 16px;
  background: #3d5940;
  flex-shrink: 0;
}
.v-conn.short {
  height: 10px;
}

/* ── Nodes ───────────────────────────────────── */
.node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1.5px solid;
  transition: all 0.3s ease;
}

.node-root {
  border-color: #3cff7a;
  background: #0c180c;
  width: 260px;
}

.node-question {
  border-color: #3d5940;
  background: #0c0f0c;
  width: 340px;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.node-question.visible {
  opacity: 1;
  transform: translateY(0);
}

.node-yes {
  border-color: #3cff7a;
  background: #0c180c;
  width: 190px;
}

.node-no {
  border-color: #3d5940;
  background: #0c0f0c;
  width: 190px;
}

.nd-name {
  font-size: 13px;
  color: #c8dec4;
}

.nd-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
.badge-clean {
  color: #3cff7a;
  background: rgba(60, 255, 122, 0.08);
  border: 1px solid #3cff7a;
}
.badge-dim {
  color: #6b9e6b;
  background: transparent;
  border: 1px solid #3d5940;
}

/* ── Branch row ──────────────────────────────── */
.branch-row {
  display: flex;
  gap: 48px;
  align-items: flex-start;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.branch-row.visible {
  opacity: 1;
  transform: translateY(0);
}

.branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  opacity: 0;
  transition: opacity 0.35s ease;
}
/* YES always visible once branch-row is visible */
.branch-row.visible .branch:first-child {
  opacity: 1;
}
.branch.visible {
  opacity: 1 !important;
}

.branch-label {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 4px;
}
.branch-yes {
  color: #3cff7a;
}
.branch-no {
  color: #ff4a4a;
}

/* ── Pattern picker ──────────────────────────── */
.pattern-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.pattern-picker.visible {
  opacity: 1;
  transform: translateY(0);
}

.pattern-bar {
  padding: 10px 20px;
  border: 1px solid #3d5940;
  border-radius: 6px;
  background: #0c0f0c;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pat-row {
  display: flex;
  gap: 10px;
  font-size: 12px;
  align-items: baseline;
}
.pat-q {
  color: #6b9e6b;
  min-width: 100px;
}
.pat-sep {
  color: #3cff7a;
}
.pat-name {
  color: #c8dec4;
}
.pat-warn {
  color: #ff4a4a;
  font-weight: 600;
}
</style>
