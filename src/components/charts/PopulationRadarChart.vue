<script setup lang="ts">
import { computed } from 'vue'
import type { PopulationRecord } from '@/types/statistics'
import BaseChart from './BaseChart.vue'
import { buildRadarOption } from './chartOptions'

const props = defineProps<{ data: PopulationRecord[]; selected: string }>()
const option = computed(() => buildRadarOption(props.data, props.selected))
</script>

<template><BaseChart :option="option" height="340px" /></template>
