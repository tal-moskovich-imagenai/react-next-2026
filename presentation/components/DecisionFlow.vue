<template>
  <div class="decision-root">

    <!-- Root question — always visible -->
    <div class="node node-root">
      <div class="node-border">╔══════════════════════════════════╗</div>
      <div class="node-body">║&nbsp;&nbsp;Should I use Ink?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║</div>
      <div class="node-border">╚══════════════╤═══════════════════╝</div>
    </div>

    <!-- Connector down -->
    <div class="v-line" />

    <!-- Question 1 -->
    <Transition name="node-in">
      <div v-if="step >= 1" class="node node-question">
        <div class="node-border-q">┌────────────────────────────────┐</div>
        <div class="node-body-q">│ Do users see state update      │</div>
        <div class="node-body-q">│ in real time?                  │</div>
        <div class="node-border-q">└────────┬──────────────┬─────────┘</div>
      </div>
    </Transition>

    <!-- Branch row -->
    <Transition name="node-in">
      <div v-if="step >= 2" class="branch-row">
        <!-- YES branch -->
        <div class="branch">
          <div class="branch-label branch-yes">YES</div>
          <div class="v-line short" />
          <div class="node node-yes">
            <div class="node-border-y">┌────────────┐</div>
            <div class="node-body-y">│ Ink worth  │</div>
            <div class="node-body-y">│ it &nbsp;✓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
            <div class="node-border-y">└─────┬──────┘</div>
          </div>
        </div>

        <!-- NO branch -->
        <Transition name="node-in">
          <div v-if="step >= 3" class="branch">
            <div class="branch-label branch-no">NO</div>
            <div class="v-line short" />
            <div class="node node-no">
              <div class="node-border-n">┌───────────────┐</div>
              <div class="node-body-n">│ console.log   │</div>
              <div class="node-body-n">│ is fine       │</div>
              <div class="node-border-n">└───────────────┘</div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Pattern picker — below YES branch -->
    <Transition name="node-in">
      <div v-if="step >= 4" class="pattern-picker">
        <div class="v-line short" />
        <div class="node node-patterns">
          <div class="node-border-p">┌──────────────────────────────────────┐</div>
          <div class="node-pat">│ One-shot?&nbsp;&nbsp;&nbsp;&nbsp;<span class="pat-arrow">→</span> <span class="pat-name">Wizard pattern</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
          <div class="node-pat">│ Progress?&nbsp;&nbsp;&nbsp;&nbsp;<span class="pat-arrow">→</span> <span class="pat-name">Static pattern</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
          <div class="node-pat">│ Dashboard?&nbsp;&nbsp;&nbsp;<span class="pat-arrow">→</span> <span class="pat-name">WindowSize pattern</span>&nbsp;&nbsp;&nbsp;&nbsp;│</div>
          <div class="node-pat">│ 60fps AI?&nbsp;&nbsp;&nbsp;&nbsp;<span class="pat-arrow">→</span> <span class="pat-warn">Claude Code terr.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>│</div>
          <div class="node-border-p">└──────────────────────────────────────┘</div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)
</script>

<style scoped>
.decision-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  gap: 0;
  /* fixed height = full expanded diagram — title stays put as nodes reveal */
  height: 360px;
}

/* ── Connectors ─────────────────────────────── */
.v-line {
  width: 1.5px;
  height: 16px;
  background: #3D5940;
}
.v-line.short { height: 10px; }

/* ── Root node ──────────────────────────────── */
.node-root { text-align: center; }
.node-border { color: #3CFF7A; white-space: pre; }
.node-body   { color: #C8DEC4; white-space: pre; }

/* ── Question node ──────────────────────────── */
.node-question { text-align: center; }
.node-border-q { color: #6B9E6B; white-space: pre; }
.node-body-q   { color: #C8DEC4; white-space: pre; }

/* ── Branch row ─────────────────────────────── */
.branch-row {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

.branch {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branch-label {
  font-size: 11px;
  font-weight: 700;
  padding: 0 4px;
}
.branch-yes { color: #3CFF7A; }
.branch-no  { color: #FF4A4A; }

/* ── Yes node ───────────────────────────────── */
.node-border-y { color: #3CFF7A; white-space: pre; }
.node-body-y   { color: #C8DEC4; white-space: pre; }

/* ── No node ────────────────────────────────── */
.node-border-n { color: #6B9E6B; white-space: pre; }
.node-body-n   { color: #6B9E6B; white-space: pre; }

/* ── Pattern picker ─────────────────────────── */
.pattern-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.node-border-p { color: #6B9E6B; white-space: pre; }
.node-pat      { color: #C8DEC4; white-space: pre; }
.pat-arrow     { color: #3CFF7A; }
.pat-name      { color: #3CFF7A; }
.pat-warn      { color: #FF4A4A; }

/* ── Transitions ────────────────────────────── */
.node-in-enter-active {
  transition: opacity 0.35s ease-out, transform 0.35s ease-out;
}
.node-in-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
