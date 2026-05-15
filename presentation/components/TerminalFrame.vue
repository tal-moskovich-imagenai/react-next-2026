<template>
  <div class="terminal-frame">
    <div class="terminal-titlebar">
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
}>()
</script>

<style scoped>
.terminal-frame {
  background: #0A0E17;
  border: 1.5px solid #1E2733;
  border-radius: 10px;
  overflow: hidden;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.04);
}

.terminal-titlebar {
  background: #161B22;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #1E2733;
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
.dot.red    { background: #FE4A49; }
.dot.yellow { background: #FFBD2E; }
.dot.green  { background: #27C93F; }

.title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #6E7681;
  margin-right: 50px;
}

.terminal-body {
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #F3EFF5;
  min-height: 60px;
}
</style>
