<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { ArrowRightIcon, InfoIcon, MapPinIcon, RotateCcwIcon } from '@lucide/vue'
import FilterBar from '@/components/common/FilterBar.vue'
import ChartSkeleton from '@/components/charts/ChartSkeleton.vue'
import { baseRegions } from '@/services/statisticsService'
import { useGalleryStore } from '@/stores/gallery'
import type { GalleryFilters } from '@/types/statistics'

const asyncChart = (loader: () => Promise<unknown>) => defineAsyncComponent({
  loader: loader as () => Promise<{ default: never }>,
  loadingComponent: ChartSkeleton,
  delay: 0,
})
const TrendLineChart = asyncChart(() => import('@/components/charts/TrendLineChart.vue'))
const ChinaRiskMap = asyncChart(() => import('@/components/charts/ChinaRiskMap.vue'))
const PopulationRadarChart = asyncChart(() => import('@/components/charts/PopulationRadarChart.vue'))
const EmotionStackedBar = asyncChart(() => import('@/components/charts/EmotionStackedBar.vue'))
const KeywordCloud = asyncChart(() => import('@/components/charts/KeywordCloud.vue'))

const store = useGalleryStore()
const contextLabel = computed(() => `${store.filters.population} · ${store.filters.emotionType}`)
const consultationLink = computed(() => ({
  path: '/consultation',
  query: {
    region: store.selectedRegion?.name || store.filters.region,
    population: store.filters.population,
    emotion: store.filters.emotionType,
  },
}))

function updateFilter(key: keyof GalleryFilters, value: GalleryFilters[keyof GalleryFilters]) {
  store.setFilter(key, value as never)
}

function selectRegion(name: string) {
  store.selectRegion(name)
  store.setFilter('region', name)
}
</script>

<template>
  <section class="page gallery-page">
    <div class="page-inner">
      <div class="page-title-row reveal">
        <div>
          <p class="page-kicker">心理数据陈列馆</p>
          <h1>看见情绪的地域与人群差异</h1>
          <p>统一筛选上下文会驱动全部图表。地图点击可进一步聚焦到省份，并把相关背景带入智能支持空间。</p>
        </div>
        <div class="demo-notice"><InfoIcon :size="16" /><span><strong>数据说明</strong> 聚合指标用于群体趋势分析，不构成医学诊断</span></div>
      </div>

      <div class="filters-row reveal delay-1">
        <FilterBar :filters="store.filters" :regions="baseRegions.map((item) => item.name)" @change="updateFilter" />
        <button class="icon-button reset-button" type="button" title="重置筛选" aria-label="重置筛选" @click="store.resetFilters"><RotateCcwIcon :size="18" /></button>
      </div>

      <div class="dashboard-grid">
        <article class="chart-card trend-card reveal delay-1" data-chart-card>
          <header><div><span>年度趋势</span><h2>多维情绪风险变化</h2></div><small>{{ contextLabel }}</small></header>
          <TrendLineChart :data="store.dataset.trends" :context="contextLabel" />
        </article>

        <article class="chart-card map-card reveal delay-2" data-chart-card>
          <header><div><span>区域分布</span><h2>全国心理风险热力图</h2></div><small>点击省份查看详情</small></header>
          <div class="map-layout">
            <ChinaRiskMap :data="store.dataset.regions" @select="selectRegion" />
            <aside v-if="store.selectedRegion" class="region-detail">
              <div class="region-name"><MapPinIcon :size="18" /><span>当前地区</span></div>
              <h3>{{ store.selectedRegion.name }}</h3>
              <div class="risk-index"><strong>{{ store.selectedRegion.riskIndex }}</strong><span>风险指数<br>{{ store.selectedRegion.level }}</span></div>
              <dl>
                <div><dt>主要情绪</dt><dd>{{ store.selectedRegion.mainEmotion }}</dd></div>
                <div><dt>建议关注</dt><dd>{{ store.selectedRegion.suggestion }}</dd></div>
              </dl>
              <RouterLink class="detail-link" :to="consultationLink">带着数据开始智能支持 <ArrowRightIcon :size="16" /></RouterLink>
            </aside>
          </div>
        </article>

        <article class="chart-card reveal" data-chart-card>
          <header><div><span>人群画像</span><h2>心理风险雷达</h2></div><small>{{ store.filters.population }}</small></header>
          <PopulationRadarChart :data="store.dataset.populations" :selected="store.filters.population" />
        </article>
        <article class="chart-card reveal delay-1" data-chart-card>
          <header><div><span>情绪构成</span><h2>不同人群分布</h2></div><small>占比指数</small></header>
          <EmotionStackedBar :data="store.dataset.emotionDistribution" />
        </article>
        <article class="chart-card reveal delay-2" data-chart-card>
          <header><div><span>文本关注</span><h2>心理关键词云</h2></div><small>{{ store.filters.emotionType }}</small></header>
          <KeywordCloud :data="store.dataset.keywords" />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-kicker { margin: 0 0 10px; color: var(--teal); font-size: 12px; font-weight: 700; }
