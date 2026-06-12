<template>
  <div class="hair-slideshow">
    <img
      v-for="(src, i) in images"
      :key="src"
      :src="src"
      alt="Tal Moskovich"
      class="hair-slide"
      :class="{ active: i === current, prev: i === prev }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const images = [
  "/images/hair/red.webp",
  "/images/hair/orange.webp",
  "/images/hair/peach.webp",
  "/images/hair/pink.webp",
  "/images/hair/plum.webp",
  "/images/hair/purple.webp",
  "/images/hair/blue.webp",
  "/images/hair/cyan.webp",
  "/images/hair/green.webp",
  "/images/hair/rainbow.webp",
];

const current = ref(0);
const prev = ref<number | null>(null);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    prev.value = current.value;
    current.value = (current.value + 1) % images.length;
  }, 500);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.hair-slideshow {
  position: relative;
  width: 100%;
  height: 100%;
}

.hair-slide {
  position: absolute;
  inset: 0;
  width: 200%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  opacity: 0;
}

.hair-slide.active {
  opacity: 1;
  z-index: 2;
}

.hair-slide.prev {
  opacity: 0;
  z-index: 1;
}
</style>
