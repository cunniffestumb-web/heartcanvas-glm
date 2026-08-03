<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  option: EChartsOption
  height?: string
  clickable?: boolean
}>(), {
  height: '340px',
  clickable: false,
})

const emit = defineEmits<{ chartClick: [name: string] }>()
const root = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
let observer: ResizeObserver | null = null

function render() {
  if (!chart) return
  chart.setOption(props.option, { notMerge: true, lazyUpdate: false })
}

onMounted(async () => {
  await nextTick()
  if (!root.value) return
  chart = echarts.init(root.value, undefined, { renderer: 'canvas' })
  render()
  chart.on('click', (params) => {
    if (props.clickable && typeof params.name === 'string') emit('chartClick', params.name)
  })
  observer = new ResizeObserver(() => chart?.resize())
  observer.observe(root.value)
})

watch(() => props.option, render, { deep: true })

onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.dispose()
})
</script>

<template>
  <div ref="root" class="chart-canvas" :style="{ height }" role="img" aria-label="交互式数据图表" />
</template>

<style scoped>
.chart-canvas { width: 100%; min-height: 260px; }
</style>