.page-title-row { display: flex; align-items: end; justify-content: space-between; gap: 32px; margin-bottom: 26px; }
h1 { margin: 0; font-size: 42px; line-height: 1.2; }
.page-title-row > div:first-child > p:last-child { max-width: 720px; margin: 14px 0 0; color: var(--ink-soft); font-size: 14px; line-height: 1.75; }
.demo-notice { max-width: 320px; display: flex; align-items: flex-start; gap: 9px; padding: 11px 13px; border-left: 3px solid var(--gold); color: var(--ink-soft); background: var(--gold-soft); font-size: 11px; line-height: 1.55; }
.demo-notice svg { flex: 0 0 auto; }
.filters-row { display: grid; grid-template-columns: 1fr 42px; gap: 10px; margin-bottom: 18px; }
.reset-button { width: 42px; height: auto; min-height: 42px; }
.dashboard-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.chart-card { min-width: 0; padding: 20px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-sm); }
.trend-card, .map-card { grid-column: 1 / -1; }
.dashboard-grid > .chart-card:last-child { grid-column: 1 / -1; }
.chart-card header { min-height: 44px; display: flex; align-items: start; justify-content: space-between; gap: 16px; }
.chart-card header span { color: var(--teal); font-size: 10px; font-weight: 700; }
.chart-card h2 { margin: 4px 0 0; font-size: 17px; }
.chart-card header small { color: var(--ink-soft); font-size: 10px; }
.map-layout { display: grid; grid-template-columns: minmax(0, 1fr) 230px; align-items: stretch; gap: 16px; }
.region-detail { align-self: center; padding: 20px; border-left: 1px solid var(--line); }
.region-name { display: flex; align-items: center; gap: 7px; color: var(--teal); font-size: 11px; }
.region-detail h3 { margin: 8px 0 16px; font-size: 28px; }
.risk-index { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-block: 1px solid var(--line); }
.risk-index strong { color: var(--coral); font-size: 38px; }
.risk-index span { color: var(--ink-soft); font-size: 11px; line-height: 1.5; }
dl { margin: 14px 0; }
dl div { margin-bottom: 12px; }
dt { color: var(--ink-soft); font-size: 10px; }
dd { margin: 4px 0 0; font-size: 12px; line-height: 1.55; }
.detail-link { display: inline-flex; align-items: center; gap: 6px; color: var(--teal-dark); font-size: 12px; font-weight: 700; }
.reveal { animation: reveal 360ms ease both; }
.delay-1 { animation-delay: 80ms; }.delay-2 { animation-delay: 150ms; }
@keyframes reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 880px) { .page-title-row { align-items: start; flex-direction: column; } .demo-notice { max-width: none; } .dashboard-grid { grid-template-columns: 1fr; } .trend-card, .map-card, .dashboard-grid > .chart-card:last-child { grid-column: auto; } .map-layout { grid-template-columns: 1fr; } .region-detail { border-left: 0; border-top: 1px solid var(--line); } }
@media (max-width: 520px) { h1 { font-size: 32px; } .filters-row { grid-template-columns: 1fr; } .reset-button { width: 100%; height: 40px; } .chart-card { padding: 15px 10px; } }
</style>
