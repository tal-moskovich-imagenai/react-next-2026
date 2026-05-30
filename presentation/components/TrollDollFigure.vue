<template>
  <div class="doll" :style="{ '--start-delay': `${delay}s`, fontSize: size + 'px' }">
    <!-- Hair tier 1: sparse tips -->
    <div class="dl" style="animation-delay: calc(var(--start-delay) + 0.00s)">
      <span class="y">▓  </span><span class="m">▓  </span><span class="b">▓  </span><span class="c">▓</span>
    </div>
    <!-- Hair tier 2: full rainbow base -->
    <div class="dl" style="animation-delay: calc(var(--start-delay) + 0.04s)">
      <span class="y">▓▓</span><span class="m">▓▓▓</span><span class="b">▓▓</span><span class="c">▓▓▓</span>
    </div>
    <!-- Face -->
    <div class="dl g" style="animation-delay: calc(var(--start-delay) + 0.08s)">╭────────╮</div>
    <div class="dl"   style="animation-delay: calc(var(--start-delay) + 0.12s)">
      <span class="g">│ </span><span class="w">●</span><span class="g">    </span><span class="w">●</span><span class="g"> │</span>
    </div>
    <div class="dl g" style="animation-delay: calc(var(--start-delay) + 0.16s)">│  ╰──╯  │</div>
    <div class="dl g" style="animation-delay: calc(var(--start-delay) + 0.20s)">╰────────╯</div>
    <!-- Body -->
    <div class="dl g" style="animation-delay: calc(var(--start-delay) + 0.24s)">╭──────────╮</div>
    <div class="dl g" style="animation-delay: calc(var(--start-delay) + 0.28s)">─┤          ├─</div>
    <div class="dl g" style="animation-delay: calc(var(--start-delay) + 0.32s)">╰──╮    ╭──╯</div>
    <div class="dl g" style="animation-delay: calc(var(--start-delay) + 0.36s)">   │    │</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ delay?: number; size?: number }>(), {
  delay: 0,
  size: 11,
})
</script>

<style scoped>
.doll {
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.35;
  white-space: pre;
  display: flex;
  flex-direction: column;
}

.dl {
  display: block;
  opacity: 0;
  animation: troll-line-in 0.2s ease-out forwards;
}

.y { color: #FFD700; }
.m { color: #FF69B4; }
.b { color: #6495ED; }
.c { color: #00CED1; }
.g { color: #3CFF7A; }
.w { color: #FFFFFF; font-weight: bold; }

@keyframes troll-line-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
