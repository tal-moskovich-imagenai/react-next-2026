<template>
  <div class="neofetch-root">
    <TerminalFrame title="whoami" class="neofetch-frame">
      <div class="neofetch-body">
        <!-- Left: TM initials block -->
        <div class="neofetch-avatar">
          <div class="avatar-box">
            <div class="avatar-inner">
              <img src="/images/tal.webp" alt="TM" class="avatar-photo" />
            </div>
          </div>
          <div class="avatar-label">tal@reactnext</div>
          <div class="avatar-sep">──────────────</div>
        </div>

        <!-- Right: system info rows -->
        <div class="neofetch-info">
          <div
            v-for="(row, i) in infoRows"
            :key="i"
            class="info-row"
            :style="{ animationDelay: i * 0.1 + 's' }"
          >
            <span class="info-key">{{ row.key }}</span>
            <span class="info-sep"> </span>
            <span class="info-val" :class="row.cls || ''">{{ row.val }}</span>
          </div>
          <div class="cursor-line">
            <span class="info-key">▸ </span>
            <span class="cursor-blink-span">█</span>
          </div>
        </div>
      </div>
    </TerminalFrame>

    <!-- Imagen logo -->
    <div class="logo-overlay">
      <img src="/images/imagen-logo.svg" alt="Imagen" class="imagen-logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
const infoRows = [
  { key: "name      ", val: "Tal Moskovich", cls: "val-green" },
  {
    key: "loves to  ",
    val: "Empower people & build products",
    cls: "val-blue",
  },
  { key: "role      ", val: "Senior Frontend Engineer @ ImagenAI" },
  { key: "host      ", val: "Lo-Techi 🎧 w/ Adir Kandel" },
  { key: "style     ", val: "Black & White always" },
];
</script>

<style scoped>
.neofetch-root {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.neofetch-frame {
  width: 800px;
}

.neofetch-body {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  padding: 12px 8px;
}

/* ── Avatar ───────────────────────────────────── */
.neofetch-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.avatar-box {
  width: 200px;
  height: 200px;
  border: 2px solid #3cff7a;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090b09;
}

.avatar-inner {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.avatar-photo {
  width: 200%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}

.avatar-label {
  font-size: 10px;
  color: #3cff7a;
  font-family: "JetBrains Mono", monospace;
}

.avatar-sep {
  font-size: 10px;
  color: #6b9e6b;
}

/* ── Info rows ────────────────────────────────── */
.neofetch-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  font-size: 18px;
  font-family: "JetBrains Mono", monospace;
  animation: fade-up 0.25s ease-out both;
}

.info-key {
  color: #3cff7a;
  min-width: 80px;
  white-space: pre;
}

.info-sep {
  color: #6b9e6b;
}

.info-val {
  color: #c8dec4;
}

.val-green {
  color: #3cff7a;
}
.val-dim {
  color: #6b9e6b;
}

.val-blue {
  color: #0db7dd;
}
.cursor-line {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.cursor-blink-span {
  color: #3cff7a;
  animation: cursor-blink 1s step-end infinite;
  display: inline-block;
}

/* ── Logo ─────────────────────────────────────── */
.logo-overlay {
  position: absolute;
  bottom: 5px;
  left: 80px;
}

.imagen-logo {
  height: 28px;
  width: auto;
  opacity: 1;
}

/* ── Keyframes ────────────────────────────────── */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
