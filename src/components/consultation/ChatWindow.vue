<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { ChatMessage } from '@shared/chat'
import CrisisNotice from './CrisisNotice.vue'
import MessageBubble from './MessageBubble.vue'

const props = defineProps<{ messages: ChatMessage[]; sending: boolean; crisis: boolean; doctorName: string }>()
const scrollArea = ref<HTMLElement>()

watch(() => [props.messages.length, props.sending], async () => {
  await nextTick()
  scrollArea.value?.scrollTo({ top: scrollArea.value.scrollHeight, behavior: 'smooth' })
})
</script>

<template>
  <div ref="scrollArea" class="chat-window">
    <CrisisNotice v-if="crisis" />
    <MessageBubble v-for="message in messages" :key="message.id" :message="message" :assistant-name="doctorName" />
    <div v-if="sending" class="typing" aria-label="正在分析"><i></i><i></i><i></i><span>正在分析</span></div>
  </div>
</template>

<style scoped>
.chat-window { min-height: 0; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; padding: 20px; background: #f8f7f3; scrollbar-color: var(--line) transparent; }
.typing { display: flex; align-items: center; gap: 5px; width: max-content; padding: 10px 12px; border: 1px solid var(--line); border-radius: 7px; color: var(--ink-soft); background: var(--surface); font-size: 10px; }
.typing i { width: 5px; height: 5px; border-radius: 50%; background: var(--teal); animation: breathe 1.3s ease-in-out infinite; }.typing i:nth-child(2) { animation-delay: 140ms; }.typing i:nth-child(3) { animation-delay: 280ms; }.typing span { margin-left: 4px; }
@keyframes breathe { 0%, 70%, 100% { opacity: .25; transform: translateY(0); } 35% { opacity: 1; transform: translateY(-3px); } }
</style>
