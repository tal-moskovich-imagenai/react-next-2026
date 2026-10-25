<template>
  <div class="wt-root">

    <div class="timeline">
      <div class="when reveal" :class="{ on: step >= 1 }">
        <div class="when-label">yesterday</div>
        <div class="when-name old">devtool</div>
      </div>
      <span class="arrow reveal" :class="{ on: step >= 2 }">→</span>
      <div class="when reveal" :class="{ on: step >= 2 }">
        <div class="when-label">today</div>
        <div class="when-name">harness · ADE</div>
      </div>
      <span class="arrow reveal" :class="{ on: step >= 3 }">→</span>
      <div class="when when-next reveal" :class="{ on: step >= 3 }">
        <div class="when-label">tomorrow morning</div>
        <div class="when-name next">yours</div>
        <div class="when-sub">on Claude Code · or a wrapper</div>
      </div>
    </div>

    <div class="core reveal" :class="{ on: step >= 4 }">
      the name changes. <span class="hl">the basics don't.</span>
    </div>

    <div class="mods reveal" :class="{ on: step >= 5 }">
      <span class="badge">NEW</span>
      <span>Claude Code <b>mods</b>: panels · status line · slash commands · hooks</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ step?: number }>()
const step = computed(() => props.step ?? 0)
</script>

<style scoped>
.wt-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  font-family: 'JetBrains Mono', monospace;
  max-width: 860px;
  margin: 0 auto;
  padding-top: 16px;
  height: 420px;
}

/* Hidden parts keep their space so the layout never jumps between clicks. */
.reveal {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}
.reveal.on {
  opacity: 1;
  transform: translateY(0);
}

.timeline {
  display: flex;
  align-items: stretch;
  gap: 16px;
}
.when {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 22px;
  border-radius: 8px;
  border: 1.5px solid #3d5940;
  min-width: 170px;
}
.when-next {
  border-color: #3CFF7A;
  background: #0C180C;
}
.when-label { font-size: 12px; color: #6B9E6B; }
.when-name { font-size: 20px; font-weight: 700; color: #C8DEC4; white-space: nowrap; }
.when-name.old { color: #6B9E6B; text-decoration: line-through; }
.when-name.next { color: #3CFF7A; }
.when-sub { font-size: 11px; color: #6B9E6B; }
.arrow { color: #6B9E6B; font-size: 16px; align-self: center; }

.core {
  font-size: 22px;
  color: #C8DEC4;
}
.hl { color: #3CFF7A; font-weight: 700; }

.mods {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #C8DEC4;
  padding: 10px 18px;
  border-radius: 6px;
  border: 1px solid #00C4C4;
  background: rgba(0,196,196,0.06);
}
.mods b { color: #00C4C4; }
.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  color: #0C0F0C;
  background: #00C4C4;
}
</style>
