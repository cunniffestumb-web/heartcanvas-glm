<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon, BookOpenIcon, SearchIcon, SlidersHorizontalIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import CaseCard from '@/components/cases/CaseCard.vue'
import { cases } from '@/data/cases'
import { filterCases } from '@/services/caseService'
import '@/styles/application-library.css'
const props = withDefaults(defineProps<{ application?: boolean }>(), { application: false })
const basePath = computed(() => props.application ? '/app/library' : '/cases')
const query = ref('')
const category = ref('')
const sourceType = ref('')
const caseNature = ref('')
const categories = [...new Set(cases.map((item) => item.category))]
const sourceTypes = [...new Set(cases.map((item) => item.sourceType))]
const caseNatures = [...new Set(cases.map((item) => item.caseNature))]
const filteredCases = computed(() =>
  filterCases(cases, {
    query: query.value,
    category: category.value,
    sourceType: sourceType.value,
    caseNature: caseNature.value,
  }),
)
const hasFilters = computed(() =>
  Boolean(query.value || category.value || sourceType.value || caseNature.value),
)
function clearFilters() {
  query.value = ''
  category.value = ''
  sourceType.value = ''
  caseNature.value = ''
}
</script>
<template>
  <section class="page cases-page" :class="{ 'application-library': application }">
    <div class="page-inner">
      <RouterLink v-if="application" class="library-back-link" to="/app">
        <ArrowLeftIcon :size="16" aria-hidden="true" />返回今天
      </RouterLink>
      <SectionHeading
        eyebrow="公开案例中心"
        title="读一段经历，多一个理解的视角"
        description="从公开研究和机构资料认识心理困扰与求助。每个案例保留来源、局限与核验说明，帮助你理解不同的经历。"
      />
      <div class="library-note">
        <BookOpenIcon :size="20" /><span
          >{{ cases.length }} 个公开资料案例 · 教育性改写，仅用于科普</span
        >
      </div>
      <div class="search-box">
        <SearchIcon :size="21" /><input
          v-model="query"
          data-case-search
          type="search"
          aria-label="搜索案例"
          placeholder="搜索困扰、人物或来源…"
        />
      </div>
      <div class="topic-filters" aria-label="案例主题">
        <button type="button" :class="{ active: !category }" @click="category = ''">全部主题</button
        ><button
          v-for="item in categories"
          :key="item"
          type="button"
          :class="{ active: category === item }"
          @click="category = item"
        >
          {{ item }}
        </button>
      </div>
      <details class="advanced-filters">
        <summary>
          <SlidersHorizontalIcon :size="17" />高级筛选<span
            v-if="sourceType || caseNature"
            class="filter-active"
            >已筛选</span
          >
        </summary>
        <div>
          <label
            >主题<select v-model="category">
              <option value="">全部主题</option>
              <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
            </select></label
          ><label
            >来源类型<select v-model="sourceType">
              <option value="">全部来源</option>
              <option v-for="item in sourceTypes" :key="item" :value="item">{{ item }}</option>
            </select></label
          ><label
            >案例性质<select v-model="caseNature">
              <option value="">全部性质</option>
              <option v-for="item in caseNatures" :key="item" :value="item">{{ item }}</option>
            </select></label
          >
        </div>
      </details>
      <div class="results-head">
        <p>
          找到 <strong>{{ filteredCases.length }}</strong> 个案例
        </p>
        <button v-if="hasFilters" type="button" @click="clearFilters">清除筛选</button
        ><span v-else>条件核验内容在详情中标明</span>
      </div>
      <div v-if="filteredCases.length" class="case-grid">
        <CaseCard v-for="item in filteredCases" :key="item.id" :item="item" :base-path="basePath" />
      </div>
      <div v-else class="state-panel empty">
        <SearchIcon :size="28" />
        <h2>没有找到符合条件的案例</h2>
        <p>换一个关键词，或清除筛选后再试。</p>
        <button class="button" type="button" @click="clearFilters">清除筛选</button>
      </div>
      <div class="library-footer">
        <p>阅读中想起了自己的经历？</p>
        <RouterLink class="text-link" :to="application ? '/app/chat' : '/consultation'"
          >找一个自在的空间聊聊 <ArrowRightIcon :size="18"
        /></RouterLink>
      </div>
    </div>
  </section>
</template>
<style scoped>
.library-note {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: -8px 0 28px;
  color: var(--ink-soft);
  font-size: 12px;
}
.library-note svg {
  color: var(--teal);
  flex-shrink: 0;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 8px 18px;
  border: 1px solid #cbdacf;
  border-radius: 13px;
  background: var(--surface);
}
.search-box svg {
  color: var(--teal);
  flex-shrink: 0;
}
.search-box input {
  width: 100%;
  min-height: 44px;
  padding: 6px 0;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
}
.search-box:focus-within {
  box-shadow: 0 0 0 2px var(--teal-soft);
}
.topic-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0 12px;
}
.topic-filters button {
  min-height: 44px;
  padding: 8px 15px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink-soft);
  background: transparent;
  font-size: 14px;
}
.topic-filters button.active {
  color: var(--teal-dark);
  border-color: #c4d9cc;
  background: var(--teal-soft);
}
.advanced-filters {
  border-bottom: 1px solid var(--line);
}
.advanced-filters summary {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  color: var(--ink-soft);
  font-size: 12px;
  list-style: none;
}
.filter-active {
  margin-left: auto;
  color: var(--teal);
}
.advanced-filters > div {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 12px 0 22px;
}
label {
  display: grid;
  gap: 7px;
  color: var(--ink-soft);
  font-size: 12px;
}
select {
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  background: var(--surface);
  font-size: 16px;
}
.results-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0;
  color: var(--ink-soft);
  font-size: 12px;
}
.results-head p {
  margin: 0;
}
.results-head button {
  min-height: 44px;
  padding: 7px 12px;
  border: 0;
  color: var(--teal);
  background: var(--teal-soft);
  font-size: 12px;
}
.case-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}
.state-panel {
  padding: 48px 20px;
  text-align: center;
  color: var(--ink-soft);
}
.state-panel svg {
  color: var(--teal);
}
.state-panel h2 {
  font-size: 24px;
}
.library-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 38px;
  padding: 22px 0;
  border-top: 1px solid var(--line);
}
.library-footer p {
  margin: 0;
  font-size: 16px;
}
@media (max-width: 1023px) {
  .case-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .case-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .advanced-filters > div {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .results-head > span {
    max-width: 140px;
    text-align: right;
  }
  .topic-filters {
    gap: 6px;
  }
  .topic-filters button {
    padding-inline: 11px;
  }
  .library-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
