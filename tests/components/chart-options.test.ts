import { describe, expect, it } from 'vitest'
import {
  buildKeywordOption,
  buildMapOption,
  buildRadarOption,
  buildStackedOption,
  buildTrendOption,
} from '@/components/charts/chartOptions'
import { getGalleryDataset } from '@/services/statisticsService'

const dataset = getGalleryDataset({
  year: 2025,
  region: '全国',
  population: '大学生',
  emotionType: '焦虑',
})

describe('chart option builders', () => {
  it('builds four smooth trend series with the selected context in the tooltip', () => {
    const option = buildTrendOption(dataset.trends, '大学生 · 焦虑')

    expect(option.series).toHaveLength(4)
    expect(option.tooltip).toMatchObject({ trigger: 'axis' })
    expect((option.series as Array<{ smooth?: boolean }>).every((series) => series.smooth)).toBe(true)
  })

  it('builds an interactive map scale for risk values', () => {
    const option = buildMapOption(dataset.regions)

    expect(option.visualMap).toBeTruthy()
    expect(option.series).toMatchObject([{ type: 'map', map: 'china' }])
  })

  it('builds five population risk indicators', () => {
    const option = buildRadarOption(dataset.populations, '大学生')

    expect(option.radar).toMatchObject({ indicator: expect.any(Array) })
    expect((option.radar as { indicator: unknown[] }).indicator).toHaveLength(5)
  })

  it('builds five stacked emotion series', () => {
    const option = buildStackedOption(dataset.emotionDistribution)

    expect(option.series).toHaveLength(5)
    expect((option.series as Array<{ stack?: string }>).every((series) => series.stack === 'total')).toBe(true)
  })

  it('builds a deterministic graph-based keyword cloud', () => {
    const option = buildKeywordOption(dataset.keywords)
    const series = (option.series as Array<{ type: string; data: Array<{ label: { fontSize: number } }> }>)[0]

    expect(series.type).toBe('graph')
    expect(series.data).toHaveLength(dataset.keywords.length)
    expect(series.data[0].label.fontSize).toBeGreaterThan(series.data.at(-1)!.label.fontSize)
  })
})
