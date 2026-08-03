<script setup lang="ts">
import { computed } from 'vue'
import * as echarts from 'echarts'
import type { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes.js'
import chinaGeoJson from '@/assets/china.geo.json'
import type { RegionRecord } from '@/types/statistics'
import BaseChart from './BaseChart.vue'
import { buildMapOption, shortProvinceName } from './chartOptions'

const props = defineProps<{ data: RegionRecord[] }>()
const emit = defineEmits<{ select: [name: string] }>()

const geo = {
  ...chinaGeoJson,
  features: chinaGeoJson.features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      shortName: shortProvinceName(feature.properties.name),
    },
  })),
}
echarts.registerMap('china', geo as GeoJSONSourceInput)

const option = computed(() => buildMapOption(props.data))
</script>

<template><BaseChart :option="option" height="410px" clickable @chart-click="emit('select', shortProvinceName($event))" /></template>
