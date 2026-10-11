<script setup lang="ts">
import { ActivityIcon, LightbulbIcon, TagsIcon } from '@lucide/vue'
import type { ChatInsight } from '@shared/chat'
withDefaults(defineProps<{ insight: ChatInsight; hasInput?: boolean }>(), { hasInput: true })
const actions = [
  '给自己留一个短暂的停顿',
  '写下此刻最想表达的一件事',
  '需要时联系可信赖的人或专业人员',
]
</script>
<template>
  <aside class="insight-panel">
    <p class="intro">这些线索帮助你整理感受，不能代替专业评估。</p>
    <div v-if="!hasInput" class="waiting">
      <ActivityIcon :size="32" />
      <h3>等待了解</h3>
      <p>开始对话后，这里会整理当前的情绪和关键词。</p>
    </div>
    <template v-else
      ><section>
        <p><ActivityIcon :size="16" />当前情绪</p>
        <h3>{{ insight.emotion }}</h3>
      </section>
      <section>
        <p>关注程度</p>
        <span class="risk" :data-level="insight.riskLevel">{{
          insight.riskLevel === '高'
            ? '请优先确认安全'
            : insight.riskLevel === '中'
              ? '值得多一些关注'
              : '继续了解你的感受'
        }}</span>
      </section>
      <section>
        <p><TagsIcon :size="16" />关键词</p>
        <div class="keywords">
          <span v-for="word in insight.keywords" :key="word">{{ word }}</span>
        </div>
      </section>
      <section>
        <p><LightbulbIcon :size="16" />可以考虑的下一步</p>
        <ol>
          <li v-for="action in actions" :key="action">{{ action }}</li>
        </ol>
      </section></template
    >
  </aside>
</template>
<style scoped>
.intro {
  margin: 0 0 22px;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.8;
}
section {
  padding: 20px 0;
  border-top: 1px solid var(--line);
}
section > p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: var(--ink-soft);
  font-size: 12px;
}
h3 {
  margin: 0;
  font-size: 23px;
}
.risk {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--teal-dark);
  background: var(--teal-soft);
  font-size: 14px;
}
.risk[data-level='中'] {
  color: #7a5d26;
  background: var(--gold-soft);
}
.risk[data-level='高'] {
  color: var(--danger);
  background: var(--danger-soft);
}
.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.keywords span {
  padding: 6px 10px;
  border-radius: 7px;
  background: var(--surface-muted);
  font-size: 14px;
}
ol {
  display: grid;
  gap: 12px;
  margin: 0;
  padding-left: 20px;
  color: var(--ink-soft);
  font-size: 14px;
}
.waiting {
  padding: 32px 0;
  text-align: center;
  color: var(--ink-soft);
}
.waiting svg {
  margin-bottom: 16px;
  color: var(--teal);
}
.waiting p {
  font-size: 14px;
}
</style>
