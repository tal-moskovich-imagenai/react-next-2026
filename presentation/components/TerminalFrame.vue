<template>
  <div class="terminal-frame" :style="borderColor ? { borderColor } : {}">
    <div class="terminal-titlebar" :style="borderColor ? { borderBottomColor: borderColor } : {}">
      <div class="traffic-lights">
        <span class="dot red" />
        <span class="dot yellow" />
        <span class="dot green" />
      </div>
      <span class="title">{{ title || 'terminal' }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  borderColor?: string
}>()
</script>

<style scoped>
.terminal-frame {
  background: #0C0F0C;
  border: 1.5px solid #3D5940;
  border-radius: 10px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.03);
}

.terminal-titlebar {
  background: #0C130C;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #3D5940;
}

.traffic-lights {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
}
.dot.red    { background: #FF4A4A; }
.dot.yellow { background: #FFBD2E; }
.dot.green  { background: #3CFF7A; }

.title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #6B9E6B;
  margin-right: 50px;
}

.terminal-body {
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #C8DEC4;
  min-height: 60px;
}
</style>
