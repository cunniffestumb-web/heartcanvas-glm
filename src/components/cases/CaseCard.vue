<script setup lang="ts">
import { ArrowRightIcon, BookOpenIcon } from '@lucide/vue'
import type { MentalHealthCase } from '@/types/case'
withDefaults(defineProps<{ item: MentalHealthCase; basePath?: '/cases' | '/app/library' }>(), {
  basePath: '/cases',
})
</script>
<template>
  <article class="case-card" data-case-card>
    <div class="card-meta">
      <span>{{ item.category }}</span
      ><small>{{ item.caseNature }}</small>
    </div>
    <h2>
      <RouterLink :to="`${basePath}/${item.slug}`">{{ item.title }}</RouterLink>
    </h2>
    <p class="summary">{{ item.summary }}</p>
    <div class="source">
      <span>{{ item.sourceOrganization }}</span
      ><small>来源可靠性 {{ item.sourceReliability }} · {{ item.verificationStatus }}</small>
    </div>
    <footer>
      <span><BookOpenIcon :size="16" />{{ item.readingTime }} 分钟阅读</span
      ><RouterLink :to="`${basePath}/${item.slug}`">阅读案例 <ArrowRightIcon :size="17" /></RouterLink>
    </footer>
  </article>
</template>
<style scoped>
.case-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 25px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  transition:
    border-color 160ms,
    transform 160ms;
}
.case-card:hover {
  border-color: #aac6b6;
  transform: translateY(-2px);
}
.card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.card-meta span {
  padding: 5px 9px;
  border-radius: 7px;
  color: var(--teal);
  background: var(--teal-soft);
  font-size: 12px;
}
.card-meta small {
  color: var(--ink-soft);
  font-size: 12px;
}
h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.65;
}
h2 a:hover {
  color: var(--teal);
}
.summary {
  margin: 14px 0 24px;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.9;
}
.source {
  display: grid;
  gap: 7px;
  margin-top: auto;
  padding-bottom: 18px;
  overflow-wrap: anywhere;
}
.source > span {
  font-size: 12px;
}
.source small {
  font-size: 12px;
  color: var(--ink-soft);
}
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid var(--line);
  padding-top: 14px;
}
footer span,
footer a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  font-size: 12px;
}
footer span {
  color: var(--ink-soft);
}
footer a {
  color: var(--teal);
  font-weight: 700;
}
@media (max-width: 600px) {
  .case-card {
    padding: 20px;
  }
  h2 {
    font-size: 19px;
  }
}
</style>
