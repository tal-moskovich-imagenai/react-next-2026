<template>
  <div class="cost-root">

    <!-- Two-phase pipeline -->
    <div class="phases">

      <!-- Phase 1: React -->
      <div class="phase phase-react" :class="{ dimmed: step >= 2 }">
        <div class="phase-label">Phase 1 — React</div>
        <div class="phase-nodes">
          <div class="phase-node" :class="{ bailed: step >= 1 }">
            <div class="pn-name">&lt;Header /&gt;</div>
            <div v-if="step >= 1" class="pn-badge badge-skip">✓ skip</div>
          </div>
          <div class="phase-node" :class="{ bailed: step >= 1 }">
            <div class="pn-name">&lt;Sidebar /&gt;</div>
            <div v-if="step >= 1" class="pn-badge badge-skip">✓ skip</div>
          </div>
          <div class="phase-node changed">
            <div class="pn-name">&lt;Counter /&gt;</div>
            <div class="pn-badge badge-run">re-render</div>
          </div>
        </div>
        <div v-if="step >= 1" class="phase-note note-green">React bails out 2 of 3 components ✓</div>
      </div>

      <!-- Arrow between phases -->
      <div class="phase-arrow">
        <div class="pa-line" />
        <div class="pa-head">→</div>
        <div class="pa-label">onRender</div>
      </div>

      <!-- Phase 2: Ink -->
      <div class="phase phase-ink" :class="{ highlight: step >= 2 }">
        <div class="phase-label">Phase 2 — Ink</div>
        <div class="phase-nodes">
          <div class="phase-node ink-node" :class="{ lit: step >= 2 }">
            <div class="pn-name">buildScreen()</div>
            <div v-if="step >= 3" class="pn-badge badge-warn">24,000 objects</div>
          </div>
          <div class="phase-node ink-node" :class="{ lit: step >= 2 }">
            <div class="pn-name">renderNodeToOutput()</div>
            <div v-if="step >= 2" class="pn-badge badge-warn">ALL nodes</div>
          </div>
          <div class="phase-node ink-node" :class="{ lit: step >= 2 }">
            <div class="pn-name">diff + stdout</div>
            <div class="pn-badge badge-ok">write</div>
          </div>
        </div>
        <div v-if="step >= 4" class="phase-note note-red">GC fires every ~10ms → stutter 💥</div>
      </div>

    </div>

    <!-- Bottom label -->
    <div v-if="step >= 2" class="bottom-note">
      React bails out at component level. Ink still rebuilds the full screen.
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)
</script>

<style scoped>
.cost-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-family: 'JetBrains Mono', monospace;
  padding-top: 4px;
  height: 340px;
}

/* ── Phases row ──────────────────────────────────── */
.phases {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  max-width: 740px;
}

.phase {
  flex: 1;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid #3D5940;
  background: #0C0F0C;
  transition: all 0.4s ease;
}

.phase-react { border-color: #3D5940; }
.phase-react.dimmed { opacity: 0.5; }
.phase-ink   { border-color: #3D5940; }
.phase-ink.highlight {
  border-color: #FF4A4A;
  background: #120808;
  box-shadow: 0 0 20px rgba(255,74,74,0.12);
}

.phase-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #6B9E6B;
  margin-bottom: 10px;
}
.phase-ink.highlight .phase-label { color: #FF4A4A; }

/* ── Nodes inside phase ──────────────────────────── */
.phase-nodes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.phase-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #1E3320;
  background: #0C130C;
  transition: all 0.3s ease;
}
.phase-node.bailed {
  opacity: 0.45;
  border-color: #1E3320;
}
.phase-node.changed {
  border-color: #3CFF7A;
  background: #0C180C;
}
.phase-node.ink-node.lit {
  border-color: #FF4A4A;
  background: #150A0A;
}

.pn-name {
  font-size: 12px;
  color: #C8DEC4;
}

.pn-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}
.badge-skip { color: #3CFF7A; background: rgba(60,255,122,0.1); border: 1px solid #3CFF7A; }
.badge-run  { color: #3CFF7A; background: rgba(60,255,122,0.08); border: 1px solid #3CFF7A; }
.badge-warn { color: #FF4A4A; background: rgba(255,74,74,0.1); border: 1px solid #FF4A4A; }
.badge-ok   { color: #6B9E6B; background: transparent; border: 1px solid #3D5940; }

.phase-note {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  animation: fade-up 0.3s ease-out both;
}
.note-green { color: #3CFF7A; }
.note-red   { color: #FF4A4A; }

/* ── Arrow between phases ──────────────────────── */
.phase-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 60px;
  flex-shrink: 0;
}
.pa-line {
  width: 36px;
  height: 2px;
  background: #3D5940;
}
.pa-head {
  font-size: 18px;
  color: #3D5940;
  margin-top: -12px;
  margin-left: 24px;
}
.pa-label {
  font-size: 10px;
  color: #6B9E6B;
  white-space: nowrap;
}

/* ── Bottom label ────────────────────────────────── */
.bottom-note {
  font-size: 13px;
  color: #C8DEC4;
  text-align: center;
  animation: fade-up 0.3s ease-out both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
