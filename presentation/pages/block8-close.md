---
layout: center
---

<div class="thesis-root">
  <div class="thesis-dim">React is an abstraction for describing UI as</div>
  <v-click>
    <div class="thesis-main">a function of state.</div>
  </v-click>
  <v-click>
    <div class="thesis-gap" />
    <div class="thesis-dim">The DOM was always just one possible target.</div>
  </v-click>
  <v-click>
    <div class="thesis-gap" />
    <div class="thesis-bright">If you know React,</div>
    <div class="thesis-bright">you already know how to build a terminal app.</div>
  </v-click>
  <v-click>
    <div class="thesis-gap" />
    <div class="thesis-cta">The next tool you build could be one too.</div>
  </v-click>
</div>

<style scoped>
.thesis-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  gap: 0;
}

.thesis-dim {
  font-size: 17px;
  color: #6B9E6B;
  line-height: 1.6;
  animation: type-in 0.3s ease-out both;
}

.thesis-main {
  font-size: 30px;
  font-weight: 700;
  color: #3CFF7A;
  line-height: 1.4;
  animation: type-in 0.35s ease-out both;
}

.thesis-bright {
  font-size: 24px;
  font-weight: 600;
  color: #C8DEC4;
  line-height: 1.5;
  animation: type-in 0.3s ease-out both;
}

.thesis-cta {
  font-size: 18px;
  color: #3CFF7A;
  font-weight: 500;
  margin-top: 4px;
  animation: type-in 0.3s ease-out both;
}

.thesis-gap {
  height: 20px;
}

@keyframes type-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<!--
Each line appears step by step. Let it breathe.
The final line is the call to action.
-->

---
layout: center
---

<script setup>
import HairSlideshow from "../components/HairSlideshow.vue";
</script>

<div class="ty-root">

  <div class="ty-heading">Thank You</div>

  <div class="ty-identity">
    <div class="ty-avatar-box">
      <div class="ty-avatar-inner">
        <HairSlideshow />
      </div>
    </div>
    <div class="ty-info">
      <div class="ty-name">Tal Moskovich</div>
      <div class="ty-role">Senior Fullstack Engineer @ ImagenAI</div>
    </div>
  </div>

  <div class="ty-links">
    <div class="ty-link-item">
      <QrCode url="https://rn26.tmosko.com/" />
      <div class="ty-link-url">rn26.tmosko.com</div>
      <div class="ty-link-desc">slides · repo · contact</div>
    </div>
  </div>

</div>

<style scoped>
.ty-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  font-family: 'JetBrains Mono', monospace;
}

.ty-heading {
  font-size: 52px;
  font-weight: 700;
  color: #3CFF7A;
  letter-spacing: -1px;
}

.ty-identity {
  display: flex;
  align-items: center;
  gap: 24px;
}

.ty-avatar-box {
  width: 110px;
  height: 110px;
  border: 2px solid #3CFF7A;
  overflow: hidden;
  flex-shrink: 0;
  background: #090B09;
}

.ty-avatar-inner {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.ty-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ty-name {
  font-size: 26px;
  font-weight: 700;
  color: #C8DEC4;
}

.ty-role {
  font-size: 14px;
  color: #6B9E6B;
}

.ty-links {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 4px;
}

.ty-link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.ty-link-item :deep(.qr-wrap) {
  width: 120px;
  height: 120px;
  padding: 8px;
  border: 1px solid #1E3320;
  background: #090B09;
}

.ty-link-url {
  font-size: 11px;
  color: #3CFF7A;
}

.ty-link-desc {
  font-size: 10px;
  color: #6B9E6B;
  text-transform: uppercase;
  letter-spacing: 1px;
}

</style>

<!--
Thank you slide. Keep it brief — photo, name, two QR codes.
-->
