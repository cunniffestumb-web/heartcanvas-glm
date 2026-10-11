<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ActivityIcon, HistoryIcon, MenuIcon, MessageCirclePlusIcon, ShieldCheckIcon } from '@lucide/vue'
import ChatWindow from '@/components/consultation/ChatWindow.vue'
import ChatInput from '@/components/consultation/ChatInput.vue'
import DoctorProfilePanel from '@/components/consultation/DoctorProfilePanel.vue'
import InsightPanel from '@/components/consultation/InsightPanel.vue'
import SessionSidebar from '@/components/consultation/SessionSidebar.vue'
import SessionList from '@/components/consultation/SessionList.vue'
import VoiceCallPanel from '@/components/consultation/VoiceCallPanel.vue'
import ModeBadge from '@/components/common/ModeBadge.vue'
import OverlayPanel from '@/components/common/OverlayPanel.vue'
import { useVisualViewport } from '@/composables/useVisualViewport'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { getSupportTopic } from '@/data/supportTopics'
import { cases } from '@/data/cases'
import { getSystemVoices, onVoicesChanged } from '@/services/voiceService'
import { useConsultationStore } from '@/stores/consultation'
import type { DoctorProfile } from '@/types/consultation'
import type { ChatContext } from '@shared/chat'
const route = useRoute()
const router = useRouter()
const store = useConsultationStore()
const showProfiles = ref(false)
const showVoiceCall = ref(false)
const showSessions = ref(false)
const showInsights = ref(false)
const voices = ref<SpeechSynthesisVoice[]>(getSystemVoices())
const composerArea = ref<HTMLElement>()
const viewportHeight = useVisualViewport()
const isApplication = computed(() => route.meta.application === true)
const wideWorkspace = useMediaQuery('(min-width: 1600px)')
let stopVoiceListener: () => void = () => undefined
const hasContext = computed(() => Object.values(store.context).some(Boolean))
async function consumeEntry() {
  const query = { ...route.query }
  if (query.panel === 'voice') showVoiceCall.value = true
  if (query.panel === 'styles') showProfiles.value = true
  const routeContext: ChatContext = {}
  for (const [parameter, field] of [
    ['region', 'region'],
    ['population', 'population'],
    ['emotion', 'emotionType'],
  ] as const) {
    const value = query[parameter]
    if (typeof value === 'string') routeContext[field] = value.slice(0, 60)
  }
  const topic = getSupportTopic(query.topic)
  const item =
    typeof query.case === 'string'
      ? cases.find((item) => item.slug === query.case || item.id === query.case)
      : undefined
  if (item || topic) {
    store.startNewSession({
      ...routeContext,
      emotionType: routeContext.emotionType || item?.category || topic?.emotion,
    })
    store.setDraft(item ? `我读了“${item.title}”，想聊聊我自己的类似困扰。` : topic!.draft)
  } else if (Object.keys(routeContext).length) {
    store.setContext({ ...store.context, ...routeContext })
  }
  if ('topic' in query || 'case' in query || 'panel' in query) {
    delete query.topic
    delete query.case
    delete query.panel
    await router.replace({ path: route.path, query, hash: route.hash })
  }
}
watch(
  () => route.fullPath,
  () => {
    void consumeEntry()
  },
  { immediate: true },
)
onMounted(() => {
  void store.initialize()
  stopVoiceListener = onVoicesChanged((next) => {
    voices.value = next
  })
})
onBeforeUnmount(() => stopVoiceListener())
function saveDoctor(profile: Omit<DoctorProfile, 'id' | 'custom'> & { id?: string }) {
  store.saveCustomDoctor(profile)
  showProfiles.value = false
}
function chooseDoctor(id: string) {
  store.setDoctor(id)
  showProfiles.value = false
}
async function chooseTopic(id: string) {
  const topic = getSupportTopic(id)
  if (topic) {
    store.setDraft(topic.draft)
    store.setContext({ ...store.context, emotionType: topic.emotion })
    if (isApplication.value) {
      await nextTick()
      composerArea.value?.querySelector('textarea')?.focus({ preventScroll: true })
    }
  }
}
function selectSession(id: string) {
  store.selectSession(id)
  showSessions.value = false
}
function newSession() {
  store.startNewSession()
  showSessions.value = false
}
</script>
<template>
  <section
    class="consultation-page"
    :class="{ 'application-chat': isApplication, 'is-compact': viewportHeight < 520 }"
    :style="{ '--visual-height': `${viewportHeight}px` }"
  >
    <header v-if="!isApplication" class="consultation-head">
      <h1>在这里，慢慢说</h1>
      <div class="head-status">
        <ModeBadge v-if="store.hasUserMessages" :mode="store.mode" /><span v-else
          ><ShieldCheckIcon :size="15" />非诊断性心理支持</span
        >
      </div>
    </header>
    <div class="consultation-workspace">
      <SessionSidebar
        v-if="!isApplication"
        :sessions="store.sessions"
        :active-id="store.activeSessionId"
        :mobile-open="showSessions"
        @new="store.startNewSession()"
        @select="store.selectSession"
        @rename="store.renameSession"
        @delete="store.deleteSession"
        @close="showSessions = false"
      />
      <div class="chat-panel" data-consultation-panel>
        <div class="chat-toolbar">
          <button
            v-if="!isApplication"
            class="icon-button mobile-sessions"
            type="button"
            aria-label="打开会话列表"
            @click="showSessions = true"
          >
            <MenuIcon :size="20" />
          </button>
          <div class="current-style">
            <span class="doctor-avatar" :data-style="store.selectedDoctor.id">{{
              store.selectedDoctor.name.slice(0, 1)
            }}</span
            ><span
              ><strong>{{ store.selectedDoctor.name }}</strong
              ><small v-if="isApplication"
                ><ModeBadge v-if="store.hasUserMessages" :mode="store.mode" /><template v-else
                  >在这里，慢慢说</template
                ></small
              ><small v-else>{{ store.selectedDoctor.title }}</small></span
            >
          </div>
          <div v-if="isApplication" class="app-chat-actions">
            <button
              class="app-tool-button"
              type="button"
              aria-label="新建对话"
              title="开启新的对话"
              @click="newSession"
            >
              <MessageCirclePlusIcon :size="18" /><span>新对话</span>
            </button>
            <button
              v-if="!wideWorkspace"
              class="app-tool-button"
              type="button"
              aria-label="打开会话列表"
              title="查看对话历史"
              @click="showSessions = true"
            >
              <HistoryIcon :size="18" /><span>历史</span>
            </button>
          </div>
          <button
            class="insight-toggle"
            type="button"
            aria-label="打开情绪洞察"
            @click="showInsights = true"
          >
            <ActivityIcon :size="18" /><span>情绪洞察</span>
          </button>
        </div>
        <div v-if="hasContext" class="context-strip">
          <span>关注背景</span
          ><strong v-for="(value, key) in store.context" v-show="value" :key="key">{{
            value
          }}</strong>
        </div>
        <ChatWindow
          :session-id="store.activeSessionId"
          :messages="store.messages"
          :sending="store.isSending"
          :crisis="store.hasCrisis"
          :doctor-name="store.selectedDoctor.name"
          :doctor-description="store.selectedDoctor.description"
          :application="isApplication"
          @topic="chooseTopic"
        />
        <div v-if="store.activeRequest.error" class="request-notice" role="alert">
          <span>{{ store.activeRequest.error }}</span
          ><button
            v-if="store.activeRequest.retryMessageId"
            type="button"
            @click="store.retryMessage()"
          >
            重试回应
          </button>
        </div>
        <div v-if="store.storageWarning" class="storage-notice" role="status">
          {{ store.storageWarning }}
        </div>
        <div ref="composerArea" class="composer-area">
          <ChatInput
            :model-value="store.draft"
            :sending="store.isSending"
            :doctor-title="store.selectedDoctor.title"
            @update:model-value="store.setDraft"
            @send="store.sendMessage"
            @profile="showProfiles = true"
            @voice="showVoiceCall = true"
            @cancel="store.cancelRequest()"
          />
        </div>
      </div>
      <aside v-if="isApplication && wideWorkspace" class="app-session-panel">
        <div class="app-session-heading"><HistoryIcon :size="16" /><span>留给自己的话</span></div>
        <SessionList
          :sessions="store.sessions"
          :active-id="store.activeSessionId"
          @new="newSession"
          @select="selectSession"
          @rename="store.renameSession"
          @delete="store.deleteSession"
        />
      </aside>
    </div>
    <OverlayPanel
      v-if="isApplication && showSessions"
      title="留给自己的话"
      placement="right"
      @close="showSessions = false"
    >
      <SessionList
        :sessions="store.sessions"
        :active-id="store.activeSessionId"
        @new="newSession"
        @select="selectSession"
        @rename="store.renameSession"
        @delete="store.deleteSession"
      />
    </OverlayPanel>
    <OverlayPanel
      v-if="showInsights"
      title="情绪洞察"
      placement="right"
      @close="showInsights = false"
      ><InsightPanel :insight="store.insight" :has-input="store.hasUserMessages"
    /></OverlayPanel>
    <DoctorProfilePanel
      v-if="showProfiles"
      :profiles="store.doctorProfiles"
      :selected-id="store.selectedDoctor.id"
      :voices="voices"
      @select="chooseDoctor"
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
.consultation-page {
  display: flex;
  flex-direction: column;
  height: calc(var(--visual-height, 100dvh) - var(--header-height));
  min-height: 0;
  padding: 18px 24px 20px;
}
.consultation-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 12px;
  width: min(100%, var(--content));
  margin: 0 auto 14px;
}
.consultation-head h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}
.head-status > span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-soft);
  font-size: 12px;
}
.consultation-workspace {
  display: flex;
  flex: 1;
  min-height: 0;
  width: min(100%, var(--content));
  margin: auto;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
}
.chat-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #fbfaf6;
}
.chat-toolbar {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
  min-height: 66px;
  padding: 10px 20px;
  border-bottom: 1px solid #e9ece4;
}
.current-style {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.current-style > span:last-child {
  display: grid;
  gap: 1px;
  min-width: 0;
}
.current-style strong,
.current-style small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.current-style strong {
  font-size: 14px;
}
.current-style small {
  color: var(--ink-soft);
  font-size: 12px;
}
.doctor-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 13px;
  color: white;
  background: var(--teal);
  flex-shrink: 0;
}
.doctor-avatar[data-style='rational'] {
  background: var(--blue);
}
.doctor-avatar[data-style='coach'] {
  background: var(--coral);
}
.doctor-avatar[data-style='steady'] {
  background: var(--gold);
}
.insight-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 44px;
  margin-left: auto;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--teal);
  background: var(--surface);
  font-size: 12px;
  flex-shrink: 0;
}
.mobile-sessions {
  display: none;
}
.context-strip {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
  padding: 8px 22px;
  overflow-x: auto;
  color: var(--ink-soft);
  background: #f0f4ed;
  font-size: 12px;
  white-space: nowrap;
}
.context-strip strong {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
.composer-area {
  flex-shrink: 0;
  padding: 5px 20px 16px;
}
.request-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
  max-height: 116px;
  overflow-y: auto;
  padding: 8px 18px;
  color: #82662c;
  background: var(--gold-soft);
  font-size: 12px;
}
.request-notice button {
  flex-shrink: 0;
  min-height: 44px;
  padding: 7px 12px;
  border: 1px solid #d7c49a;
  color: inherit;
  background: var(--surface);
  font-size: 12px;
}
.storage-notice {
  flex-shrink: 0;
  padding: 6px 18px;
  color: var(--danger);
  font-size: 12px;
}
@media (max-width: 1023px) {
  .mobile-sessions {
    display: inline-grid;
  }
  .consultation-page {
    padding: 12px 16px 16px;
  }
}
@media (max-width: 600px) {
  .consultation-page {
    padding: 8px 0 0;
  }
  .consultation-head {
    padding: 0 14px;
    margin-bottom: 8px;
  }
  .consultation-head h1 {
    font-size: 18px;
  }
  .head-status > span {
    font-size: 12px;
  }
  .consultation-workspace {
    border-right: 0;
    border-left: 0;
    border-bottom: 0;
    border-radius: 0;
  }
  .chat-toolbar {
    min-height: 60px;
    gap: 9px;
    padding: 7px 12px;
  }
  .insight-toggle {
    padding-inline: 8px;
  }
  .composer-area {
    padding: 0 8px calc(10px + env(safe-area-inset-bottom));
  }
  .context-strip {
    padding-inline: 16px;
  }
  .current-style small {
    font-size: 12px;
  }
  .insight-toggle span {
    font-size: 12px;
  }
  .request-notice,
  .storage-notice {
    padding-inline: 12px;
  }
}
@media (max-width: 360px) {
  .head-status > span {
    max-width: 138px;
  }
  .insight-toggle span {
    display: none;
  }
  .insight-toggle {
    width: 44px;
  }
  .current-style {
    gap: 7px;
  }
}
</style>
