<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; description?: string }>()
</script>
<template>
  <div class="section-heading">
    <p v-if="eyebrow" class="section-kicker">{{ eyebrow }}</p>
    <h1>{{ title }}</h1>
    <p v-if="description" class="description">{{ description }}</p>
  </div>
</template>
<style scoped>
.section-heading {
  max-width: 800px;
  margin-bottom: 32px;
}
h1 {
  margin: 0;
  font-size: clamp(28px, 3.2vw, 40px);
  line-height: 1.35;
  letter-spacing: -0.025em;
}
.description {
  margin: 14px 0 0;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.85;
}
@media (max-width: 600px) {
  .section-heading {
    margin-bottom: 24px;
  }
}
</style>
