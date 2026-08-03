<script setup lang="ts">
import { computed } from 'vue'
import type { TrendRow } from '@/types/statistics'
import BaseChart from './BaseChart.vue'
import { buildTrendOption } from './chartOptions'

const props = defineProps<{ data: TrendRow[]; context: string }>()
const option = computed(() => buildTrendOption(props.data, props.context))
</script>

<template><BaseChart :option="option" height="330px" /></template>
