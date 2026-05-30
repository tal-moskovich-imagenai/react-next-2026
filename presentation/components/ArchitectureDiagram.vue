<template>
  <div class="arch-diagram">

    <!-- Layer 1: Your Components -->
    <Transition name="layer">
      <div v-if="step >= 1" class="layer layer-components">
        <div class="layer-badge" style="color: #3CFF7A">LAYER 1</div>
        <div class="layer-title">Your Components</div>
        <div class="chips">
          <!-- JSX chip -->
          <span class="chip chip-blue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            JSX
          </span>
          <!-- Hooks chip (atom symbol ⚛) -->
          <span class="chip chip-blue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <ellipse cx="12" cy="12" rx="10" ry="4"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            </svg>
            hooks
          </span>
          <!-- useState chip -->
          <span class="chip chip-teal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h1v6H9"/>
              <path d="M13 15h2"/>
              <path d="M13 12h2"/>
              <path d="M13 9h2"/>
            </svg>
            useState
          </span>
          <!-- useEffect chip -->
          <span class="chip chip-teal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 2v6h-6"/>
              <path d="M21 13a9 9 0 1 1-3-7.7L21 8"/>
            </svg>
            useEffect
          </span>
          <!-- props chip -->
          <span class="chip chip-dim">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            props
          </span>
        </div>
      </div>
    </Transition>

    <!-- Arrow 1 to 2 -->
    <Transition name="fade">
      <div v-if="step >= 2" class="arrow-block">
        <div class="arrow-line" />
        <div class="arrow-label">what changed?</div>
      </div>
    </Transition>

    <!-- Layer 2: Reconciler -->
    <Transition name="layer">
      <div v-if="step >= 2" class="layer layer-reconciler">
        <div class="layer-badge" style="color: #3CFF7A">LAYER 2</div>
        <div class="layer-title">The Reconciler</div>
        <div class="layer-sub">react-reconciler &middot; virtual tree diff &middot; fiber</div>
      </div>
    </Transition>

    <!-- Arrow 2 to 3 -->
    <Transition name="fade">
      <div v-if="step >= 4" class="arrow-block">
        <div class="arrow-line" />
        <div class="arrow-label">how to apply it</div>
      </div>
    </Transition>

    <!-- Layer 3: Renderers + pluggable badge -->
    <div class="renderers-wrapper">
      <!-- Pluggable badge — click 3 -->
      <Transition name="pop">
        <div v-if="step >= 3" class="pluggable-badge">↗ pluggable</div>
      </Transition>
      <!-- Renderer boxes -->
      <div class="renderers">
        <Transition name="layer">
          <div v-if="step >= 4" class="renderer renderer-dom">
            <div class="renderer-icon">⬛</div>
            <div class="renderer-name">react-dom</div>
            <div class="renderer-desc">Browser DOM</div>
          </div>
        </Transition>
        <Transition name="layer">
          <div v-if="step >= 5" class="renderer renderer-native">
            <div class="renderer-icon">📱</div>
            <div class="renderer-name">react-native</div>
            <div class="renderer-desc">iOS / Android</div>
          </div>
        </Transition>
        <Transition name="layer">
          <div v-if="step >= 6" class="renderer renderer-ink highlight">
            <div class="renderer-icon">▶_</div>
            <div class="renderer-name">ink</div>
            <div class="renderer-desc">Terminal / ANSI</div>
            <div class="today-badge">TODAY</div>
          </div>
        </Transition>
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
.arch-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  padding: 0;
  height: 350px;
}

/* ── Layer boxes ─────────────────────────────────── */
.layer {
  width: 500px;
  padding: 7px 16px;
  border-radius: 7px;
  text-align: center;
}
.layer-components {
  background: #0E1A12;
  border: 1.5px solid #3CFF7A;
}
.layer-reconciler {
  background: #0C150C;
  border: 1.5px solid #3CFF7A;
  position: relative;
}

.layer-badge {
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.08em;
  margin-bottom: 2px;
}
.layer-title {
  font-size: 17px;
  font-weight: bold;
  color: #C8DEC4;
  margin-bottom: 5px;
}
.layer-sub {
  font-size: 11px;
  color: #6B9E6B;
}

/* ── Chips in Layer 1 ───────────────────────────── */
.chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
}
.chip-blue  { color: #3CFF7A; border-color: #3CFF7A; background: rgba(60,255,122,0.06); }
.chip-teal  { color: #00C4C4; border-color: #00C4C4; background: rgba(0,196,196,0.06); }
.chip-dim   { color: #6B9E6B; border-color: #6B9E6B; background: transparent; }

/* ── Renderers wrapper ────────────────────────────── */
.renderers-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

/* ── Pluggable badge ────────────────────────────── */
.pluggable-badge {
  background: #0C0F0C;
  border: 1px dashed #3CFF7A;
  color: #3CFF7A;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 5px;
  white-space: nowrap;
  letter-spacing: 0.04em;
}

/* ── Arrows ──────────────────────────────────────── */
.arrow-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.arrow-line {
  width: 2px;
  height: 10px;
  background: #3CFF7A;
  position: relative;
}
.arrow-line::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: -4px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid #3CFF7A;
}
.arrow-label {
  font-size: 10px;
  color: #6B9E6B;
  margin-top: 5px;
}

/* ── Renderer boxes ──────────────────────────────── */
.renderers {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.renderer {
  width: 140px;
  padding: 8px 8px;
  border-radius: 7px;
  text-align: center;
  background: #0C0F0C;
  border: 1.5px solid #3D5940;
}
.renderer-ink.highlight {
  border: 2px solid #3CFF7A;
  background: #0C150C;
  box-shadow: 0 0 16px rgba(60,255,122,0.12);
}
.renderer-icon {
  font-size: 16px;
  margin-bottom: 4px;
  font-family: monospace;
  color: #6B9E6B;
}
.renderer-ink.highlight .renderer-icon {
  color: #3CFF7A;
}
.renderer-name {
  font-size: 12px;
  font-weight: bold;
  color: #C8DEC4;
  margin-bottom: 2px;
}
.renderer-ink.highlight .renderer-name {
  color: #3CFF7A;
  font-size: 14px;
}
.renderer-desc {
  font-size: 10px;
  color: #6B9E6B;
}
.today-badge {
  margin-top: 5px;
  background: #3CFF7A;
  color: #090B09;
  font-size: 9px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 3px;
  display: inline-block;
  letter-spacing: 0.05em;
}


/* ── Transitions ─────────────────────────────────── */
.layer-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.layer-enter-from   { opacity: 0; transform: translateY(-10px); }

.fade-enter-active  { transition: opacity 0.3s ease; }
.fade-enter-from    { opacity: 0; }

.pop-enter-active   { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.pop-enter-from     { opacity: 0; transform: translateY(-50%) scale(0.7); }
</style>
