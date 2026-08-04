<script setup lang="ts">
import { computed, ref } from 'vue'
import { BookOpenCheckIcon, RotateCcwIcon, SearchIcon, ShieldCheckIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import CaseCard from '@/components/cases/CaseCard.vue'
import { cases } from '@/data/cases'
import { filterCases } from '@/services/caseService'

const query = ref('')
const category = ref('')
const sourceType = ref('')
const caseNature = ref('')
const loading = ref(false)
const loadError = ref('')

const categories = [...new Set(cases.map((item) => item.category))]
const sourceTypes = [...new Set(cases.map((item) => item.sourceType))]
const caseNatures = [...new Set(cases.map((item) => item.caseNature))]
const filteredCases = computed(() => filterCases(cases, {
  query: query.value,
  category: category.value,
  sourceType: sourceType.value,
  caseNature: caseNature.value,
}))
const hasFilters = computed(() => Boolean(query.value || category.value || sourceType.value || caseNature.value))

function clearFilters() {
  query.value = ''
  category.value = ''
  sourceType.value = ''
  caseNature.value = ''
}
</script>

<template>
  <section class="page cases-page">
    <div class="page-inner">
      <SectionHeading
        eyebrow="案例中心"
        title="从公开资料理解心理困扰与求助"
        description="所有案例均来自政府报告或同行评审资料，经过再次匿名化与教育性改写。案例用于科普，不替代诊断和个体化专业建议。"
      />

      <div class="trust-strip" aria-label="案例收录标准">
        <span><BookOpenCheckIcon :size="18" aria-hidden="true" />8 个公开资料案例</span>
        <span><ShieldCheckIcon :size="18" aria-hidden="true" />仅收录 A 级来源</span>
        <span>检索核验日期：2026-08-04</span>
      </div>

      <section class="filter-band" aria-label="案例筛选">
        <label class="search-field">
          <span>关键词搜索</span>
          <span class="input-wrap"><SearchIcon :size="17" aria-hidden="true" /><input v-model="query" data-case-search type="search" placeholder="搜索主题、人物或来源" /></span>
        </label>
        <label><span>主题</span><select v-model="category"><option value="">全部主题</option><option v-for="item in categories" :key="item" :value="item">{{ item }}</option></select></label>
        <label><span>来源类型</span><select v-model="sourceType"><option value="">全部来源</option><option v-for="item in sourceTypes" :key="item" :value="item">{{ item }}</option></select></label>
        <label><span>案例性质</span><select v-model="caseNature"><option value="">全部性质</option><option v-for="item in caseNatures" :key="item" :value="item">{{ item }}</option></select></label>
        <button type="button" :disabled="!hasFilters" @click="clearFilters"><RotateCcwIcon :size="16" aria-hidden="true" />清除筛选</button>
      </section>

      <div class="results-head"><p>找到 <strong>{{ filteredCases.length }}</strong> 个案例</p><p>条件核验案例会在详情页标明待核实事项</p></div>

      <div v-if="loading" class="state-panel" aria-live="polite"><span class="loader" />正在加载案例…</div>
      <div v-else-if="loadError" class="state-panel error" role="alert"><h2>案例暂时无法加载</h2><p>{{ loadError }}</p></div>
      <div v-else-if="filteredCases.length" class="case-grid">
        <CaseCard v-for="item in filteredCases" :key="item.id" :item="item" />
      </div>
      <div v-else class="state-panel empty">
        <SearchIcon :size="28" aria-hidden="true" />
        <h2>没有找到符合条件的案例</h2>
        <p>换一个关键词或清除筛选条件后再试。</p>
        <button type="button" @click="clearFilters"><RotateCcwIcon :size="16" aria-hidden="true" />清除筛选</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust-strip { display: flex; flex-wrap: wrap; gap: 22px; margin-top: 30px; padding: 18px 0; border-block: 1px solid var(--line); color: var(--ink-soft); font-size: 12px; }
.trust-strip span { display: inline-flex; align-items: center; gap: 7px; }
.trust-strip svg { color: var(--teal); }
.filter-band { display: grid; grid-template-columns: minmax(230px, 1.4fr) repeat(3, minmax(130px, .7fr)) auto; gap: 12px; align-items: end; margin: 30px 0 18px; padding: 20px; border: 1px solid var(--line); background: var(--surface-muted); }
label { display: grid; gap: 7px; min-width: 0; }
label > span:first-child { color: var(--ink-soft); font-size: 11px; font-weight: 700; }
input, select { width: 100%; height: 42px; border: 1px solid var(--line); border-radius: 5px; color: var(--ink); background: var(--surface); outline: none; }
input:focus, select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgb(21 122 115 / 12%); }
input { padding: 0 12px 0 38px; }
select { padding: 0 32px 0 11px; }
.input-wrap { position: relative; display: block; }
.input-wrap svg { position: absolute; top: 13px; left: 12px; z-index: 1; color: var(--ink-soft); }
button { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 0 14px; border: 1px solid var(--teal); border-radius: 5px; color: white; background: var(--teal); cursor: pointer; font-size: 12px; font-weight: 700; }
button:disabled { border-color: var(--line); color: var(--ink-soft); background: var(--surface); cursor: default; opacity: .65; }
.results-head { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 14px; color: var(--ink-soft); font-size: 11px; }
.results-head p { margin: 0; }.results-head strong { color: var(--teal-dark); }
.case-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.state-panel { min-height: 300px; display: grid; place-items: center; align-content: center; gap: 10px; padding: 40px; border: 1px dashed var(--line); background: var(--surface); text-align: center; }
.state-panel h2, .state-panel p { margin: 0; }.state-panel h2 { font-size: 18px; }.state-panel p { color: var(--ink-soft); font-size: 12px; }
.state-panel svg { color: var(--teal); }.state-panel button { margin-top: 8px; }
.loader { width: 26px; height: 26px; border: 3px solid var(--teal-soft); border-top-color: var(--teal); border-radius: 50%; animation: spin 700ms linear infinite; }
.error { border-color: rgb(185 64 64 / 35%); color: var(--danger); }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 1040px) { .filter-band { grid-template-columns: repeat(2, minmax(0, 1fr)); }.filter-band button { align-self: end; }.case-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .filter-band, .case-grid { grid-template-columns: 1fr; }.results-head { align-items: flex-start; flex-direction: column; }.trust-strip { display: grid; gap: 10px; } }
</style>
