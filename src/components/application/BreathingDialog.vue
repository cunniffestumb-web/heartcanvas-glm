<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { PauseIcon, PlayIcon, RotateCcwIcon } from '@lucide/vue'
import OverlayPanel from '@/components/common/OverlayPanel.vue'
defineEmits<{ close: [] }>()
const elapsed = ref(0)
const running = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
const finished = computed(() => elapsed.value >= 60)
const phase = computed(() => finished.value ? '把轻松带回此刻' : !running.value && elapsed.value === 0 ? '准备好，就开始' : elapsed.value % 10 < 4 ? '慢慢吸气' : '轻轻呼气')
const expanding = computed(() => running.value && elapsed.value % 10 < 4)
function stop() { running.value = false; if (timer) clearInterval(timer); timer = undefined }
function start() {
  if (finished.value) elapsed.value = 0
  running.value = true
  timer = setInterval(() => { elapsed.value++; if (finished.value) stop() }, 1000)
}
function reset() { stop(); elapsed.value = 0 }
onBeforeUnmount(stop)
</script>
<template>
  <OverlayPanel title="给自己一分钟" @close="$emit('close')">
    <div class="breathing-practice">
      <p>暂时放下手里的事，跟着自己的节奏。</p>
      <div class="breathing-visual" :class="{ expanding }"><div><span>{{ phase }}</span><small>{{ finished ? '练习完成' : `${60 - elapsed} 秒` }}</small></div></div>
      <p class="breathing-hint">{{ finished ? '谢谢你，愿意留一点时间照顾自己。' : '吸气 4 秒 · 呼气 6 秒 · 无需屏住呼吸' }}</p>
      <div class="breathing-actions"><button class="button primary" @click="running ? stop() : start()"><PauseIcon v-if="running" :size="17"/><PlayIcon v-else :size="17"/>{{ running ? '暂停' : finished ? '再做一次' : elapsed ? '继续' : '开始练习' }}</button><button class="icon-button" aria-label="重新开始呼吸练习" @click="reset"><RotateCcwIcon :size="18"/></button></div>
      <small>以舒适为准，不必用力；随时可以暂停。</small>
    </div>
  </OverlayPanel>
</template>
<style scoped>
.breathing-practice{text-align:center;padding:4px 0 18px}.breathing-practice>p{color:var(--ink-soft);font-size:14px}.breathing-visual{display:grid;place-items:center;width:240px;height:240px;margin:30px auto;border-radius:50%;background:#e5eddf70;border:1px solid #d6e1cc}.breathing-visual>div{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#fff7dd,#c6d9ba);transition:transform 6s ease-in-out;box-shadow:0 0 40px #becfad30}.breathing-visual.expanding>div{transform:scale(1.22);transition-duration:4s}.breathing-visual span{font-size:19px}.breathing-visual small{color:#53674c}.breathing-actions{display:flex;justify-content:center;gap:10px;margin:22px 0}.breathing-practice>small{color:var(--ink-soft);font-size:12px}@media(prefers-reduced-motion:reduce){.breathing-visual>div{transition:none;transform:none!important}}
</style>
