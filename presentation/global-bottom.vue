<template>
  <div class="tui-status-bar">
    <div class="status-left">
      <span class="status-icon">▶</span>
      <span class="status-session">react-runs-your-terminal</span>
    </div>
    <div class="status-center">
      <span class="status-branch">ReactNext 2026 · Jun 23</span>
    </div>
    <div class="status-right">
      <span class="status-slide">{{ nav.currentPage }} / {{ nav.total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNav } from '@slidev/client'
const nav = useNav()
</script>

<style scoped>
.tui-status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: #0C0F0C;
  border-top: 1px solid #1E3320;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  font-size: 11px;
  z-index: 200;
  user-select: none;
}

.status-left,
.status-center,
.status-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  color: #3CFF7A;
  font-size: 9px;
}

.status-session {
  color: #3D5940;
  letter-spacing: 0.02em;
}

.status-branch {
  color: #3D5940;
}

.status-slide {
  color: #3CFF7A;
  font-weight: 500;
}
</style>
