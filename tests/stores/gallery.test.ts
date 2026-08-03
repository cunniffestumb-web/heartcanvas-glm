import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { filterDatabaseRecords, getGalleryDataset } from '@/services/statisticsService'
import { useGalleryStore } from '@/stores/gallery'

describe('gallery data state', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('updates shared filters and chart revision together', () => {
    const store = useGalleryStore()

    store.setFilter('population', '大学生')
    store.setFilter('emotionType', '焦虑')

    expect(store.filters).toMatchObject({ population: '大学生', emotionType: '焦虑' })
    expect(store.chartRevision).toBe(2)
  })

  it('selects a known region and ignores an unknown region', () => {
    const store = useGalleryStore()

    store.selectRegion('北京')
    expect(store.selectedRegion).toMatchObject({ name: '北京', mainEmotion: '压力' })

    store.selectRegion('不存在的地区')
    expect(store.selectedRegion?.name).toBe('北京')
  })

  it('derives different finite values when the filter context changes', () => {
    const students = getGalleryDataset({ year: 2025, region: '全国', population: '大学生', emotionType: '焦虑' })
    const workers = getGalleryDataset({ year: 2025, region: '全国', population: '职场人', emotionType: '压力' })

    expect(students.trends.every((row) => Object.values(row).every(Number.isFinite))).toBe(true)
    expect(workers.trends.at(-1)?.stress).not.toBe(students.trends.at(-1)?.stress)
  })

  it('filters database records across region, population, and emotion', () => {
    const records = filterDatabaseRecords({ region: '北京', population: '大学生', emotionType: '焦虑' })

    expect(records.length).toBeGreaterThan(0)
    expect(records.every((record) => record.region === '北京')).toBe(true)
    expect(records.every((record) => record.population === '大学生')).toBe(true)
    expect(records.every((record) => record.emotionType === '焦虑')).toBe(true)
  })
})
