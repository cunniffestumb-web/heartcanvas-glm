<script setup lang="ts">
import { ActivityIcon, CircleGaugeIcon, LightbulbIcon, TagsIcon } from '@lucide/vue'
import type { ChatInsight } from '@shared/chat'
defineProps<{ insight: ChatInsight }>()

const actions = ['做 3 次缓慢呼吸', '写下最困扰的一件事', '联系一位可信赖的人', '必要时预约专业咨询']
</script>

<template>
  <aside class="insight-panel">
    <div class="insight-title"><ActivityIcon :size="18" /><div><strong>实时分析</strong><span>非医学诊断</span></div></div>
    <section><p><CircleGaugeIcon :size="14" /> 当前情绪</p><strong>{{ insight.emotion }}</strong></section>
    <section><p><ActivityIcon :size="14" /> 风险等级</p><strong class="risk" :data-level="insight.riskLevel">{{ insight.riskLevel }}</strong></section>
    <section><p><TagsIcon :size="14" /> 关键词</p><div class="keywords"><span v-for="word in insight.keywords" :key="word">{{ word }}</span></div></section>
    <section><p><LightbulbIcon :size="14" /> 推荐行动</p><ol><li v-for="action in actions" :key="action">{{ action }}</li></ol></section>
  </aside>
</template>

<style scoped>
.insight-panel { height: 100%; padding: 18px; border-left: 1px solid var(--line); background: var(--surface); }
.insight-title { display: flex; align-items: center; gap: 9px; padding-bottom: 16px; border-bottom: 1px solid var(--line); color: var(--teal); }.insight-title div { display: grid; gap: 2px; }.insight-title strong { color: var(--ink); font-size: 13px; }.insight-title span { color: var(--ink-soft); font-size: 9px; }
section { padding: 16px 0; border-bottom: 1px solid var(--line); }section > p { display: flex; align-items: center; gap: 6px; margin: 0 0 9px; color: var(--ink-soft); font-size: 10px; }section > strong { font-size: 19px; }
.risk { display: inline-flex; padding: 5px 9px; border-radius: 5px; color: var(--teal-dark); background: var(--teal-soft); font-size: 12px; }.risk[data-level="中"] { color: #7c5918; background: var(--gold-soft); }.risk[data-level="高"] { color: var(--danger); background: var(--danger-soft); }
.keywords { display: flex; flex-wrap: wrap; gap: 6px; }.keywords span { padding: 5px 7px; border-radius: 4px; color: var(--teal-dark); background: var(--teal-soft); font-size: 9px; }
ol { display: grid; gap: 9px; margin: 0; padding-left: 18px; color: var(--ink-soft); font-size: 10px; line-height: 1.5; }
@media (max-width: 1000px) { .insight-panel { border-left: 0; border-top: 1px solid var(--line); } }
</style>
