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

<div class="close-layout">

  <!-- Left: QR code -->
  <div class="qr-side">
    <QrCode url="https://rn26.tmosko.com/" />
    <div class="qr-label">rn26.tmosko.com</div>
  </div>

  <!-- Right: terminal links -->
  <TerminalFrame title="rn26.tmosko.com" class="close-frame">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 2; padding: 8px 4px">
      <div style="color: #C8DEC4">Live presentation</div>
      <div style="margin-top: 8px">
        <span style="color: #3CFF7A; font-size: 15px; font-weight: bold">
          <a href="https://rn26.tmosko.com" target="_blank">rn26.tmosko.com</a>
        </span>
      </div>
    </div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 2; padding: 8px 4px">
      <div style="color: #C8DEC4">Everything built today is in this repo. Fork it.</div>
      <div style="margin-top: 8px">
        <span style="color: #3CFF7A; font-size: 15px; font-weight: bold">
          <a href="https://github.com/tal-moskovich-imagenai/react-next-2026" target="_blank">github.com/tal-moskovich-imagenai/react-next-2026</a>
        </span>
      </div>
      <div style="margin-top: 12px">
        <span style="color: #3CFF7A">❯ </span>
        <span style="color: #C8DEC4">Add your API key. Run </span>
        <span style="color: #3CFF7A">npm run dev</span>
        <span style="color: #C8DEC4">. Done.</span>
        <span class="final-cursor">█</span>
      </div>
    </div>
  </TerminalFrame>

</div>

<style scoped>
.close-layout {
  display: flex;
  align-items: center;
  gap: 48px;
}

.qr-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.qr-side :deep(.qr-wrap) {
  width: 160px;
  height: 160px;
  padding: 10px;
  border: 1px solid #1E3320;
  border-radius: 6px;
  background: #090B09;
}

.qr-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #3CFF7A;
}

.close-frame {
  flex: 1;
}

.final-cursor {
  color: #3CFF7A;
  animation: cursor-blink 1s step-end infinite;
  display: inline-block;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
</style>

<!--
"The tests pass. It runs out of the box. Add your API key and you have a working AI CLI in two minutes. Fork it."
Then close the laptop.
-->
