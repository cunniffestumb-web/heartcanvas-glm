<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { CheckIcon, MessageCirclePlusIcon, PencilIcon, Trash2Icon } from '@lucide/vue'
import type { ConsultationSession } from '@/types/consultation'
defineProps<{ sessions: ConsultationSession[]; activeId: string }>()
const emit = defineEmits<{
  new: []
  select: [id: string]
  rename: [id: string, title: string]
  delete: [id: string]
}>()
const editingId = ref('')
const editingTitle = ref('')
const deletingId = ref('')
function relativeTime(value: string) {
  const date = new Date(value)
  return date.toDateString() === new Date().toDateString()
    ? '今天'
    : date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}
async function edit(session: ConsultationSession) {
  editingId.value = session.id
  editingTitle.value = session.title
  await nextTick()
  const input = document.querySelector<HTMLInputElement>('[data-session-rename]')
  input?.focus()
  input?.select()
}
function saveEdit() {
  if (!editingId.value) return
  emit('rename', editingId.value, editingTitle.value)
  editingId.value = ''
}
function confirmDelete(id: string) {
  emit('delete', id)
  deletingId.value = ''
}
</script>
<template>
  <div class="sidebar-content">
    <button class="new-session" type="button" @click="emit('new')">
      <MessageCirclePlusIcon :size="19" />新建对话
    </button>
    <p class="panel-label">你的对话</p>
    <div class="session-list">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="session-row"
        :class="{ active: session.id === activeId }"
      >
        <form v-if="editingId === session.id" class="rename-form" @submit.prevent="saveEdit">
          <input
            v-model="editingTitle"
            data-session-rename
            maxlength="30"
            aria-label="对话名称"
            @keydown.esc="editingId = ''"
          /><button type="submit" aria-label="保存名称"><CheckIcon :size="18" /></button>
        </form>
        <template v-else
          ><button class="session-main" type="button" @click="emit('select', session.id)">
            <span>{{ session.title }}</span
            ><small>{{ relativeTime(session.updatedAt) }}</small>
          </button>
          <div class="session-actions">
            <button type="button" aria-label="重命名对话" title="重命名" @click="edit(session)">
              <PencilIcon :size="16" /></button
            ><button
              v-if="deletingId !== session.id"
              type="button"
              aria-label="删除对话"
              title="删除"
              @click="deletingId = session.id"
            >
              <Trash2Icon :size="16" /></button
            ><button
              v-else
              class="confirm-delete"
              type="button"
              aria-label="确认删除对话"
              title="确认删除"
              @click="confirmDelete(session.id)"
            >
              <CheckIcon :size="18" />
            </button></div
        ></template>
      </div>
    </div>
    <p class="privacy-note">
      历史记录保存在此浏览器，可随时改名或删除。在线对话会发送给模型服务处理。
    </p>
  </div>
</template>
<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}
.new-session {
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 9px 16px;
  border: 1px solid #ccddd2;
  border-radius: 11px;
  color: var(--teal-dark);
  background: var(--surface);
  font-size: 14px;
  font-weight: 700;
}
.new-session:hover {
  background: var(--teal-soft);
}
.panel-label {
  margin: 28px 8px 10px;
  color: var(--ink-soft);
  font-size: 12px;
}
.session-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.session-row {
  margin-bottom: 5px;
  padding: 7px;
  border-radius: 10px;
}
.session-row.active {
  background: #e2ede2;
}
.session-main {
  display: grid;
  gap: 3px;
  width: 100%;
  padding: 4px;
  min-height: 44px;
  border: 0;
  color: var(--ink);
  background: transparent;
  text-align: left;
}
.session-main span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.session-main small {
  color: var(--ink-soft);
  font-size: 12px;
}
.session-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}
.session-actions button,
.rename-form button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink-soft);
}
.session-actions button:hover {
  color: var(--teal);
  background: rgb(255 255 255 / 60%);
}
.session-actions .confirm-delete {
  color: var(--danger);
  background: var(--danger-soft);
}
.rename-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px;
}
.rename-form input {
  min-width: 0;
  width: 100%;
  padding: 8px;
  border: 1px solid var(--teal);
  font-size: 14px;
}
.privacy-note {
  margin: 20px 6px 0;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.8;
}
</style>
