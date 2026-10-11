<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MicIcon, MicOffIcon, PhoneOffIcon, Volume2Icon } from '@lucide/vue'
import type { ChatMessage } from '@shared/chat'
import type { DoctorProfile } from '@/types/consultation'
import OverlayPanel from '@/components/common/OverlayPanel.vue'
import {
  createSpeechRecognition,
  speakText,
  stopSpeaking,
  supportsSpeechRecognition,
} from '@/services/voiceService'

const props = defineProps<{
  doctor: DoctorProfile
  messages: ChatMessage[]
  sending: boolean
  voices: SpeechSynthesisVoice[]
}>()
const emit = defineEmits<{ close: []; send: [text: string] }>()

const supported = supportsSpeechRecognition()
const listening = ref(false)
const status = ref<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
const transcript = ref('')
const error = ref('')
const lastSpokenId = ref('')
const latestAssistant = computed(() =>
  [...props.messages].reverse().find((message) => message.role === 'assistant'),
)

const recognition = createSpeechRecognition({
  onInterim: (text) => {
    transcript.value = text
  },
  onFinal: (text) => {
    transcript.value = text
    listening.value = false
    status.value = 'thinking'
    emit('send', text)
  },
  onError: (message) => {
    error.value = message
    listening.value = false
    status.value = 'idle'
  },
  onEnd: () => {
    listening.value = false
    if (status.value === 'listening') status.value = 'idle'
  },
})

function startListening() {
  if (!recognition || listening.value || props.sending) return
  stopSpeaking()
  transcript.value = ''
  error.value = ''
  listening.value = true
  status.value = 'listening'
  try {
    recognition.start()
  } catch {
    listening.value = false
    status.value = 'idle'
  }
}

function stopListening() {
  recognition?.stop()
  listening.value = false
  status.value = 'idle'
}

async function readMessage(message: ChatMessage | undefined) {
  if (!message || message.id === lastSpokenId.value) return
  lastSpokenId.value = message.id
  status.value = 'speaking'
  await speakText(
    message.content,
    props.voices,
    props.doctor.voicePreference,
    props.doctor.voiceURI,
  )
  status.value = 'idle'
}

function close() {
  recognition?.abort()
  stopSpeaking()
  emit('close')
}

watch(
  () => props.sending,
  (sending) => {
    if (sending) status.value = 'thinking'
    else if (status.value === 'thinking') status.value = 'idle'
  },
)
watch(
  () => latestAssistant.value?.id,
  () => {
    void readMessage(latestAssistant.value)
  },
)
onMounted(() => {
  void readMessage(latestAssistant.value)
})
onBeforeUnmount(() => {
  recognition?.abort()
  stopSpeaking()
})
</script>

<template>
  <OverlayPanel title="心绘语音陪伴" placement="full" @close="close">
    <div class="call-overlay">
      <div class="call-top">
        <span class="privacy"><Volume2Icon :size="14" />使用浏览器语音服务</span>
      </div>
      <main>
        <div class="voice-avatar" :data-status="status">
          <span>{{ doctor.name.slice(0, 1) }}</span
          ><i></i><i></i><i></i>
        </div>
        <h2>{{ doctor.name }}</h2>
        <p class="doctor-title">{{ doctor.title }}</p>
        <div class="call-status">
          <span></span
          >{{
            status === 'listening'
              ? '正在听你说'
              : status === 'thinking'
                ? '正在思考'
                : status === 'speaking'
                  ? '正在朗读'
                  : supported
                    ? '等待你开口'
                    : '语音识别不可用'
          }}
        </div>
        <p v-if="transcript" class="transcript">“{{ transcript }}”</p>
        <p v-else-if="error" class="call-error">{{ error }}</p>
        <p v-else class="call-hint">
          {{
            supported ? '点击麦克风，说出你此刻的感受' : '当前浏览器不支持语音识别，可切换文字对话'
          }}
        </p>
      </main>
      <button class="text-mode" type="button" @click="close">切换文字对话</button>
      <div class="call-actions">
        <button
          class="mic-control"
          type="button"
          :disabled="!supported || sending"
          :aria-label="listening ? '停止聆听' : '开始说话'"
          @click="listening ? stopListening() : startListening()"
        >
          <MicOffIcon v-if="listening" :size="23" /><MicIcon v-else :size="23" />
        </button>
        <button class="hangup" type="button" aria-label="结束语音通话" @click="close">
          <PhoneOffIcon :size="23" />
        </button>
      </div>
    </div>
  </OverlayPanel>
