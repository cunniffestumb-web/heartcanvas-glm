<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MenuIcon, PhoneIcon, ShieldCheckIcon, StethoscopeIcon } from '@lucide/vue'
import ChatWindow from '@/components/consultation/ChatWindow.vue'
import ChatInput from '@/components/consultation/ChatInput.vue'
import DoctorProfilePanel from '@/components/consultation/DoctorProfilePanel.vue'
import InsightPanel from '@/components/consultation/InsightPanel.vue'
import SessionSidebar from '@/components/consultation/SessionSidebar.vue'
import VoiceCallPanel from '@/components/consultation/VoiceCallPanel.vue'
import ModeBadge from '@/components/common/ModeBadge.vue'
import { getSystemVoices, onVoicesChanged } from '@/services/voiceService'
import { useConsultationStore } from '@/stores/consultation'
import type { DoctorProfile } from '@/types/consultation'

const route = useRoute()
const store = useConsultationStore()
const showProfiles = ref(false)
const showVoiceCall = ref(false)
const showSessions = ref(false)
const voices = ref<SpeechSynthesisVoice[]>(getSystemVoices())
let stopVoiceListener: () => void = () => undefined

const hasContext = computed(() => Object.values(store.context).some(Boolean))

onMounted(() => {
  const routeContext = {
    region: typeof route.query.region === 'string' ? route.query.region : undefined,
    population: typeof route.query.population === 'string' ? route.query.population : undefined,
    emotionType: typeof route.query.emotion === 'string' ? route.query.emotion : undefined,
  }
  if (Object.values(routeContext).some(Boolean)) store.setContext(routeContext)
  void store.initialize()
  stopVoiceListener = onVoicesChanged((next) => { voices.value = next })
})

onBeforeUnmount(() => stopVoiceListener())

function saveDoctor(profile: Omit<DoctorProfile, 'id' | 'custom'> & { id?: string }) {
  store.saveCustomDoctor(profile)
  showProfiles.value = false
}
</script>

<template>
  <section class="consultation-page">
    <div class="consultation-head">
      <div><p>智能心理支持</p><h1>在低压力的空间里，说说你正在经历什么</h1></div>
      <div class="head-status"><ModeBadge :mode="store.mode" /><span><ShieldCheckIcon :size="14" />非诊断性心理支持</span></div>
    </div>

    <div v-if="hasContext" class="context-strip">
      <span>当前关注背景</span>
      <strong>{{ store.context.region || '全国' }}</strong>
      <strong>{{ store.context.population || '未指定人群' }}</strong>
      <strong>{{ store.context.emotionType || '综合情绪' }}</strong>
    </div>

    <div class="consultation-workspace">
      <SessionSidebar
        :sessions="store.sessions"
        :active-id="store.activeSessionId"
        :mobile-open="showSessions"
        @new="store.startNewSession"
        @select="store.selectSession"
        @rename="store.renameSession"
        @delete="store.deleteSession"
        @close="showSessions = false"
      />

      <main class="chat-panel" data-consultation-panel>
        <div class="chat-toolbar">
          <button class="mobile-sessions" type="button" title="全部对话" aria-label="打开会话列表" @click="showSessions = true"><MenuIcon :size="18" /></button>
          <button class="doctor-control" type="button" @click="showProfiles = true">
            <span class="doctor-avatar">{{ store.selectedDoctor.name.slice(0, 1) }}</span>
            <span><strong>{{ store.selectedDoctor.name }}</strong><small>{{ store.selectedDoctor.title }}</small></span>
            <StethoscopeIcon :size="16" />
          </button>
          <button class="call-control" type="button" @click="showVoiceCall = true"><PhoneIcon :size="16" /><span>语音通话</span></button>
        </div>
        <ChatWindow :messages="store.messages" :sending="store.isSending" :crisis="store.hasCrisis" :doctor-name="store.selectedDoctor.name" />
        <ChatInput :sending="store.isSending" @send="store.sendMessage" @voice="showVoiceCall = true" />
      </main>

      <InsightPanel data-consultation-panel :insight="store.insight" />
    </div>

    <DoctorProfilePanel
      v-if="showProfiles"
      :profiles="store.doctorProfiles"
      :selected-id="store.selectedDoctor.id"
      :voices="voices"
      @select="store.setDoctor"
      @save="saveDoctor"
      @close="showProfiles = false"
    />
    <VoiceCallPanel
      v-if="showVoiceCall"
      :doctor="store.selectedDoctor"
      :messages="store.messages"
      :sending="store.isSending"
      :voices="voices"
      @send="store.sendMessage"
      @close="showVoiceCall = false"
    />
  </section>
