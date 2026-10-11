<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowUpIcon, ChevronDownIcon, MicIcon, SquareIcon } from '@lucide/vue'
const props = defineProps<{ sending: boolean; modelValue?: string; doctorTitle?: string }>()
const emit = defineEmits<{
  send: [content: string]
  voice: []
  profile: []
  cancel: []
  'update:modelValue': [value: string]
}>()
const localValue = ref('')
const textarea = ref<HTMLTextAreaElement>()
const composing = ref(false)
const value = computed({
  get: () => props.modelValue ?? localValue.value,
  set: (next: string) => {
    localValue.value = next
    emit('update:modelValue', next)
  },
})
const disabled = computed(() => props.sending || !value.value.trim())
async function resize() {
  await nextTick()
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${Math.min(112, Math.max(52, textarea.value.scrollHeight))}px`
  }
}
watch(value, resize, { immediate: true })
function submit() {
  if (disabled.value || composing.value) return
  const content = value.value.trim()
  emit('send', content)
  value.value = ''
}
function keydown(event: KeyboardEvent) {
  if (
    event.key !== 'Enter' ||
    event.shiftKey ||
    event.isComposing ||
    composing.value ||
    event.keyCode === 229
  )
    return
  if (event.ctrlKey || window.matchMedia('(min-width: 768px)').matches) {
    event.preventDefault()
    submit()
  }
}
</script>
<template>
  <div class="composer-shell">
    <form class="chat-input" @submit.prevent="submit">
      <textarea
        ref="textarea"
        v-model="value"
        rows="1"
        maxlength="4000"
        placeholder="写下此刻的感受，或从一件小事说起……"
        aria-label="咨询消息"
        @compositionstart="composing = true"
        @compositionend="composing = false"
        @keydown="keydown"
      />
      <div class="composer-tools">
        <button
          class="style-choice"
          type="button"
          aria-label="选择陪伴风格"
          @click="emit('profile')"
        >
          <span class="style-dot"></span
          ><span class="style-label">{{ doctorTitle || '陪伴风格' }}</span
          ><ChevronDownIcon :size="15" />
        </button>
        <div class="send-tools">
          <span class="character-count" aria-live="off">{{ value.length }}/4000</span
          ><button
            class="voice-button"
            type="button"
            aria-label="开始语音通话"
            title="语音通话"
            @click="emit('voice')"
          >
            <MicIcon :size="20" /></button
          ><button
            v-if="sending"
            class="stop-button"
            type="button"
            aria-label="停止回应"
            title="停止回应"
            @click="emit('cancel')"
          >
            <SquareIcon :size="17" /></button
          ><button
            v-else
            class="send-button"
            type="submit"
            :disabled="disabled"
            aria-label="发送消息"
            title="发送消息"
          >
            <ArrowUpIcon :size="22" />
          </button>
        </div>
      </div>
    </form>
    <p class="composer-note">心理支持建议，仅供参考；需要时请寻求专业帮助</p>
  </div>
</template>
<style scoped>
.composer-shell {
  position: relative;
  isolation: isolate;
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 7px 7px 0;
}
.composer-shell::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 7px 12px 35px;
  border-radius: 25px;
  background: linear-gradient(110deg, #c7e4d6 0%, #d9d9ec 64%, #e8dbd3 100%);
  filter: blur(22px);
  opacity: 0.72;
}
.chat-input {
  padding: 13px 15px 12px;
  border: 1px solid rgb(255 255 255 / 95%);
  border-radius: 20px;
  background: rgb(255 254 250 / 85%);
  box-shadow:
    0 5px 28px rgb(40 68 61 / 8%),
    0 0 0 6px rgb(255 255 255 / 30%);
  backdrop-filter: blur(16px);
  transition: box-shadow 180ms;
}
.chat-input:focus-within {
  box-shadow:
    0 5px 28px rgb(40 68 61 / 9%),
    0 0 0 2px rgb(94 156 140 / 28%),
    0 0 0 7px rgb(255 255 255 / 35%);
}
textarea {
  width: 100%;
  min-height: 52px;
  max-height: 112px;
  display: block;
  resize: none;
  padding: 8px 5px;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
  line-height: 24px;
  overflow-y: auto;
}
textarea:focus-visible {
  outline: none;
}
.composer-tools,
.send-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}
.composer-tools {
  justify-content: space-between;
  gap: 6px;
  padding-top: 3px;
}
.style-choice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 6px 10px;
  border: 1px solid #e5e8de;
  border-radius: 10px;
  background: rgb(255 255 255 / 70%);
  font-size: 12px;
  white-space: nowrap;
  min-width: 0;
  max-width: calc(100% - 158px);
}
.style-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.style-dot,
.style-choice svg,
.send-tools {
  flex-shrink: 0;
}
.style-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--teal);
}
.send-tools button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 12px;
}
.voice-button {
  color: var(--teal);
  background: transparent;
}
.voice-button:hover {
  background: var(--teal-soft);
}
.send-button,
.stop-button {
  color: white;
  background: var(--teal);
}
.send-button:disabled {
  color: #71958a;
  background: #deebe3;
}
.character-count {
  color: var(--ink-soft);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.composer-note {
  margin: 12px 0 0;
  text-align: center;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.5;
}
@media (max-width: 380px) {
  .chat-input {
    padding-inline: 10px;
  }
  .send-tools {
    gap: 2px;
  }
  .style-choice {
    padding-inline: 7px;
    max-width: calc(100% - 98px);
  }
  .character-count {
    display: none;
  }
}
</style>
