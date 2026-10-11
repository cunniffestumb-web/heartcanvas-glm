<script setup lang="ts">
import OverlayPanel from '@/components/common/OverlayPanel.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import type { ConsultationSession } from '@/types/consultation'
import SessionList from './SessionList.vue'
defineProps<{ sessions: ConsultationSession[]; activeId: string; mobileOpen: boolean }>()
const emit = defineEmits<{
  new: []
  select: [id: string]
  rename: [id: string, title: string]
  delete: [id: string]
  close: []
}>()
const mobile = useMediaQuery('(max-width: 1023px)')
function select(id: string) {
  emit('select', id)
  emit('close')
}
function create() {
  emit('new')
  emit('close')
}
</script>
<template>
  <aside v-if="!mobile" class="session-panel" data-consultation-panel>
    <SessionList
      :sessions="sessions"
      :active-id="activeId"
      @new="create"
      @select="select"
      @rename="(id, title) => emit('rename', id, title)"
      @delete="(id) => emit('delete', id)"
    />
  </aside>
  <OverlayPanel v-else-if="mobileOpen" title="全部对话" placement="left" @close="emit('close')"
    ><SessionList
      :sessions="sessions"
      :active-id="activeId"
      @new="create"
      @select="select"
      @rename="(id, title) => emit('rename', id, title)"
      @delete="(id) => emit('delete', id)"
  /></OverlayPanel>
</template>
<style scoped>
.session-panel {
  width: 248px;
  min-height: 0;
  flex-shrink: 0;
  padding: 22px 14px;
  border-right: 1px solid var(--line);
  background: #f1f3ec;
}
</style>