</template>

<style scoped>
.consultation-page { min-height: calc(100vh - 68px); padding: 28px 24px 36px; }.consultation-head { width: min(100%, var(--content)); display: flex; align-items: end; justify-content: space-between; gap: 28px; margin: 0 auto 18px; }.consultation-head p { margin: 0 0 6px; color: var(--teal); font-size: 10px; font-weight: 700; }.consultation-head h1 { max-width: 720px; margin: 0; font-size: 30px; line-height: 1.35; }.head-status { display: flex; align-items: center; gap: 10px; }.head-status > span { display: flex; align-items: center; gap: 5px; color: var(--ink-soft); font-size: 9px; }
.context-strip { width: min(100%, var(--content)); display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0 auto 10px; padding: 9px 12px; border-left: 3px solid var(--teal); background: var(--teal-soft); font-size: 10px; }.context-strip span { color: var(--ink-soft); }.context-strip strong { padding: 3px 6px; border-radius: 3px; background: rgb(255 255 255 / 60%); }
.consultation-workspace { width: min(100%, var(--content)); height: min(750px, calc(100vh - 190px)); min-height: 590px; display: grid; grid-template-columns: 230px minmax(0, 1fr) 255px; margin: 0 auto; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-md); }.chat-panel { min-width: 0; min-height: 0; display: grid; grid-template-rows: auto 1fr auto; }.chat-toolbar { min-height: 56px; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid var(--line); background: var(--surface); }
.doctor-control { min-width: 0; display: flex; align-items: center; gap: 9px; padding: 4px 7px 4px 4px; border: 0; border-radius: 6px; color: var(--ink); background: transparent; cursor: pointer; }.doctor-control:hover { background: var(--surface-muted); }.doctor-avatar { width: 34px; height: 34px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 50%; color: white; background: var(--teal); font-size: 12px; font-weight: 700; }.doctor-control > span:nth-child(2) { min-width: 0; display: grid; gap: 2px; text-align: left; }.doctor-control strong { font-size: 11px; }.doctor-control small { color: var(--ink-soft); font-size: 8px; }.doctor-control > svg { color: var(--teal); }
.call-control { min-height: 36px; display: flex; align-items: center; gap: 6px; margin-left: auto; padding: 0 11px; border: 1px solid var(--teal); border-radius: 6px; color: var(--teal-dark); background: var(--teal-soft); cursor: pointer; font-size: 10px; font-weight: 700; }.mobile-sessions { display: none; width: 36px; height: 36px; place-items: center; padding: 0; border: 1px solid var(--line); border-radius: 6px; color: var(--ink-soft); background: var(--surface); cursor: pointer; }
@media (max-width: 1000px) { .consultation-workspace { height: auto; grid-template-columns: 1fr; }.chat-panel { min-height: 610px; }.consultation-head { align-items: start; flex-direction: column; }.head-status { width: 100%; justify-content: space-between; }.mobile-sessions { display: grid; } }
@media (max-width: 600px) { .consultation-page { padding: 24px 12px 30px; }.consultation-head h1 { font-size: 24px; }.consultation-workspace { min-height: 0; }.chat-panel { min-height: 590px; }.call-control span { display: none; }.doctor-control { flex: 1; }.doctor-control > svg { margin-left: auto; } }
</style>
