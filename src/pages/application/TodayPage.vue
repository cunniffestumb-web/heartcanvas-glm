<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRightIcon, ArrowUpRightIcon, BookOpenIcon, CheckIcon, FeatherIcon, MessageCircleIcon, WindIcon } from '@lucide/vue'
import SoftOrb from '@/components/application/SoftOrb.vue'
import MoodPicker from '@/components/application/MoodPicker.vue'
import BreathingDialog from '@/components/application/BreathingDialog.vue'
import ChatInput from '@/components/consultation/ChatInput.vue'
import { moods, type MoodId, useWellbeingStore } from '@/stores/wellbeing'
import { useConsultationStore } from '@/stores/consultation'
const router = useRouter()
const wellbeing = useWellbeingStore()
const consultation = useConsultationStore()
const selectedMood = ref<MoodId | ''>('')
const saved = ref(false)
const breathing = ref(false)
const opening = ref(false)
const hour = new Date().getHours()
const greeting = hour < 6 ? '夜深了' : hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好'
const recentSessions = computed(() => consultation.sessions.filter(session => session.messages.some(message => message.role === 'user')).slice(0, 2))
const moodReply = computed(() => moods.find(mood => mood.id === selectedMood.value)?.reply)
function chooseMood(value: MoodId) { selectedMood.value = value; saved.value = false }
function saveMood() { if (selectedMood.value) { wellbeing.addEntry(selectedMood.value); saved.value = true } }
function startChat() { consultation.startNewSession({}); void router.push('/app/chat') }
function resume(id: string) { consultation.selectSession(id); void router.push('/app/chat') }
function openPanel(panel: 'voice' | 'styles') { void router.push({ path: '/app/chat', query: { panel } }) }
async function sendFromHome(content: string) {
  if (opening.value) return
  opening.value = true
  const sessionId = consultation.startNewSession({})
  try {
    await router.push('/app/chat')
    if (consultation.activeSessionId === sessionId) await consultation.sendMessage(content)
  } finally { opening.value = false }
}
</script>
<template>
  <div class="app-page today-page">
    <section class="today-hero">
      <p class="companion-tag"><i></i>心绘，一直在这里</p>
      <SoftOrb class="today-orb" />
      <p class="today-greeting">{{ greeting }}，{{ wellbeing.nickname || '亲爱的你' }}。</p>
      <h1>把心事轻轻放下，<br class="mobile-line" />我们慢慢说。</h1>
      <p class="app-subtitle">不用一次说清楚，从此刻最想表达的感受开始。</p>
      <div class="home-composer">
        <ChatInput
          :model-value="consultation.draft"
          :sending="consultation.isSending || opening"
          :doctor-title="consultation.selectedDoctor.title"
          @update:model-value="consultation.setDraft"
          @send="sendFromHome"
          @profile="openPanel('styles')"
          @voice="openPanel('voice')"
          @cancel="consultation.cancelRequest()"
        />
      </div>
    </section>
    <section class="quick-section">
      <div class="quick-heading"><h2 class="app-section-title">从一件小事开始</h2><span>按你喜欢的节奏</span></div>
      <div class="quick-actions">
        <button @click="startChat"><span class="quick-icon sage"><MessageCircleIcon :size="23" :stroke-width="1.6" /></span><strong>说说心事</strong><small>有人认真听你说</small><ArrowUpRightIcon :size="18" /></button>
        <RouterLink to="/app/mood"><span class="quick-icon peach"><FeatherIcon :size="23" :stroke-width="1.6" /></span><strong>记下心情</strong><small>收藏此刻的自己</small><ArrowUpRightIcon :size="18" /></RouterLink>
        <button @click="breathing = true"><span class="quick-icon lavender"><WindIcon :size="23" :stroke-width="1.6" /></span><strong>呼吸一下</strong><small>给忙碌按下暂停</small><ArrowUpRightIcon :size="18" /></button>
        <RouterLink to="/app/library"><span class="quick-icon sand"><BookOpenIcon :size="23" :stroke-width="1.6" /></span><strong>了解更多</strong><small>读读相似的经历</small><ArrowUpRightIcon :size="18" /></RouterLink>
      </div>
    </section>
    <div class="today-bottom-grid">
      <section class="app-card today-mood">
        <div class="card-heading"><h2 class="app-section-title">此刻，你的心情是？</h2><span aria-hidden="true">✧</span></div>
        <p>每一种感受，都值得被认真对待。</p>
        <MoodPicker :model-value="selectedMood" @update:model-value="chooseMood" />
        <div class="mood-response" aria-live="polite">
          <template v-if="selectedMood"><span>{{ saved ? wellbeing.storageWarning ? '已在本次打开中记下。' : '已记下今天的心情。' : moodReply }}</span><button :disabled="saved" @click="saveMood"><CheckIcon v-if="saved" :size="17" />{{ saved ? '已记录' : '记下来' }}<ArrowRightIcon v-if="!saved" :size="16" /></button></template>
          <span v-else>轻轻点一下，让心情有个落脚的地方。</span>
        </div>
      </section>
      <section class="app-card recent-card">
        <div class="card-heading"><h2 class="app-section-title">心事，还可以继续</h2><RouterLink to="/app/chat" class="app-text-link">去陪伴<ArrowUpRightIcon :size="17" /></RouterLink></div>
        <template v-if="recentSessions.length">
          <button v-for="session in recentSessions" :key="session.id" class="recent-session" @click="resume(session.id)"><MessageCircleIcon :size="21" /><div><strong>{{ session.title }}</strong><small>{{ new Date(session.updatedAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) }} · 随时可以接着说</small></div><ArrowRightIcon :size="18" /></button>
        </template>
        <div v-else class="recent-empty"><span class="empty-orb" aria-hidden="true"><MessageCircleIcon :size="28" :stroke-width="1.4" /></span><p>这里会留下我们的对话。<br />不急，等你想说的时候。</p><button class="app-text-link" @click="startChat">开始一段陪伴<ArrowRightIcon :size="17" /></button></div>
      </section>
    </div>
    <footer class="today-footer"><span aria-hidden="true">✧</span>照顾自己，是一件值得慢慢做的事。</footer>
    <p v-if="wellbeing.storageWarning" class="storage-feedback" role="status">{{ wellbeing.storageWarning }}</p>
    <BreathingDialog v-if="breathing" @close="breathing = false" />
  </div>
