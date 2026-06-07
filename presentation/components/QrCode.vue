<script setup lang="ts">
import { renderSVG } from 'uqr'

const props = defineProps<{ url: string }>()

const raw = renderSVG(props.url, { pixelSize: 4 })
const svg = raw
  .replace(/fill="white"/, 'fill="transparent"')
  .replace(/fill="black"/, 'fill="#3CFF7A"')
</script>

<template>
  <div class="qr-wrap" v-html="svg" />
</template>

<style scoped>
.qr-wrap :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
