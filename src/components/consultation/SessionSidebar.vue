<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { CheckIcon, MessageCirclePlusIcon, MessagesSquareIcon, PencilIcon, Trash2Icon, XIcon } from '@lucide/vue'
import type { ConsultationSession } from '@/types/consultation'

defineProps<{ sessions: ConsultationSession[]; activeId: string; mobileOpen: boolean }>()
const emit = defineEmits<{
  new: []
  select: [id: string]
  rename: [id: string, title: string]
  delete: [id: string]
  close: []
}>()

const editingId = ref('')
const editingTitle = ref('')
const input = ref<HTMLInputElement>()
const deletingId = ref('')

function relativeTime(value: string) {
  const date = new Date(value)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

async function edit(session: ConsultationSession) {
  editingId.value = session.id
  editingTitle.value = session.title
  await nextTick()
  input.value?.focus()
  input.value?.select()
}

function saveEdit() {
  if (!editingId.value) return
  emit('rename', editingId.value, editingTitle.value)
  editingId.value = ''
}

function select(id: string) {
  emit('select', id)
  emit('close')
}
</script>

<template>
  <aside class="session-panel" :class="{ open: mobileOpen }" data-consultation-panel>
    <div class="mobile-panel-head"><strong>全部对话</strong><button type="button" aria-label="关闭会话列表" @click="emit('close')"><XIcon :size="18" /></button></div>
    <button class="new-session" type="button" @click="emit('new'); emit('close')"><MessageCirclePlusIcon :size="17" />新建对话</button>
    <p class="panel-label"><MessagesSquareIcon :size="14" />历史对话</p>
    <div class="session-list">
      <div v-for="session in sessions" :key="session.id" class="session-row" :class="{ active: session.id === activeId }">
        <form v-if="editingId === session.id" class="rename-form" @submit.prevent="saveEdit">
          <input ref="input" v-model="editingTitle" maxlength="30" aria-label="对话名称" @blur="saveEdit" />
          <button type="submit" title="保存名称" aria-label="保存名称"><CheckIcon :size="14" /></button>
        </form>
        <template v-else>
          <button class="session-main" type="button" @click="select(session.id)"><span>{{ session.title }}</span><small>{{ relativeTime(session.updatedAt) }}</small></button>
          <div class="session-actions">
            <button type="button" title="重命名" aria-label="重命名对话" @click="edit(session)"><PencilIcon :size="13" /></button>
            <button v-if="deletingId !== session.id" type="button" title="删除" aria-label="删除对话" @click="deletingId = session.id"><Trash2Icon :size="13" /></button>
            <button v-else class="confirm-delete" type="button" title="确认删除" aria-label="确认删除对话" @click="emit('delete', session.id); deletingId = ''"><CheckIcon :size="13" /></button>
          </div>
        </template>
      </div>
    </div>
    <p class="privacy-note">对话保存在此设备，你可以随时改名或删除。</p>
  </aside>
  <button v-if="mobileOpen" class="drawer-backdrop" type="button" aria-label="关闭会话列表" @click="emit('close')"></button>
</template>

<style scoped>
.session-panel { min-height: 0; display: flex; flex-direction: column; padding: 14px; border-right: 1px solid var(--line); background: #f0f0eb; }
.mobile-panel-head { display: none; align-items: center; justify-content: space-between; margin-bottom: 12px; }.mobile-panel-head button, .session-actions button, .rename-form button { display: grid; place-items: center; padding: 0; border: 0; color: var(--ink-soft); background: transparent; cursor: pointer; }
.new-session { width: 100%; min-height: 42px; display: flex; align-items: center; justify-content: center; gap: 7px; border: 0; border-radius: 6px; color: white; background: var(--teal); cursor: pointer; font-weight: 700; }
.panel-label { display: flex; align-items: center; gap: 6px; margin: 22px 7px 9px; color: var(--ink-soft); font-size: 10px; }.session-list { min-height: 0; display: grid; align-content: start; gap: 4px; overflow-y: auto; }
.session-row { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; border-radius: 5px; color: var(--ink-soft); }.session-row.active { color: var(--teal-dark); background: var(--surface); box-shadow: var(--shadow-sm); }
.session-main { min-width: 0; display: grid; gap: 4px; padding: 10px; border: 0; text-align: left; color: inherit; background: transparent; cursor: pointer; }.session-main span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }.session-main small { font-size: 8px; opacity: .75; }
.session-actions { display: flex; gap: 2px; padding-right: 6px; opacity: 0; }.session-row:hover .session-actions, .session-row:focus-within .session-actions { opacity: 1; }.session-actions button { width: 24px; height: 24px; border-radius: 4px; }.session-actions button:hover { color: var(--teal); background: var(--teal-soft); }.session-actions .confirm-delete { color: var(--danger); background: var(--danger-soft); }
.rename-form { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 26px; gap: 4px; padding: 6px; }.rename-form input { width: 100%; min-width: 0; padding: 7px; border: 1px solid var(--teal); border-radius: 4px; background: var(--surface); }.rename-form button { border-radius: 4px; background: var(--teal-soft); }
.privacy-note { margin: auto 7px 0; padding-top: 22px; color: var(--ink-soft); font-size: 9px; line-height: 1.6; }
.drawer-backdrop { display: none; }
@media (max-width: 1000px) {
  .session-panel { position: fixed; z-index: 150; inset: 0 auto 0 0; width: min(86vw, 320px); transform: translateX(-105%); transition: transform 220ms ease; box-shadow: var(--shadow-md); }.session-panel.open { transform: translateX(0); }.mobile-panel-head { display: flex; }.drawer-backdrop { position: fixed; z-index: 145; inset: 0; display: block; border: 0; background: rgb(23 38 36 / 35%); }
  .session-actions { opacity: 1; }
}
</style>