</template>
<style scoped>
.today-hero { display: flex; align-items: center; flex-direction: column; text-align: center; padding: 2px 0 8px; }
.companion-tag { display: flex; align-items: center; gap: 8px; margin: 0; }
.companion-tag i { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 0 5px #217c7010; }
.today-orb { width: 220px; height: 190px; margin: 12px 0 9px; }
.today-greeting { margin: 0 0 3px; }
.mobile-line { display: none; }
.home-composer { width: min(100%, 800px); margin: 22px auto 0; text-align: left; }
.quick-section { margin-top: 20px; }
.quick-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.quick-heading > span { font-size: 14px; color: var(--ink-soft); }
.quick-actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.quick-actions > a, .quick-actions > button { position: relative; display: flex; flex-direction: column; align-items: flex-start; min-width: 0; padding: 20px; border: 1px solid #ffffffed; border-radius: 22px; background: #fffdf9a8; box-shadow: var(--app-shadow); text-align: left; animation: quick-arrive 650ms cubic-bezier(.16, 1, .3, 1) backwards; }
.quick-actions > :nth-child(2) { animation-delay: 60ms; }
.quick-actions > :nth-child(3) { animation-delay: 120ms; }
.quick-actions > :nth-child(4) { animation-delay: 180ms; }
.quick-actions > a:hover, .quick-actions > button:hover { transform: translateY(-7px); background: #fffdf9e8; box-shadow: 0 17px 32px #897b5415; }
.quick-icon { display: grid; place-items: center; width: 43px; height: 43px; border-radius: 14px; margin-bottom: 12px; }
.sage { color: var(--teal); background: #e5f1e8; }
.peach { color: #ae7261; background: #fae8df; }
.lavender { color: #7a739f; background: #eeebf8; }
.sand { color: #9b7d42; background: #f8efcf; }
.quick-actions strong { font-size: 16px; font-weight: 500; line-height: 1.8; }
.quick-actions small { font-size: 14px; line-height: 1.8; color: var(--ink-soft); }
.quick-actions > a > svg, .quick-actions > button > svg { position: absolute; right: 18px; top: 22px; color: #7c9280; }
.today-bottom-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 20px; margin-top: 26px; }
.today-mood, .recent-card { padding: 24px; }
.card-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.card-heading > span { color: #b8a37e; font-size: 26px; }
.today-mood > p { margin: 10px 0 18px; }
.mood-response { display: flex; justify-content: space-between; align-items: center; gap: 10px; min-height: 62px; margin-top: 16px; padding-top: 15px; border-top: 1px solid #d9dfcf; color: var(--ink-soft); font-size: 14px; }
.mood-response > span { flex: 1; }
.mood-response > button { display: flex; align-items: center; gap: 5px; flex-shrink: 0; min-height: 44px; padding: 8px 10px; border: 0; border-radius: 12px; background: #e2efe5; color: var(--teal-dark); }
.recent-session { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 78px; padding: 12px 0; border: 0; background: transparent; text-align: left; color: var(--teal); }
.recent-session > div { display: grid; gap: 4px; min-width: 0; flex: 1; }
.recent-session strong { font-size: 16px; font-weight: 500; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recent-empty { display: flex; align-items: flex-start; flex-direction: column; padding-top: 26px; }
.empty-orb { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 16px; color: var(--teal); background: #e5efe7; }
.recent-empty p { margin: 16px 0 4px; }
.today-footer { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 30px; color: var(--ink-soft); font-size: 14px; text-align: center; }
.today-footer > span { font-size: 24px; color: #ae9370; }
.storage-feedback { color: var(--danger); }
@keyframes quick-arrive { from { opacity: 0; transform: translateY(26px) scale(.96); } to { opacity: 1; transform: none; } }
@media (min-width: 768px) and (max-width: 1100px) {
  .quick-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .today-bottom-grid { grid-template-columns: 1fr; }
}
@media (max-width: 767px) {
  .today-hero { padding-top: 0; }
  .today-orb { width: 200px; height: 170px; margin: 12px 0 5px; }
  .mobile-line { display: inline; }
  .home-composer { margin-top: 12px; }
  .quick-section { margin-top: 24px; }
  .quick-heading { margin-bottom: 12px; }
  .quick-heading > span { font-size: 14px; }
  .quick-actions { display: grid; grid-template-columns: repeat(4, 160px); overflow-x: auto; scroll-snap-type: x proximity; padding: 4px 2px 14px; gap: 12px; }
  .quick-actions > a, .quick-actions > button { padding: 18px; scroll-snap-align: start; }
  .quick-actions strong { font-size: 16px; }
  .quick-actions small { font-size: 14px; }
  .today-bottom-grid { grid-template-columns: 1fr; gap: 18px; margin-top: 18px; }
  .today-mood, .recent-card { padding: 22px; }
  .recent-empty { padding-top: 18px; }
  .today-footer { font-size: 14px; line-height: 1.8; margin-top: 25px; }
}
@media (max-width: 360px) {
  .today-mood, .recent-card { padding: 18px; }
  .quick-heading { flex-wrap: wrap; }
}
</style>
