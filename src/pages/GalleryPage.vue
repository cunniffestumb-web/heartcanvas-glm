<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { ArrowRightIcon, InfoIcon, RotateCcwIcon, SlidersHorizontalIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import FilterBar from '@/components/common/FilterBar.vue'
import ChartSkeleton from '@/components/charts/ChartSkeleton.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { baseRegions } from '@/services/statisticsService'
import { useGalleryStore } from '@/stores/gallery'
import type { GalleryFilters } from '@/types/statistics'
const asyncChart = (loader: () => Promise<unknown>) =>
  defineAsyncComponent({
    loader: loader as () => Promise<{ default: never }>,
    loadingComponent: ChartSkeleton,
    delay: 0,
  })
const TrendLineChart = asyncChart(() => import('@/components/charts/TrendLineChart.vue'))
const ChinaRiskMap = asyncChart(() => import('@/components/charts/ChinaRiskMap.vue'))
const PopulationRadarChart = asyncChart(
  () => import('@/components/charts/PopulationRadarChart.vue'),
)
const EmotionStackedBar = asyncChart(() => import('@/components/charts/EmotionStackedBar.vue'))
const KeywordCloud = asyncChart(() => import('@/components/charts/KeywordCloud.vue'))
const store = useGalleryStore()
const mobile = useMediaQuery('(max-width: 767px)')
const activeView = ref('trend')
const views = [
  { id: 'trend', title: '趋势' },
  { id: 'map', title: '地区' },
  { id: 'population', title: '人群' },
  { id: 'emotion', title: '情绪' },
  { id: 'keywords', title: '关键词' },
]
const contextLabel = computed(
  () =>
    `${store.filters.year} · ${store.filters.region} · ${store.filters.population} · ${store.filters.emotionType}`,
)
const consultationLink = computed(() => ({
  path: '/consultation',
  query: {
    region: store.filters.region,
    population: store.filters.population,
    emotion: store.filters.emotionType,
  },
}))
function updateFilter(key: keyof GalleryFilters, value: GalleryFilters[keyof GalleryFilters]) {
  store.setFilter(key, value as never)
}
</script>
<template>
  <section class="page gallery-page">
    <div class="page-inner">
      <SectionHeading
        eyebrow="心理数据陈列馆"
        title="从不同视角，看见情绪"
        description="探索时间、地区与人群中的情绪关注方向。选择一个视角，再带着自己的问题开始交流。"
      />
      <div class="data-note">
        <InfoIcon :size="18" /><span
          ><strong>数据说明</strong>
          当前为群体趋势展示样例，不能用于个人诊断或推断真实地区患病情况。</span
        >
      </div>
      <details class="filter-panel" :open="!mobile">
        <summary>
          <SlidersHorizontalIcon :size="18" /><span>筛选条件</span
          ><small>{{ store.filters.population }} · {{ store.filters.emotionType }}</small>
        </summary>
        <div class="filter-tools">
          <FilterBar
            :filters="store.filters"
            :regions="baseRegions.map((item) => item.name)"
            @change="updateFilter"
          /><button
            class="icon-button"
            type="button"
            aria-label="重置筛选"
            title="重置筛选"
            @click="store.resetFilters"
          >
            <RotateCcwIcon :size="18" />
          </button>
        </div>
      </details>
      <div class="view-tabs" role="tablist" aria-label="数据视角">
        <button
          v-for="view in views"
          :id="`tab-${view.id}`"
          :key="view.id"
          role="tab"
          :aria-controls="`view-${view.id}`"
          :aria-selected="activeView === view.id"
          :class="{ active: activeView === view.id }"
          type="button"
          @click="activeView = view.id"
        >
          {{ view.title }}
        </button>
      </div>
      <p class="current-context">当前视角：{{ contextLabel }}</p>
      <div class="dashboard-grid">
        <article
          v-if="!mobile || activeView === 'trend'"
          id="view-trend"
          class="chart-card trend-card"
          data-chart-card
          :role="mobile ? 'tabpanel' : undefined"
          aria-labelledby="tab-trend"
        >
          <header>
            <div>
              <p>时间变化</p>
              <h2>多维情绪关注趋势</h2>
            </div>
            <small>{{ store.filters.population }}</small>
          </header>
          <TrendLineChart :data="store.dataset.trends" :context="contextLabel" />
          <p class="chart-note">按所选年份、地区、人群与关注情绪呈现样例变化。</p>
        </article>
        <article
          v-if="!mobile || activeView === 'map'"
          id="view-map"
          class="chart-card map-card"
          data-chart-card
          :role="mobile ? 'tabpanel' : undefined"
          aria-labelledby="tab-map"
        >
          <header>
            <div>
              <p>地区探索</p>
              <h2>全国心理关注地图</h2>
            </div>
            <small>点击省份查看详情</small>
          </header>
          <div class="map-layout">
            <ChinaRiskMap
              :data="store.dataset.regions"
              :selected="store.filters.region"
              @select="store.selectRegion"
            />
            <aside class="region-detail">
              <template v-if="store.selectedRegion"
                ><p class="section-kicker">当前地区</p>
                <h3>{{ store.selectedRegion.name }}</h3>
                <div class="risk-index">
                  <strong>{{ store.selectedRegion.riskIndex }}</strong
                  ><span>样例关注指数</span>
                </div>
                <dl>
                  <div>
                    <dt>主要情绪</dt>
                    <dd>{{ store.selectedRegion.mainEmotion }}</dd>
                  </div>
                  <div>
                    <dt>建议关注</dt>
                    <dd>{{ store.selectedRegion.suggestion }}</dd>
                  </div>
                </dl></template
              ><template v-else
                ><p class="section-kicker">全国视角</p>
                <h3>34个省级地区</h3>
                <p class="national-copy">点击地图或选择地区，查看对应的群体关注背景。</p></template
              ><RouterLink class="text-link" :to="consultationLink"
                >带着问题开始交流 <ArrowRightIcon :size="17"
              /></RouterLink>
            </aside>
          </div>
          <p class="chart-note">地区值随人群与关注情绪变化；年份筛选用于上方趋势图。</p>
        </article>
        <article
          v-if="!mobile || activeView === 'population'"
          id="view-population"
          class="chart-card"
          data-chart-card
          :role="mobile ? 'tabpanel' : undefined"
          aria-labelledby="tab-population"
        >
          <header>
            <div>
              <p>人群比较</p>
              <h2>不同人群的关注方向</h2>
            </div>
            <small>{{ store.filters.population }}</small>
          </header>
          <PopulationRadarChart
            :data="store.dataset.populations"
            :selected="store.filters.population"
          />
          <p class="chart-note">固定样例对比，突出显示所选人群。</p>
        </article>
        <article
          v-if="!mobile || activeView === 'emotion'"
          id="view-emotion"
          class="chart-card"
          data-chart-card
          :role="mobile ? 'tabpanel' : undefined"
          aria-labelledby="tab-emotion"
        >
          <header>
            <div>
              <p>情绪构成</p>
              <h2>不同人群的情绪分布</h2>
            </div>
            <small>群体比较样例</small>
          </header>
          <EmotionStackedBar :data="store.dataset.emotionDistribution" />
          <p class="chart-note">固定构成样例，用于比较各人群，其他筛选不改变此图。</p>
        </article>
        <article
          v-if="!mobile || activeView === 'keywords'"
          id="view-keywords"
          class="chart-card keyword-card"
          data-chart-card
          :role="mobile ? 'tabpanel' : undefined"
          aria-labelledby="tab-keywords"
        >
          <header>
            <div>
              <p>文本关注</p>
              <h2>那些被反复提起的感受</h2>
            </div>
            <small>{{ store.filters.emotionType }}</small>
          </header>
          <KeywordCloud :data="store.dataset.keywords" />
          <p class="chart-note">按关注情绪调整关键词样例的显示权重。</p>
        </article>
      </div>
      <div class="gallery-footer">
        <span>希望进一步理解数据口径？</span
        ><RouterLink class="text-link" to="/database"
          >查看数据说明 <ArrowRightIcon :size="17"
        /></RouterLink>
      </div>
    </div>
  </section>
</template>
<style scoped>
.data-note {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 26px;
  padding: 13px 16px;
  border-left: 3px solid #b8cda8;
  color: var(--ink-soft);
  background: #edf1e7;
  font-size: 12px;
}
.data-note svg {
  flex-shrink: 0;
}
.data-note strong {
  margin-right: 7px;
  color: var(--ink);
}
.filter-panel {
  margin-bottom: 16px;
}
.filter-panel summary {
  display: none;
}
.filter-tools {
  display: flex;
  align-items: stretch;
  gap: 12px;
}
.filter-tools :deep(.filter-bar) {
  flex: 1;
  min-width: 0;
}
.filter-tools > button {
  align-self: center;
}
.view-tabs {
  display: none;
}
.current-context {
  margin: 18px 0;
  color: var(--ink-soft);
  font-size: 12px;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}
.chart-card {
  min-width: 0;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
}
.trend-card,
.map-card,
.keyword-card {
  grid-column: 1 / -1;
}
.chart-card header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  min-height: 68px;
}
.chart-card header p {
  margin: 0 0 5px;
  color: var(--teal);
  font-size: 12px;
}
.chart-card h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}
.chart-card header small {
  color: var(--ink-soft);
  font-size: 12px;
}
.chart-note {
  margin: 16px 0 0;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.8;
}
.map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 245px;
  align-items: center;
  gap: 28px;
}
.region-detail {
  padding-left: 24px;
  border-left: 1px solid var(--line);
}
.region-detail h3 {
  margin: 0 0 16px;
  font-size: 25px;
  font-weight: 500;
}
.risk-index {
  display: grid;
  gap: 2px;
  padding: 14px 0;
  border-block: 1px solid var(--line);
}
.risk-index strong {
  color: var(--coral);
  font-size: 40px;
  font-weight: 500;
}
.risk-index span,
dt {
  color: var(--ink-soft);
  font-size: 12px;
}
dl {
  margin: 16px 0;
}
dl > div {
  margin-bottom: 12px;
}
dd {
  margin: 5px 0 0;
  font-size: 14px;
}
.national-copy {
  color: var(--ink-soft);
  font-size: 14px;
}
.gallery-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 28px;
  font-size: 14px;
  color: var(--ink-soft);
}
@media (max-width: 767px) {
  .data-note {
    margin-bottom: 18px;
  }
  .filter-panel {
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--surface);
  }
  .filter-panel summary {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: 48px;
    padding: 11px 14px;
    font-size: 14px;
    list-style: none;
  }
  .filter-panel summary small {
    margin-left: auto;
    color: var(--ink-soft);
    font-size: 12px;
  }
  .filter-tools {
    padding: 0 10px 12px;
    gap: 7px;
  }
  .filter-tools :deep(.filter-bar) {
    padding: 8px;
    border: 0;
  }
  .view-tabs {
    display: flex;
    gap: 4px;
    padding: 4px;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--surface-muted);
  }
  .view-tabs button {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 7px 4px;
    border: 0;
    color: var(--ink-soft);
    background: transparent;
    font-size: 12px;
    white-space: nowrap;
  }
  .view-tabs button.active {
    color: var(--teal-dark);
    background: var(--surface);
    box-shadow: var(--shadow-sm);
  }
  .dashboard-grid {
    display: block;
  }
  .chart-card {
    padding: 18px 12px;
  }
  .chart-card header {
    min-height: 72px;
    gap: 8px;
  }
  .chart-card h2 {
    font-size: 18px;
  }
  .chart-card header small {
    max-width: 100px;
    text-align: right;
  }
  .map-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .region-detail {
    padding: 20px 4px 0;
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .map-layout :deep(.chart-canvas) {
    height: 330px !important;
  }
  .gallery-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 0;
  }
  .current-context {
    line-height: 1.8;
  }
}
</style>
