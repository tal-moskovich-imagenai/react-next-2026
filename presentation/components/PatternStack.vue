<template>
  <div class="pattern-grid">
    <div
      v-for="(pattern, i) in patterns"
      :key="i"
      class="pattern-tile"
      :class="{ visible: step > i, warning: pattern.warning }"
    >
      <div class="tile-header">
        <span class="tile-label">{{ pattern.label }}</span>
        <span v-if="pattern.example" class="tile-example">{{ pattern.example }}</span>
      </div>
      <div class="tile-body">
        <div
          v-for="(line, j) in pattern.lines"
          :key="j"
          class="tile-line"
          :class="line.cls"
        >{{ line.text }}</div>
      </div>
      <div v-if="pattern.badge" class="tile-badge" :class="pattern.badgeCls">
        {{ pattern.badge }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)

const patterns = [
  {
    label: 'Wizard',
    example: 'prisma init',
    lines: [
      { text: 'Which database?', cls: 'bright' },
      { text: '❯ PostgreSQL', cls: 'green' },
      { text: '  MySQL', cls: 'dim' },
      { text: '  SQLite', cls: 'dim' },
      { text: '↑↓ navigate · Enter confirm', cls: 'very-dim' },
    ],
    badge: 'zero optimization needed',
    badgeCls: 'badge-dim',
  },
  {
    label: 'Progress',
    example: 'gatsby build',
    lines: [
      { text: 'Building...', cls: 'bright' },
      { text: '████████░░ 847/1000', cls: 'green' },
      { text: '✓ pages generated', cls: 'dim' },
      { text: '✓ assets bundled', cls: 'dim' },
      { text: 'use <Static> pattern', cls: 'very-dim' },
    ],
    badge: '<Static> for history',
    badgeCls: 'badge-dim',
  },
  {
    label: 'Dashboard',
    example: 'wrangler dev',
    lines: [
      { text: '┌──────┬──────┐', cls: 'border' },
      { text: '│ logs │ reqs │', cls: 'border' },
      { text: '├──────┼──────┤', cls: 'border' },
      { text: '│  ... │  ... │', cls: 'dim' },
      { text: 'useWindowSize()', cls: 'very-dim' },
    ],
    badge: 'split-pane layout',
    badgeCls: 'badge-dim',
  },
  {
    label: '60fps AI',
    example: 'Claude Code',
    warning: true,
    lines: [
      { text: 'tokens/sec: 60', cls: 'bright' },
      { text: '24,000 cells/frame', cls: 'warn' },
      { text: '1.4M objects/sec', cls: 'warn' },
      { text: 'GC every ~10ms', cls: 'warn' },
      { text: 'custom renderer', cls: 'very-dim' },
    ],
    badge: '⚠ Claude Code territory',
    badgeCls: 'badge-warn',
  },
]
</script>

<style scoped>
.pattern-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  font-family: 'JetBrains Mono', monospace;
}

.pattern-tile {
  background: #0C0F0C;
  border: 1px solid #1E3320;
  border-radius: 6px;
  padding: 12px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.pattern-tile.visible {
  opacity: 1;
  transform: translateY(0);
}

.pattern-tile.warning {
  border-color: #FF4A4A;
  background: #0F0C0C;
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #1E3320;
}

.tile-label {
  font-size: 12px;
  font-weight: 700;
  color: #3CFF7A;
  letter-spacing: 0.04em;
}

.pattern-tile.warning .tile-label {
  color: #FF4A4A;
}

.tile-example {
  font-size: 10px;
  color: #3D5940;
}

.tile-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tile-line {
  font-size: 12px;
  line-height: 1.5;
}

.bright     { color: #C8DEC4; }
.green      { color: #3CFF7A; }
.dim        { color: #3D5940; }
.very-dim   { color: #1E3320; font-size: 10px; margin-top: 2px; }
.warn       { color: #FF4A4A; }
.border     { color: #3D5940; font-size: 11px; }

.tile-badge {
  margin-top: 8px;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  display: inline-block;
}

.badge-dim  { background: #0C150C; color: #3D5940; border: 1px solid #1E3320; }
.badge-warn { background: rgba(255,74,74,0.1); color: #FF4A4A; border: 1px solid rgba(255,74,74,0.4); }
</style>
