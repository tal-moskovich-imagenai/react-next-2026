<template>
  <div class="app">
    <main class="app-main">
      <BootSequence :started="true" @completed="showLinks = true" />

      <Transition name="links-reveal">
        <div v-if="showLinks" class="after-boot">
          <ProfileCard />
          <LinksPanel />
        </div>
      </Transition>
    </main>

    <footer class="app-footer">
      <span class="footer-dim">ReactNext 2026 · June 23 · Hall A</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BootSequence from './BootSequence.vue'
import ProfileCard from './ProfileCard.vue'
import LinksPanel from './LinksPanel.vue'

const showLinks = ref(false)
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #090B09;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 540px;
  padding: 32px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.app-footer {
  width: 100%;
  padding: 16px 24px;
  border-top: 1px solid #1E3320;
  text-align: center;
}
.footer-dim {
  font-size: 11px;
  color: #3D5940;
}

.after-boot {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Links reveal transition ───────────────── */
.links-reveal-enter-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.links-reveal-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
</style>