</template>

<style scoped>
.call-overlay {
  display: grid;
  flex: 1;
  min-width: 0;
  min-height: 0;
  grid-template-rows: auto 1fr auto auto;
  color: var(--ink);
  background: var(--bg);
}
.call-top {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 12px;
}
.privacy {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-soft);
  font-size: 12px;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 24px;
  text-align: center;
}
.voice-avatar {
  position: relative;
  width: 126px;
  height: 126px;
  display: grid;
  place-items: center;
  margin-bottom: 28px;
  border-radius: 50%;
  background: #218b82;
  box-shadow: 0 0 0 12px rgb(33 139 130 / 12%);
}
.voice-avatar span {
  font-size: 42px;
  font-weight: 700;
  color: white;
}
.voice-avatar i {
  position: absolute;
  inset: -14px;
  border: 1px solid rgb(121 184 173 / 45%);
  border-radius: 50%;
  opacity: 0;
}
.voice-avatar[data-status='speaking'] i,
.voice-avatar[data-status='listening'] i {
  animation: voice-ring 1.8s ease-out infinite;
}
.voice-avatar i:nth-of-type(2) {
  animation-delay: 600ms !important;
}
.voice-avatar i:nth-of-type(3) {
  animation-delay: 1.2s !important;
}
h2 {
  margin: 0;
  font-size: 28px;
}
.doctor-title {
  margin: 7px 0 18px;
  color: var(--teal);
  font-size: 13px;
}
.call-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-soft);
  font-size: 12px;
}
.call-status span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6fc7b9;
}
.transcript {
  max-width: 620px;
  min-height: 54px;
  margin: 30px 0 0;
  color: var(--ink);
  font-size: 18px;
  line-height: 1.7;
}
.call-hint,
.call-error {
  margin: 30px 0 0;
  color: var(--ink-soft);
  font-size: 12px;
}
.call-error {
  color: var(--danger);
}
.call-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 26px 24px calc(38px + env(safe-area-inset-bottom));
}
.call-actions button {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: white;
  cursor: pointer;
}
.mic-control {
  background: #2b4844;
}
.mic-control:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.hangup {
  background: #d95f54;
}
@keyframes voice-ring {
  0% {
    opacity: 0.7;
    transform: scale(0.9);
  }
  100% {
    opacity: 0;
    transform: scale(1.45);
  }
}
@media (max-width: 600px) {
  .call-top {
    padding: 16px;
  }
  .voice-avatar {
    width: 108px;
    height: 108px;
  }
  .transcript {
    font-size: 16px;
  }
  .call-actions {
    padding-bottom: calc(28px + env(safe-area-inset-bottom));
  }
}
.text-mode {
  justify-self: center;
  min-height: 44px;
  padding: 8px 18px;
  border: 1px solid var(--line);
  color: var(--teal);
  background: var(--surface);
  font-size: 14px;
}
@media (max-height: 600px) {
  main {
    padding: 14px;
  }
  .voice-avatar {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
  }
  .voice-avatar span {
    font-size: 28px;
  }
  h2 {
    font-size: 22px;
  }
  .doctor-title {
    margin-bottom: 8px;
  }
  .call-hint,
  .call-error,
  .transcript {
    margin-top: 12px;
  }
  .call-actions {
    padding: 14px 24px calc(16px + env(safe-area-inset-bottom));
  }
}
</style>
