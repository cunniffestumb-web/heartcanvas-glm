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
  const dataset = computed(() => getGalleryDataset(filters))
  const selectedRegion = computed(() =>
    filters.region === '全国'
      ? null
      : dataset.value.regions.find((region) => region.name === filters.region) || null,
  )
  function setFilter<K extends keyof GalleryFilters>(key: K, value: GalleryFilters[K]) {
    if (
      key === 'region' &&
      value !== '全国' &&
      !baseRegions.some((region) => region.name === value)
    )
      return
    filters[key] = value
    chartRevision.value += 1
  }
  function selectRegion(name: string) {
    if (baseRegions.some((region) => region.name === name)) setFilter('region', name)
  }
  function resetFilters() {
    Object.assign(filters, {
      year: 2025,
      region: '全国',
      population: '大学生',
      emotionType: '焦虑',
    })
    chartRevision.value += 1
  }
  return { filters, chartRevision, selectedRegion, dataset, setFilter, selectRegion, resetFilters }
})
