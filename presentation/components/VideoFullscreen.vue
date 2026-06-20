<template>
  <video
    ref="vid"
    :src="src"
    loop
    playsinline
    muted
    style="
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: #000;
    "
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useIsSlideActive } from "@slidev/client";

defineProps<{ src: string }>();
const vid = ref<HTMLVideoElement>();
const active = useIsSlideActive();

watch(
  active,
  (isActive) => {
    if (isActive) {
      vid.value?.play().catch(() => {});
    } else {
      vid.value?.pause();
      if (vid.value) vid.value.currentTime = 0;
    }
  },
  { immediate: true },
);
</script>
