<script setup lang="ts">
import { ArrowRightIcon, BookOpenIcon, Building2Icon, ShieldCheckIcon, UserRoundIcon } from '@lucide/vue'
import type { MentalHealthCase } from '@/types/case'

defineProps<{ item: MentalHealthCase }>()
</script>

<template>
  <article class="case-card" data-case-card>
    <div class="card-meta">
      <span>{{ item.category }}</span>
      <span class="nature">{{ item.caseNature }}</span>
    </div>
    <h2>{{ item.title }}</h2>
    <p class="summary">{{ item.summary }}</p>
    <dl>
      <div><UserRoundIcon :size="15" aria-hidden="true" /><dt>人物</dt><dd>{{ item.alias }} · {{ item.ageRange }}</dd></div>
      <div><Building2Icon :size="15" aria-hidden="true" /><dt>来源</dt><dd>{{ item.sourceOrganization }}</dd></div>
      <div><ShieldCheckIcon :size="15" aria-hidden="true" /><dt>核验</dt><dd>来源可靠性 {{ item.sourceReliability }} · {{ item.verificationStatus }}</dd></div>
    </dl>
    <footer>
      <span><BookOpenIcon :size="15" aria-hidden="true" />{{ item.readingTime }} 分钟阅读</span>
      <RouterLink :to="`/cases/${item.slug}`">
        查看详情 <ArrowRightIcon :size="16" aria-hidden="true" />
      </RouterLink>
    </footer>
  </article>
</template>

<style scoped>
.case-card { min-height: 360px; display: flex; flex-direction: column; padding: 24px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-sm); transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease; }
.case-card:hover { transform: translateY(-3px); border-color: rgb(21 122 115 / 45%); box-shadow: var(--shadow-md); }
.card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 18px; color: var(--teal-dark); font-size: 11px; font-weight: 700; }
.card-meta span { padding: 5px 8px; border-radius: 4px; background: var(--teal-soft); }
.card-meta .nature { color: #755319; background: var(--gold-soft); }
h2 { margin: 0; font-size: 19px; line-height: 1.55; }
.summary { margin: 13px 0 20px; color: var(--ink-soft); font-size: 13px; line-height: 1.8; }
dl { display: grid; gap: 10px; margin: auto 0 22px; }
dl div { display: grid; grid-template-columns: 18px auto 1fr; align-items: start; gap: 5px; color: var(--ink-soft); font-size: 11px; line-height: 1.6; }
dl svg { margin-top: 1px; color: var(--teal); }
dt { color: var(--ink); font-weight: 700; }
dd { min-width: 0; margin: 0; overflow-wrap: anywhere; }
footer { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding-top: 17px; border-top: 1px solid var(--line); }
footer span, footer a { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; }
footer span { color: var(--ink-soft); }
footer a { color: var(--teal-dark); font-weight: 700; }
footer a:hover { color: var(--coral); }
@media (max-width: 520px) { .case-card { min-height: 0; } footer { align-items: flex-start; flex-direction: column; } }
</style>
