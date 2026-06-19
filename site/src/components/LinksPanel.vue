<template>
  <div class="links-root">
    <div class="links-header">
      <span class="prompt">❯</span>
      <span class="header-text">links</span>
      <span class="cursor-blink">█</span>
    </div>

    <div class="links-grid">
      <a
        v-for="link in links"
        :key="link.id"
        :href="link.href"
        :target="link.href !== '#' ? '_blank' : undefined"
        :rel="link.href !== '#' ? 'noopener noreferrer' : undefined"
        class="link-btn"
        :class="{ disabled: link.href === '#' }"
      >
        <span class="link-icon">{{ link.icon }}</span>
        <div class="link-body">
          <div class="link-title">{{ link.title }}</div>
          <div class="link-url">{{ link.url }}</div>
        </div>
        <span class="link-arrow">{{ link.href === "#" ? "·" : "→" }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    id: "linkedin",
    icon: "in",
    title: "LinkedIn",
    url: "linkedin.com/in/tmosko",
    href: "https://www.linkedin.com/in/tmosko/",
  },
  {
    id: "podcast",
    icon: "🎧",
    title: "Lo-Techi Podcast",
    url: "lotechni.dev",
    href: "https://lotechni.dev",
  },
  {
    id: "slides",
    icon: "⚛",
    title: "Presentation Slides",
    url: "/slides",
    href: "/slides",
  },
  {
    id: "github",
    icon: "⭐",
    title: "GitHub Repo",
    url: "github.com/tal-moskovich-imagenai/react-next-2026",
    href: "https://github.com/tal-moskovich-imagenai/react-next-2026",
  },
];
</script>

<style scoped>
.links-root {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: panel-in 0.6s ease-out both;
}

.links-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #6b9e6b;
  padding: 0 2px;
}
.prompt {
  color: #3cff7a;
}
.header-text {
  color: #6b9e6b;
}
.cursor-blink {
  color: #3cff7a;
  animation: cursor-blink 1s step-end infinite;
  display: inline-block;
  font-size: 10px;
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #1e3320;
  border-radius: 6px;
  background: #0c0f0c;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}
.link-btn:hover:not(.disabled) {
  border-color: #3cff7a;
  background: #0c150c;
  box-shadow: 0 0 14px rgba(60, 255, 122, 0.08);
}
.link-btn.disabled {
  opacity: 0.4;
  cursor: default;
}

.link-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  font-style: normal;
  font-family: "JetBrains Mono", monospace;
  color: #3cff7a;
  font-size: 13px;
  font-weight: 700;
}

.link-body {
  flex: 1;
  min-width: 0;
}
.link-title {
  font-size: 12px;
  font-weight: 700;
  color: #c8dec4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.link-url {
  font-size: 10px;
  color: #6b9e6b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-arrow {
  font-size: 14px;
  color: #3d5940;
  flex-shrink: 0;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}
.link-btn:hover:not(.disabled) .link-arrow {
  color: #3cff7a;
  transform: translateX(3px);
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(12px);
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
