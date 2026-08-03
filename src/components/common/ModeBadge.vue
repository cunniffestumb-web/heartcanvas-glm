<script setup lang="ts">
import { CircleIcon } from '@lucide/vue'
defineProps<{ mode: 'online' | 'mock' }>()
</script>

<template><span class="mode-badge" :data-mode="mode"><CircleIcon :size="7" fill="currentColor" />{{ mode === 'online' ? 'DeepSeek 在线模式' : '演示模式' }}</span></template>

<style scoped>
.mode-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 9px; border-radius: 5px; color: var(--gold); background: var(--gold-soft); font-size: 10px; font-weight: 700; }
.mode-badge[data-mode="online"] { color: var(--teal-dark); background: var(--teal-soft); }
</style>
