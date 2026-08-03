<script setup lang="ts">
import { BotIcon, UserIcon } from '@lucide/vue'
import type { ChatMessage } from '@shared/chat'
defineProps<{ message: ChatMessage; assistantName?: string }>()
</script>

<template>
  <article class="message" :data-role="message.role">
    <div class="avatar"><UserIcon v-if="message.role === 'user'" :size="16" /><BotIcon v-else :size="16" /></div>
    <div class="bubble"><small v-if="message.role === 'assistant'" class="sender-name">{{ assistantName }}</small><p>{{ message.content }}</p><div v-if="message.role === 'assistant' && message.emotion" class="message-meta"><span>{{ message.emotion }}</span><span>{{ message.riskLevel }}风险</span></div></div>
  </article>
</template>

<style scoped>
.message { display: flex; align-items: flex-start; gap: 10px; animation: message-in 260ms ease both; }
.message[data-role="user"] { flex-direction: row-reverse; }
.avatar { width: 30px; height: 30px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 50%; color: var(--teal); background: var(--teal-soft); }
.message[data-role="user"] .avatar { color: var(--blue); background: #e2ebf3; }
.bubble { max-width: min(78%, 650px); padding: 12px 14px; border: 1px solid var(--line); border-radius: 7px; background: var(--surface); }
.message[data-role="user"] .bubble { border-color: #b9d3ce; background: var(--teal-soft); }
p { margin: 0; white-space: pre-wrap; font-size: 13px; line-height: 1.8; }
.sender-name { display: block; margin-bottom: 5px; color: var(--teal); font-size: 9px; font-weight: 700; }
.message-meta { display: flex; gap: 6px; margin-top: 9px; }.message-meta span { padding: 3px 6px; border-radius: 4px; color: var(--ink-soft); background: var(--surface-muted); font-size: 9px; }
@keyframes message-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 560px) { .bubble { max-width: calc(100% - 40px); } }
</style>
