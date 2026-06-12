<template>
  <div class="profile">
    <div class="avatar-box">
      <HairSlideshow />
    </div>
    <div class="profile-info">
      <div class="profile-name">Tal Moskovich</div>
      <div class="profile-title">
        Senior Fullstack Engineer
        <span class="profile-at"> @ </span>ImagenAI
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HairSlideshow from "./HairSlideshow.vue";
</script>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #1E3320;
  border-radius: 6px;
  background: #0C0F0C;
  animation: fade-up 0.5s ease-out both;
}

.avatar-box {
  width: 52px;
  height: 52px;
  border: 1.5px solid #3CFF7A;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}


.profile-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.profile-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #3CFF7A;
}

.profile-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #6B9E6B;
}

.profile-at {
  color: #3D5940;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
