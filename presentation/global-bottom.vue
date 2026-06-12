<template>
  <div class="tui-status-bar">
    <div class="status-left">
      <span class="status-icon">▶</span>
      <span class="status-session">react-runs-your-terminal</span>
    </div>
    <div class="status-center">
      <a href="https://rn26.tmosko.com" target="_blank" class="status-url">rn26.tmosko.com</a>
    </div>
    <div class="status-right">
      <span class="status-slide">{{ nav.currentPage }} / {{ nav.total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNav } from "@slidev/client";
const nav = useNav();
</script>

<style scoped>
.tui-status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: #0c0f0c;
  border-top: 1px solid #1e3320;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 0 16px;
  font-family: "JetBrains Mono", "SF Mono", monospace;
  font-size: 11px;
  z-index: 200;
  user-select: none;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-start;
}

.status-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

.status-icon {
  color: #3cff7a;
  font-size: 9px;
}

.status-session {
  color: #3d5940;
  letter-spacing: 0.02em;
}

.status-branch {
  color: #3d5940;
}

.status-url {
  color: #3d5940;
  text-decoration: none;
}

.status-slide {
  color: #3cff7a;
  font-weight: 500;
}
</style>
