<template>
  <div class="fix3-root">

    <!-- Component tree -->
    <div class="tree-section">
      <div class="tree-label">React component tree after setState(&lt;Counter /&gt;)</div>

      <div class="tree">

        <!-- Root -->
        <div class="tree-node node-root">
          <span class="nd-name">&lt;App /&gt;</span>
          <span class="nd-badge" :class="step >= 1 ? 'badge-dirty' : 'badge-neutral'">
            {{ step >= 1 ? 'dirty ↑' : '—' }}
          </span>
        </div>

        <div class="tree-row">
          <!-- Header subtree — clean -->
          <div class="subtree">
            <div class="tree-connector" />
            <div class="tree-node" :class="step >= 1 ? 'node-clean' : 'node-neutral'">
              <span class="nd-name">&lt;Header /&gt;</span>
              <span class="nd-badge" :class="step >= 1 ? 'badge-clean' : 'badge-neutral'">
                {{ step >= 1 ? '✓ clean' : '—' }}
              </span>
            </div>
            <div v-if="step >= 2" class="blit-label">
              <span class="blit-arrow">⤷</span> blit from front buffer
            </div>
          </div>

          <!-- Counter subtree — dirty -->
          <div class="subtree">
            <div class="tree-connector" />
            <div class="tree-node node-dirty">
              <span class="nd-name">&lt;Counter /&gt;</span>
              <span class="nd-badge badge-dirty">dirty</span>
            </div>
            <div v-if="step >= 3" class="render-label">
              <span class="render-arrow">⤷</span> re-render → write cells
            </div>
          </div>

          <!-- Sidebar subtree — clean -->
          <div class="subtree">
            <div class="tree-connector" />
            <div class="tree-node" :class="step >= 1 ? 'node-clean' : 'node-neutral'">
              <span class="nd-name">&lt;Sidebar /&gt;</span>
              <span class="nd-badge" :class="step >= 1 ? 'badge-clean' : 'badge-neutral'">
                {{ step >= 1 ? '✓ clean' : '—' }}
              </span>
            </div>
            <div v-if="step >= 2" class="blit-label">
              <span class="blit-arrow">⤷</span> blit from front buffer
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom result -->
    <div v-if="step >= 3" class="result-bar">
      <span class="res-label">stdout writes:</span>
      <span class="res-val">only Counter's changed cells</span>
      <span class="res-sep"> · </span>
      <span class="res-skipped">Header + Sidebar → zero bytes</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)
</script>

<style scoped>
.fix3-root {
  font-family: 'JetBrains Mono', monospace;
  padding-top: 4px;
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 740px;
  margin: 0 auto;
  width: 100%;
}

/* ── Tree section ──────────────────────────────── */
.tree-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.tree-label {
  font-size: 11px;
  color: #6B9E6B;
}

.tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

/* ── Tree nodes ──────────────────────────────────── */
.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1.5px solid;
  transition: all 0.3s ease;
}
.node-root    { border-color: #3CFF7A; background: #0C180C; width: 200px; }
.node-neutral { border-color: #1E3320; background: #0C0F0C; }
.node-clean   { border-color: #3D5940; background: #0A120A; }
.node-dirty   { border-color: #FF4A4A; background: #150A0A; }

.nd-name { font-size: 13px; color: #C8DEC4; }

.nd-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}
.badge-neutral { color: #3D5940; background: transparent; border: 1px solid #1E3320; }
.badge-clean   { color: #3CFF7A; background: rgba(60,255,122,0.08); border: 1px solid #3CFF7A; }
.badge-dirty   { color: #FF4A4A; background: rgba(255,74,74,0.1); border: 1px solid #FF4A4A; }

/* ── Row of children ─────────────────────────────── */
.tree-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.subtree {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.tree-connector {
  width: 2px;
  height: 12px;
  background: #3D5940;
}

/* ── Blit / render labels ──────────────────────── */
.blit-label {
  font-size: 11px;
  color: #3CFF7A;
  animation: fade-up 0.3s ease-out both;
}
.blit-arrow { margin-right: 4px; }

.render-label {
  font-size: 11px;
  color: #FF4A4A;
  animation: fade-up 0.3s ease-out both;
}
.render-arrow { margin-right: 4px; }

/* ── Result bar ──────────────────────────────────── */
.result-bar {
  padding: 10px 20px;
  border: 1px solid #3CFF7A;
  border-radius: 6px;
  background: #0C150C;
  font-size: 13px;
  animation: fade-up 0.3s ease-out both;
}
.res-label   { color: #6B9E6B; }
.res-val     { color: #3CFF7A; font-weight: 700; }
.res-sep     { color: #3D5940; }
.res-skipped { color: #6B9E6B; font-style: italic; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
