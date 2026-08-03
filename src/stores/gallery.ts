import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { baseRegions, getGalleryDataset } from '@/services/statisticsService'
import type { GalleryFilters } from '@/types/statistics'

export const useGalleryStore = defineStore('gallery', () => {
  const filters = reactive<GalleryFilters>({
    year: 2025,
    region: '全国',
    population: '大学生',
    emotionType: '焦虑',
  })
  const chartRevision = ref(0)
  const selectedRegionName = ref('北京')
  const selectedRegion = computed(() => baseRegions.find((region) => region.name === selectedRegionName.value))
  const dataset = computed(() => getGalleryDataset(filters))

  function setFilter<K extends keyof GalleryFilters>(key: K, value: GalleryFilters[K]) {
    filters[key] = value
    chartRevision.value += 1
  }

  function selectRegion(name: string) {
    if (!baseRegions.some((region) => region.name === name)) return
    selectedRegionName.value = name
    chartRevision.value += 1
  }

  function resetFilters() {
    Object.assign(filters, { year: 2025, region: '全国', population: '大学生', emotionType: '焦虑' })
    selectedRegionName.value = '北京'
    chartRevision.value += 1
  }

  return { filters, chartRevision, selectedRegion, dataset, setFilter, selectRegion, resetFilters }
})
