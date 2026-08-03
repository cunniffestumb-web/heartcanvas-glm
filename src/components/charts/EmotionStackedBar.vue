<script setup lang="ts">
import { computed } from 'vue'
import type { EmotionDistributionRecord } from '@/types/statistics'
import BaseChart from './BaseChart.vue'
import { buildStackedOption } from './chartOptions'

const props = defineProps<{ data: EmotionDistributionRecord[] }>()
const option = computed(() => buildStackedOption(props.data))
</script>

<template><BaseChart :option="option" height="330px" /></template>
