<script setup lang="ts">
import { computed, ref } from 'vue'
import { MicIcon, SendIcon } from '@lucide/vue'

const props = defineProps<{ sending: boolean }>()
const emit = defineEmits<{ send: [content: string]; voice: [] }>()
const value = ref('')
const disabled = computed(() => props.sending || !value.value.trim())

function submit() {
  const content = value.value.trim()
  if (!content || props.sending) return
  emit('send', content)
  value.value = ''
}
</script>

<template>
  <form class="chat-input" @submit.prevent="submit">
    <textarea v-model="value" rows="2" maxlength="4000" placeholder="写下此刻最困扰你的事情……" aria-label="咨询消息" @keydown.ctrl.enter="submit" />
    <button class="voice-button" type="button" aria-label="开始语音通话" title="语音通话" @click="emit('voice')"><MicIcon :size="19" /></button>
    <button type="submit" :disabled="disabled" aria-label="发送消息" title="发送消息"><SendIcon :size="19" /></button>
  </form>
</template>

<style scoped>
.chat-input { display: grid; grid-template-columns: 1fr 42px 42px; align-items: end; gap: 8px; padding: 12px; border-top: 1px solid var(--line); background: var(--surface); }
textarea { width: 100%; min-height: 46px; max-height: 130px; resize: vertical; padding: 12px 14px; border: 1px solid var(--line); border-radius: 7px; color: var(--ink); background: #fff; line-height: 1.55; }
textarea:focus { outline: 2px solid var(--teal-soft); border-color: var(--teal); }
button { width: 42px; height: 42px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 7px; color: white; background: var(--teal); cursor: pointer; transition: transform 160ms ease, opacity 160ms ease; }
button:hover:not(:disabled) { transform: translateY(-2px); } button:disabled { opacity: .36; cursor: not-allowed; }
.voice-button { color: var(--teal-dark); border: 1px solid var(--line); background: var(--surface-muted); }
</style>
