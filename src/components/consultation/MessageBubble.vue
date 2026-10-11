<script setup lang="ts">
import { ActivityIcon } from '@lucide/vue'
import type { ChatMessage } from '@shared/chat'
defineProps<{ message: ChatMessage; assistantName?: string }>()
</script>
<template>
  <article class="message" :data-role="message.role">
    <div v-if="message.role === 'assistant'" class="avatar"><ActivityIcon :size="18" /></div>
    <div class="bubble">
      <small v-if="message.role === 'assistant'" class="sender-name">{{
        message.assistantName || 'AI陪伴'
      }}</small>
      <p>{{ message.content }}</p>
      <div v-if="message.role === 'assistant' && message.emotion" class="message-meta">
        <span>{{ message.emotion }}</span
        ><span v-if="message.sourceMode === 'mock' && message.riskLevel !== '高'">基础支持</span>
      </div>
    </div>
  </article>
</template>
<style scoped>
.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: message-in 180ms ease both;
}
.message[data-role='user'] {
  justify-content: flex-end;
}
.avatar {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: var(--teal);
  background: var(--teal-soft);
}
.bubble {
  max-width: calc(100% - 48px);
  padding: 3px 0;
  min-width: 0;
}
.message[data-role='user'] .bubble {
  max-width: 84%;
  padding: 13px 17px;
  border: 1px solid #d1e3d8;
  border-radius: 16px 16px 4px 16px;
  background: #e8f1e8;
}
p {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 16px;
  line-height: 1.85;
}
.sender-name {
  display: block;
  margin-bottom: 7px;
  color: var(--teal);
  font-size: 12px;
  font-weight: 700;
}
.message-meta {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.message-meta span {
  color: var(--ink-soft);
  font-size: 12px;
}
@keyframes message-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
