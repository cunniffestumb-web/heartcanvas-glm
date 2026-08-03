import type { EChartsOption } from 'echarts'
import type {
  EmotionDistributionRecord,
  KeywordRecord,
  PopulationRecord,
  RegionRecord,
  TrendRow,
} from '@/types/statistics'

const palette = ['#157a73', '#d97062', '#4b78a7', '#b48730', '#7b6fa6']
const axisLine = { lineStyle: { color: '#d9ddd7' } }
const axisLabel = { color: '#687673', fontSize: 11 }
const splitLine = { lineStyle: { color: '#e9ebe7', type: 'dashed' as const } }

const tooltip = {
  backgroundColor: 'rgba(23,38,36,.94)',
  borderWidth: 0,
  textStyle: { color: '#fff', fontSize: 12 },
  padding: [10, 12],
  extraCssText: 'border-radius:6px;box-shadow:0 12px 32px rgba(23,38,36,.18)',
}

export function shortProvinceName(name: string): string {
  return name
    .replace(/维吾尔自治区|壮族自治区|回族自治区|特别行政区|自治区|省|市$/u, '')
}

export function buildTrendOption(rows: TrendRow[], context: string): EChartsOption {
  const definitions = [
    ['焦虑', 'anxiety'],
    ['抑郁', 'depression'],
    ['压力', 'stress'],
    ['睡眠困扰', 'sleep'],
  ] as const

  return {
    color: palette,
    animationDuration: 800,
    animationEasing: 'cubicOut',
    tooltip: {
      ...tooltip,
      trigger: 'axis',
      formatter: (params: unknown) => {
        const items = params as Array<{ axisValue: string; marker: string; seriesName: string; value: number }>
        if (!items.length) return ''
        return `<strong>${items[0].axisValue} · ${context}</strong><br/>${items.map((item) => `${item.marker}${item.seriesName}：${item.value} 指数`).join('<br/>')}`
      },
    },
    legend: { top: 0, right: 0, itemWidth: 10, itemHeight: 6, textStyle: axisLabel },
    grid: { left: 10, right: 12, top: 44, bottom: 8, containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: rows.map((row) => row.year), axisLine, axisLabel },
    yAxis: { type: 'value', min: 20, max: 100, axisLine: { show: false }, axisLabel, splitLine },
    series: definitions.map(([name, key], index) => ({
      name,
      type: 'line',
      smooth: true,
      showSymbol: false,
      symbolSize: 8,
      lineStyle: { width: 3 },
      emphasis: { focus: 'series', scale: 1.4 },
      areaStyle: index === 0 ? { opacity: 0.08 } : undefined,
      data: rows.map((row) => row[key]),
    })),
  }
}

export function buildMapOption(regions: RegionRecord[]): EChartsOption {
  const values = regions.map((region) => region.riskIndex)
  return {
    animationDuration: 900,
    tooltip: {
      ...tooltip,
      trigger: 'item',
      formatter: (params: unknown) => {
        const item = params as { name: string; value?: number }
        return `<strong>${shortProvinceName(item.name)}</strong><br/>心理风险指数：${item.value ?? '暂无演示数据'}`
      },
    },
    visualMap: {
      min: Math.min(...values) - 5,
      max: Math.max(...values) + 3,
      left: 4,
      bottom: 2,
      calculable: false,
      text: ['高', '低'],
      textStyle: axisLabel,
      inRange: { color: ['#dcefeb', '#79b8ad', '#d97062'] },
    },
    series: [{
      type: 'map',
      map: 'china',
      roam: false,
      top: 10,
      bottom: 8,
      label: { show: false },
      itemStyle: { areaColor: '#e8ece7', borderColor: '#fffdf9', borderWidth: 1 },
      emphasis: {
        label: { show: true, color: '#172624', fontSize: 11 },
        itemStyle: { areaColor: '#f0c3b8', borderColor: '#d97062', borderWidth: 1.5 },
      },
      select: { itemStyle: { areaColor: '#d97062' }, label: { color: '#fff' } },
      data: regions.map((region) => ({ name: region.name, value: region.riskIndex })),
      nameProperty: 'shortName',
    }],
  }
}

