<script setup lang="ts">
import { computed } from 'vue'
import type { KeywordRecord } from '@/types/statistics'
import BaseChart from './BaseChart.vue'
import { buildKeywordOption } from './chartOptions'

const props = defineProps<{ data: KeywordRecord[] }>()
const option = computed(() => buildKeywordOption(props.data))
</script>

<template><BaseChart :option="option" height="330px" /></template>
