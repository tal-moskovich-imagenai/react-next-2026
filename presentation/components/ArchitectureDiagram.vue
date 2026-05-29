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
        <!-- Pluggable badge appears on click 3 -->
        <Transition name="pop">
          <div v-if="step >= 3" class="pluggable-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18"/>
              <path d="M8 6h10v10"/>
            </svg>
            pluggable
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Arrow 2 to 3 -->
    <Transition name="fade">
      <div v-if="step >= 4" class="arrow-block">
        <div class="arrow-line" />
        <div class="arrow-label">how to apply it</div>
      </div>
    </Transition>

    <!-- Layer 3: Renderers — each appears individually -->
    <div v-if="step >= 4" class="renderers">
      <!-- react-dom -->
      <Transition name="layer">
        <div v-if="step >= 4" class="renderer renderer-dom">
          <div class="renderer-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5940" stroke-width="1.5" stroke-linecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <div class="renderer-name">react-dom</div>
          <div class="renderer-desc">Browser DOM</div>
        </div>
      </Transition>

      <!-- react-native -->
      <Transition name="layer">
        <div v-if="step >= 5" class="renderer renderer-native">
          <div class="renderer-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3D5940" stroke-width="1.5" stroke-linecap="round">
              <rect x="7" y="2" width="10" height="20" rx="2"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </div>
          <div class="renderer-name">react-native</div>
          <div class="renderer-desc">iOS / Android</div>
        </div>
      </Transition>

      <!-- ink — highlighted and bold -->
      <Transition name="layer">
        <div v-if="step >= 6" class="renderer renderer-ink highlight">
          <div class="renderer-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3CFF7A" stroke-width="1.5" stroke-linecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M7 8l-2 4 2 4"/>
              <path d="M17 8l2 4-2 4"/>
              <line x1="12" y1="7" x2="12" y2="17"/>
            </svg>
          </div>
          <div class="renderer-name">ink</div>
          <div class="renderer-desc">Terminal / ANSI</div>
          <div class="today-badge">TODAY</div>
        </div>
      </Transition>
    </div>

    <!-- Stats -->
    <Transition name="fade">
      <div v-if="step >= 6" class="stats">
        38k stars &middot; 3.7M downloads/week &middot; Anthropic &middot; GitHub &middot; Shopify
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
.arch-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  padding: 8px 0;
  min-height: 360px;
}

/* ── Layer boxes ─────────────────────────────────── */
.layer {
  width: 540px;
  padding: 14px 24px;
  border-radius: 8px;
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
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}
.layer-title {
  font-size: 20px;
  font-weight: bold;
  color: #C8DEC4;
  margin-bottom: 8px;
}
.layer-sub {
  font-size: 12px;
  color: #3D5940;
}

/* ── Chips in Layer 1 ───────────────────────────── */
.chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}
.chip-blue  { color: #3CFF7A; border-color: #3CFF7A; background: rgba(60,255,122,0.06); }
.chip-teal  { color: #00C4C4; border-color: #00C4C4; background: rgba(0,196,196,0.06); }
.chip-dim   { color: #3D5940; border-color: #1E3320; background: transparent; }

/* ── Pluggable badge ────────────────────────────── */
.pluggable-badge {
  position: absolute;
  right: -130px;
  top: 50%;
  transform: translateY(-50%);
  background: #0C0F0C;
  border: 1px dashed #3CFF7A;
  color: #3CFF7A;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 6px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
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
  height: 24px;
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
  font-size: 11px;
  color: #3D5940;
  margin-top: 8px;
}

/* ── Renderer boxes ──────────────────────────────── */
.renderers {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.renderer {
  width: 158px;
  padding: 14px 12px;
  border-radius: 8px;
  text-align: center;
  background: #0C0F0C;
  border: 1.5px solid #1E3320;
}
.renderer-ink.highlight {
  border: 2.5px solid #3CFF7A;
  background: #0C150C;
  box-shadow: 0 0 20px rgba(60,255,122,0.12);
}
.renderer-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}
.renderer-name {
  font-size: 13px;
  font-weight: bold;
  color: #3D5940;
  margin-bottom: 3px;
}
.renderer-ink.highlight .renderer-name {
  color: #3CFF7A;
  font-size: 15px;
}
.renderer-desc {
  font-size: 11px;
  color: #1E3320;
}
.renderer-ink.highlight .renderer-desc {
  color: #3D5940;
}
.today-badge {
  margin-top: 8px;
  background: #3CFF7A;
  color: #090B09;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 4px;
  display: inline-block;
  letter-spacing: 0.05em;
}

/* ── Stats ───────────────────────────────────────── */
.stats {
  font-size: 12px;
  color: #3D5940;
  text-align: center;
  margin-top: 4px;
}

/* ── Transitions ─────────────────────────────────── */
.layer-enter-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.layer-enter-from   { opacity: 0; transform: translateY(-10px); }

.fade-enter-active  { transition: opacity 0.3s ease; }
.fade-enter-from    { opacity: 0; }

.pop-enter-active   { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.pop-enter-from     { opacity: 0; transform: translateY(-50%) scale(0.7); }
</style>
