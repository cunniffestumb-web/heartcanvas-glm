<script setup lang="ts">
defineProps<{
  value: string
  label: string
  note?: string
  tone?: 'teal' | 'coral' | 'gold' | 'blue'
}>()
</script>

<template>
  <article class="stat-card" :data-tone="tone || 'teal'">
    <div class="stat-icon"><slot name="icon" /></div>
    <div>
      <strong>{{ value }}</strong>
      <p>{{ label }}</p>
      <small v-if="note">{{ note }}</small>
    </div>
  </article>
</template>

<style scoped>
.stat-card {
  min-height: 126px;
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: start;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}
.stat-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  color: var(--teal);
  background: var(--teal-soft);
}
.stat-card[data-tone='coral'] .stat-icon {
  color: var(--coral);
  background: var(--coral-soft);
}
.stat-card[data-tone='gold'] .stat-icon {
  color: var(--gold);
  background: var(--gold-soft);
}
.stat-card[data-tone='blue'] .stat-icon {
  color: var(--blue);
  background: #e2ebf3;
}
strong {
  display: block;
  margin-bottom: 4px;
  font-size: 27px;
  line-height: 1;
}
p {
  margin: 0;
  color: var(--ink);
  font-size: 13px;
}
small {
  display: block;
  margin-top: 7px;
  color: var(--ink-soft);
  font-size: 12px;
}
</style>
