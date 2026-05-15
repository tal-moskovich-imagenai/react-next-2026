---
layout: about-me
helloMsg: Hello!
name: Tal Moskovich
imageSrc: ./images/tal.png
position: left
job: Committing Code & Pushing Personal Boundaries
line1: "🧑‍💻 Senior Frontend Engineer @ "
line2: "🎧 Podcaster @ Lo-Techi"
social1: lotechni.dev
social2: linkedin.com/in/tmosko
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const line1Element = document.querySelector('.line-1')
  if (line1Element) {
    line1Element.classList.add('relative', 'pt-6')
    const logoImg = document.createElement('img')
    logoImg.src = '/images/imagen-logo.svg'
    logoImg.className = 'w-20 h-auto absolute -bottom-7 left-86'
    line1Element.appendChild(logoImg)
  }
})
</script>

<style>
.about-me {
  background: #0D1117;
}
.about-me .w-1\/2:last-child {
  padding-top: 2rem !important;
  padding-bottom: 2rem !important;
}
.about-me h2 {
  margin-bottom: 0.5rem;
}
.about-me .aboutme-details {
  margin-top: 0.5rem !important;
}
</style>

<!--
Quick intro. 30 seconds max. Get to the demo.
-->
