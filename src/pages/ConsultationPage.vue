<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MessageCirclePlusIcon, MessagesSquareIcon, ShieldCheckIcon } from '@lucide/vue'
import ChatWindow from '@/components/consultation/ChatWindow.vue'
import ChatInput from '@/components/consultation/ChatInput.vue'
import InsightPanel from '@/components/consultation/InsightPanel.vue'
import ModeBadge from '@/components/common/ModeBadge.vue'
import { useConsultationStore } from '@/stores/consultation'

const route = useRoute()
const store = useConsultationStore()
const hasContext = computed(() => Object.values(store.context).some(Boolean))

onMounted(() => {
  store.setContext({
    region: typeof route.query.region === 'string' ? route.query.region : undefined,
    population: typeof route.query.population === 'string' ? route.query.population : undefined,
    emotionType: typeof route.query.emotion === 'string' ? route.query.emotion : undefined,
  })
  store.initialize()
})

const sessions = [
  { title: '新的支持对话', time: '现在', active: true },
  { title: '睡眠与工作压力', time: '昨日', active: false },
  { title: '考试前的焦虑', time: '7 月 28 日', active: false },
]
</script>

<template>
  <section class="consultation-page">
    <div class="consultation-head">
      <div><p>智能诊疗室</p><h1>在低压力的空间里，说说你正在经历什么</h1></div>
      <div class="head-status"><ModeBadge :mode="store.mode" /><span><ShieldCheckIcon :size="14" />非诊断性心理支持</span></div>
    </div>

    <div v-if="hasContext" class="context-strip">
      <span>已带入数据背景</span>
      <strong>{{ store.context.region || '全国' }}</strong>
      <strong>{{ store.context.population || '未指定人群' }}</strong>
      <strong>{{ store.context.emotionType || '综合情绪' }}</strong>
    </div>

    <div class="consultation-workspace">
      <aside class="session-panel" data-consultation-panel>
        <button class="new-session" type="button" @click="store.startNewSession"><MessageCirclePlusIcon :size="16" />新建对话</button>
        <p class="panel-label"><MessagesSquareIcon :size="13" />咨询主题</p>
        <button v-for="session in sessions" :key="session.title" class="session-item" :class="{ active: session.active }" type="button"><span>{{ session.title }}</span><small>{{ session.time }}</small></button>
        <p class="privacy-note">会话仅用于本地演示，不构成医疗记录。</p>
      </aside>

      <main class="chat-panel" data-consultation-panel>
        <ChatWindow :messages="store.messages" :sending="store.isSending" :crisis="store.hasCrisis" />
        <ChatInput :sending="store.isSending" @send="store.sendMessage" />
      </main>

      <InsightPanel data-consultation-panel :insight="store.insight" />
    </div>
  </section>
</template>

<style scoped>
.consultation-page { min-height: calc(100vh - 68px); padding: 28px 24px 36px; }
.consultation-head { width: min(100%, var(--content)); display: flex; align-items: end; justify-content: space-between; gap: 28px; margin: 0 auto 18px; }
.consultation-head p { margin: 0 0 6px; color: var(--teal); font-size: 10px; font-weight: 700; }.consultation-head h1 { max-width: 720px; margin: 0; font-size: 30px; line-height: 1.35; }
.head-status { display: flex; align-items: center; gap: 10px; }.head-status > span { display: flex; align-items: center; gap: 5px; color: var(--ink-soft); font-size: 9px; }
.context-strip { width: min(100%, var(--content)); display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0 auto 10px; padding: 9px 12px; border-left: 3px solid var(--teal); background: var(--teal-soft); font-size: 10px; }.context-strip span { color: var(--ink-soft); }.context-strip strong { padding: 3px 6px; border-radius: 3px; background: rgb(255 255 255 / 60%); }
.consultation-workspace { width: min(100%, var(--content)); height: min(720px, calc(100vh - 190px)); min-height: 570px; display: grid; grid-template-columns: 215px minmax(0, 1fr) 255px; margin: 0 auto; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-md); }
.session-panel { padding: 14px; border-right: 1px solid var(--line); background: #f0f0eb; }.new-session { width: 100%; min-height: 40px; display: flex; align-items: center; justify-content: center; gap: 7px; border: 0; border-radius: 6px; color: white; background: var(--teal); cursor: pointer; }.panel-label { display: flex; align-items: center; gap: 5px; margin: 22px 7px 8px; color: var(--ink-soft); font-size: 9px; }
.session-item { width: 100%; display: grid; gap: 4px; padding: 10px; border: 0; border-radius: 5px; text-align: left; color: var(--ink-soft); background: transparent; cursor: pointer; }.session-item.active { color: var(--teal-dark); background: var(--surface); box-shadow: var(--shadow-sm); }.session-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }.session-item small { font-size: 8px; opacity: .75; }
.privacy-note { margin: 28px 7px 0; color: var(--ink-soft); font-size: 8px; line-height: 1.6; }.chat-panel { min-width: 0; min-height: 0; display: grid; grid-template-rows: 1fr auto; }
@media (max-width: 1000px) { .consultation-workspace { height: auto; grid-template-columns: 1fr; }.session-panel { display: none; }.chat-panel { min-height: 610px; }.consultation-head { align-items: start; flex-direction: column; }.head-status { width: 100%; justify-content: space-between; } }
@media (max-width: 600px) { .consultation-page { padding: 24px 12px 30px; }.consultation-head h1 { font-size: 24px; }.consultation-workspace { min-height: 0; }.chat-panel { min-height: 560px; } }
</style>
