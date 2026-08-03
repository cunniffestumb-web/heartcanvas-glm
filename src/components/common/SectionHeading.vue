<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; description?: string }>()
</script>

<template>
  <header class="section-heading">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="description" class="section-description">{{ description }}</p>
  </header>
</template>

<style scoped>
.section-heading { max-width: 720px; margin-bottom: 28px; }
.eyebrow { margin: 0 0 8px; color: var(--teal); font-size: 12px; font-weight: 700; letter-spacing: 0; }
h2 { margin: 0; font-size: clamp(26px, 4vw, 38px); line-height: 1.2; letter-spacing: 0; }
.section-description { margin: 12px 0 0; color: var(--ink-soft); font-size: 15px; line-height: 1.75; }
</style>
