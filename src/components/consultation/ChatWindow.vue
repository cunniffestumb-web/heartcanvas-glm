<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ActivityIcon, ArrowUpRightIcon, BookOpenIcon, CoffeeIcon, MoonIcon, UsersRoundIcon } from '@lucide/vue'
import type { ChatMessage } from '@shared/chat'
import { supportTopics } from '@/data/supportTopics'
import SoftOrb from '@/components/application/SoftOrb.vue'
import CrisisNotice from './CrisisNotice.vue'
import MessageBubble from './MessageBubble.vue'
const props = defineProps<{
  messages: ChatMessage[]
  sending: boolean
  crisis: boolean
  doctorName: string
  doctorDescription?: string
  sessionId?: string
  application?: boolean
}>()
const emit = defineEmits<{ topic: [id: string] }>()
const scrollArea = ref<HTMLElement>()
const topicIcons = { exam: BookOpenIcon, relationships: UsersRoundIcon, sleep: MoonIcon, work: CoffeeIcon }
const hasUser = computed(() => props.messages.some((message) => message.role === 'user'))
watch(
  () => [props.sessionId, props.messages.length, props.sending],
  async () => {
    await nextTick()
    scrollArea.value?.scrollTo({
      top: hasUser.value ? scrollArea.value.scrollHeight : 0,
      behavior: 'auto',
    })
  },
  { immediate: true },
)
</script>
<template>
  <div
    ref="scrollArea"
    class="chat-window"
    :class="{ 'application-window': application }"
    role="log"
    aria-live="polite"
    aria-relevant="additions"
  >
    <div v-if="!hasUser" class="welcome">
      <SoftOrb v-if="application" class="welcome-orb" />
      <span v-else class="welcome-mark"><ActivityIcon :size="32" /></span>
      <p class="section-kicker">{{ application ? '此刻，留一点时间给自己' : '心绘 · 智能心理支持' }}</p>
      <h2>今天，想从哪里说起？</h2>
      <p class="welcome-description">
        {{ doctorDescription || '不必一次说清所有事情，从此刻最想表达的感受开始。' }}
      </p>
      <div class="welcome-topics">
        <button
          v-for="topic in supportTopics"
          :key="topic.id"
          type="button"
          @click="emit('topic', topic.id)"
        >
          <span v-if="application" class="topic-symbol" :data-topic="topic.id"
            ><component :is="topicIcons[topic.id]" :size="20" :stroke-width="1.5"
          /></span>
          <span class="topic-text"
            ><strong>{{ topic.title }}</strong
            ><small>{{ topic.description }}</small></span
          ><ArrowUpRightIcon :size="18" />
        </button>
      </div>
      <p class="welcome-foot">
        {{ application ? '没有标准答案，按你自己的节奏来就好。' : `${doctorName} · 按你喜欢的方式，慢慢展开` }}
      </p>
    </div>
    <div v-else class="message-list">
      <CrisisNotice v-if="crisis" /><MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :assistant-name="doctorName"
      />
      <div v-if="sending" class="typing" aria-label="正在回应">
        <i></i><i></i><i></i><span>正在整理你的感受…</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.chat-window {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 28px 24px;
  overscroll-behavior: contain;
  scrollbar-color: #cddad1 transparent;
}
.message-list,
.welcome {
  width: min(100%, 800px);
  margin: auto;
}
.message-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.welcome {
  max-width: 650px;
  padding: 18px 0 8px;
  text-align: center;
}
.welcome-mark {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  margin: 0 auto 18px;
  border: 1px solid #c9dfd4;
  border-radius: 22px;
  color: var(--teal);
  background: #e9f2eb;
}
h2 {
  margin: 0;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.4;
}
.welcome-description {
  max-width: 480px;
  margin: 14px auto 26px;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.8;
}
.welcome-topics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  text-align: left;
}
.welcome-topics button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 80px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 13px;
  color: var(--ink);
  background: var(--surface);
  text-align: left;
  transition:
    border-color 160ms,
    background 160ms;
}
.welcome-topics button:hover {
  border-color: #aacbbd;
  background: #f1f7f0;
}
.welcome-topics span {
  display: grid;
  gap: 5px;
}
.welcome-topics strong {
  font-size: 14px;
}
.welcome-topics small {
  color: var(--ink-soft);
  font-size: 12px;
}
.welcome-topics svg {
  flex-shrink: 0;
  color: var(--teal);
}
.welcome-foot {
  margin: 22px 0 0;
  color: var(--ink-soft);
  font-size: 12px;
}
.typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  color: var(--ink-soft);
  font-size: 12px;
}
.typing i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--teal);
  animation: breathe 1.3s ease-in-out infinite;
}
.typing i:nth-child(2) {
  animation-delay: 150ms;
}
.typing i:nth-child(3) {
  animation-delay: 300ms;
}
.typing span {
  margin-left: 8px;
}
@keyframes breathe {
  50% {
    opacity: 0.3;
  }
}
@media (max-width: 600px) {
  .chat-window {
    padding: 18px 16px;
  }
  .welcome {
    padding-top: 4px;
  }
  .welcome-mark {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    border-radius: 16px;
  }
  .welcome .section-kicker {
    display: none;
  }
  .welcome-description {
    margin: 10px 0 18px;
    font-size: 14px;
  }
  .welcome-topics {
    gap: 8px;
  }
  .welcome-topics button {
    min-height: 74px;
    padding: 12px;
  }
  .welcome-topics svg {
    display: none;
  }
  .welcome-foot {
    margin-top: 14px;
  }
}
</style>