export function buildRadarOption(rows: PopulationRecord[], selectedGroup: string): EChartsOption {
  const ordered = [...rows].sort((a, b) => Number(b.group === selectedGroup) - Number(a.group === selectedGroup))
  return {
    color: palette,
    animationDurationUpdate: 700,
    tooltip: { ...tooltip, trigger: 'item' },
    legend: { bottom: 0, itemWidth: 10, itemHeight: 6, textStyle: axisLabel },
    radar: {
      center: ['50%', '46%'],
      radius: '66%',
      splitNumber: 4,
      indicator: [
        { name: '焦虑', max: 100 },
        { name: '压力', max: 100 },
        { name: '睡眠困扰', max: 100 },
        { name: '社交支持不足', max: 100 },
        { name: '稳定性风险', max: 100 },
      ],
      axisName: { color: '#52615f', fontSize: 11 },
      splitArea: { areaStyle: { color: ['#fffdf9', '#f4f6f2'] } },
      splitLine: { lineStyle: { color: '#dfe4de' } },
      axisLine: { lineStyle: { color: '#dfe4de' } },
    },
    series: [{
      type: 'radar',
      symbolSize: 5,
      data: ordered.map((row) => ({
        name: row.group,
        value: [row.anxiety, row.stress, row.sleep, row.social, row.stability],
        areaStyle: { opacity: row.group === selectedGroup ? 0.22 : 0.04 },
        lineStyle: { width: row.group === selectedGroup ? 3 : 1 },
      })),
    }],
  }
}

export function buildStackedOption(rows: EmotionDistributionRecord[]): EChartsOption {
  const definitions = [
    ['焦虑', 'anxiety'],
    ['抑郁', 'depression'],
    ['压力', 'stress'],
    ['孤独', 'loneliness'],
    ['睡眠困扰', 'sleep'],
  ] as const

  return {
    color: palette,
    animationDuration: 750,
    tooltip: { ...tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, right: 0, itemWidth: 10, itemHeight: 6, textStyle: axisLabel },
    grid: { left: 8, right: 12, top: 50, bottom: 8, containLabel: true },
    xAxis: { type: 'category', data: rows.map((row) => row.group), axisLine, axisLabel },
    yAxis: { type: 'value', max: 100, axisLine: { show: false }, axisLabel, splitLine },
    series: definitions.map(([name, key]) => ({
      name,
      type: 'bar',
      stack: 'total',
      barWidth: '48%',
      emphasis: { focus: 'series' },
      data: rows.map((row) => row[key]),
    })),
  }
}

export function buildKeywordOption(rows: KeywordRecord[]): EChartsOption {
  const max = Math.max(...rows.map((word) => word.value))
  const min = Math.min(...rows.map((word) => word.value))
  const colors = ['#157a73', '#d97062', '#4b78a7', '#b48730', '#685f88']

  return {
    animationDuration: 700,
    tooltip: {
      ...tooltip,
      formatter: (params: unknown) => {
        const item = params as { name: string; value: number }
        return `<strong>${item.name}</strong><br/>关注热度：${item.value}`
      },
    },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    series: [{
      type: 'graph',
      layout: 'none',
      coordinateSystem: 'cartesian2d',
      roam: false,
      symbolSize: 1,
      itemStyle: { opacity: 0 },
      emphasis: { scale: 1.08 },
      data: rows.map((word, index) => {
        const ratio = (word.value - min) / Math.max(1, max - min)
        const column = index % 4
        const row = Math.floor(index / 4)
        return {
          name: word.name,
          value: word.value,
          x: 14 + column * 25 + (row % 2) * 4,
          y: 20 + row * 29 + (column % 2) * 7,
          label: {
            show: true,
            position: 'inside',
            color: colors[index % colors.length],
            fontSize: Math.round(13 + ratio * 18),
            fontWeight: ratio > 0.6 ? 700 : 500,
          },
        }
      }),
    }],
  }
}
