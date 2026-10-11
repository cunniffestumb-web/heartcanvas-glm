<script setup lang="ts">
import { moods, type MoodId } from '@/stores/wellbeing'
defineProps<{ modelValue: MoodId | '' }>()
defineEmits<{ 'update:modelValue': [value: MoodId] }>()
</script>
<template>
  <div class="mood-picker" role="group" aria-label="选择此刻的心情">
    <button v-for="mood in moods" :key="mood.id" :aria-pressed="modelValue === mood.id" :style="{ '--mood-color': mood.color }" @click="$emit('update:modelValue', mood.id)"><span class="mood-face" aria-hidden="true"><i></i><i></i><b>{{ mood.face }}</b></span><span>{{ mood.label }}</span><span class="mood-selected" aria-hidden="true"></span></button>
  </div>
</template>
<style scoped>
.mood-picker{display:flex;justify-content:space-between;gap:8px}.mood-picker button{display:flex;flex:1;align-items:center;flex-direction:column;gap:10px;min-width:0;padding:12px 4px 2px;border:0;background:transparent;font-size:12px;color:#6b7566}.mood-face{position:relative;display:block;width:46px;height:46px;border-radius:50%;background:color-mix(in srgb,var(--mood-color),white 50%);box-shadow:inset 0 2px 5px #ffffff99;transition:transform .2s,box-shadow .2s}.mood-face i{position:absolute;width:3px;height:4px;border-radius:50%;background:#4b5547;top:17px;left:14px}.mood-face i:nth-child(2){left:29px}.mood-face b{position:absolute;left:14px;top:16px;font-size:24px;font-weight:400;width:18px;line-height:24px;color:#4b5547}.mood-picker button[aria-pressed=true] .mood-face{transform:translateY(-9px) scale(1.16) rotate(-6deg);box-shadow:0 0 0 4px color-mix(in srgb,var(--mood-color),white 80%)}.mood-picker button:not([aria-pressed=true]):hover .mood-face{transform:translateY(-4px)}.mood-selected{width:4px;height:4px;border-radius:50%;background:transparent}.mood-picker button[aria-pressed=true] .mood-selected{background:#69866b}@media(max-width:360px){.mood-picker{gap:3px}.mood-face{width:40px;height:40px}.mood-face i{left:12px;top:14px}.mood-face i:nth-child(2){left:25px}.mood-face b{left:11px;top:14px}}
</style>
