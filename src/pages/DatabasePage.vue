<script setup lang="ts">
import { computed, reactive } from 'vue'
import { BracesIcon, DatabaseIcon, FileCheck2Icon, FilterIcon, LockKeyholeIcon, ScanSearchIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { baseRegions, filterDatabaseRecords } from '@/services/statisticsService'
import type { GalleryFilters } from '@/types/statistics'

const filters = reactive<Pick<GalleryFilters, 'region' | 'population' | 'emotionType'>>({
  region: '全国',
  population: '大学生',
  emotionType: '焦虑',
})
const visibleRecords = computed(() => filterDatabaseRecords(filters))

const pipeline = [
  ['01', '数据采集', '报告、问卷与开放文本'],
  ['02', '清洗脱敏', '去标识化与质量筛查'],
  ['03', '字段抽取', 'BERT 类模型提取实体'],
  ['04', '标签归档', '时间、地域、人群、情绪'],
  ['05', '智能应用', '图表联动与咨询背景'],
]
</script>

<template>
  <section class="page database-page">
    <div class="page-inner">
      <div class="page-intro">
        <SectionHeading eyebrow="心理数据数据库" title="从原始信号到可解释上下文" description="通过匿名化聚合数据呈现心理健康趋势，在隐私保护与可解释分析之间建立清晰边界。" />
        <div class="database-seal"><LockKeyholeIcon :size="20" /><span>隐私优先<br><small>清洗 · 脱敏 · 分级访问</small></span></div>
      </div>

      <section class="source-band">
        <article><DatabaseIcon :size="22" /><h3>公开报告</h3><p>官方心理健康报告与公开研究摘要，用于指标框架参考。</p></article>
        <article><FileCheck2Icon :size="22" /><h3>匿名化问卷</h3><p>仅保留群体、情绪与风险字段，移除可识别个人的信息。</p></article>
        <article><ScanSearchIcon :size="22" /><h3>文本分析</h3><p>提取开放情绪文本的群体趋势，不呈现个人原始内容。</p></article>
        <article><BracesIcon :size="22" /><h3>多源融合</h3><p>统一报告、问卷与文本结构，为跨维度分析提供一致口径。</p></article>
      </section>

      <section class="pipeline-section">
        <SectionHeading eyebrow="处理链路" title="五步数据治理流程" description="每一步都保留可追踪边界，为图表与咨询上下文提供一致的数据契约。" />
        <div class="pipeline">
          <article v-for="item in pipeline" :key="item[0]"><span>{{ item[0] }}</span><h3>{{ item[1] }}</h3><p>{{ item[2] }}</p></article>
        </div>
      </section>

      <section class="taxonomy-section">
        <div><p class="section-kicker">四维标签体系</p><h2>同一条数据，从四个视角被理解</h2></div>
        <div class="taxonomy"><span>时间<small>2020—2025</small></span><span>地域<small>全国与省级</small></span><span>人群<small>四类重点群体</small></span><span>情绪<small>五类关注方向</small></span></div>
      </section>

      <section class="records-section">
        <div class="records-head">
          <div><p class="section-kicker">数据记录</p><h2>可筛选聚合数据表</h2></div>
          <span class="demo-label">筛选结果 · {{ visibleRecords.length }} 条</span>
        </div>
        <div class="table-filters">
          <FilterIcon :size="18" />
          <label><span>地区</span><select v-model="filters.region" data-filter="region"><option value="全国">全国</option><option v-for="region in baseRegions" :key="region.name" :value="region.name">{{ region.name }}</option></select></label>
          <label><span>人群</span><select v-model="filters.population"><option v-for="group in ['青少年','大学生','职场人','老年群体']" :key="group">{{ group }}</option></select></label>
          <label><span>情绪</span><select v-model="filters.emotionType"><option v-for="emotion in ['焦虑','抑郁','压力','孤独','睡眠困扰']" :key="emotion">{{ emotion }}</option></select></label>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>记录 ID</th><th>年份</th><th>地区</th><th>人群</th><th>情绪类型</th><th>风险指数</th><th>来源</th><th>样本量</th></tr></thead>
            <tbody>
              <tr v-for="record in visibleRecords" :key="record.id"><td><code>{{ record.id }}</code></td><td>{{ record.year }}</td><td>{{ record.region }}</td><td>{{ record.population }}</td><td>{{ record.emotionType }}</td><td><strong>{{ record.riskIndex }}</strong></td><td>{{ record.source }}</td><td>{{ record.sampleSize.toLocaleString() }}</td></tr>
              <tr v-if="visibleRecords.length === 0"><td colspan="8" class="empty-row">当前筛选组合暂无匹配记录，请调整条件。</td></tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </section>
</template>

<style scoped>
.page-intro { display: flex; align-items: start; justify-content: space-between; gap: 32px; }
.database-seal { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius); color: var(--teal-dark); background: var(--surface); font-size: 12px; font-weight: 700; }
.database-seal small { color: var(--ink-soft); font-size: 9px; font-weight: 400; }
.source-band { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; border: 1px solid var(--line); background: var(--line); }
.source-band article { min-height: 190px; padding: 22px; background: var(--surface); }
.source-band svg { color: var(--teal); }
.source-band h3 { margin: 34px 0 8px; font-size: 16px; }
.source-band p, .pipeline p { margin: 0; color: var(--ink-soft); font-size: 12px; line-height: 1.7; }
.pipeline-section, .records-section { padding-top: 72px; }
.pipeline { display: grid; grid-template-columns: repeat(5, 1fr); border-block: 1px solid var(--line); }
.pipeline article { position: relative; min-height: 150px; padding: 22px 18px; border-right: 1px solid var(--line); }
.pipeline article:last-child { border-right: 0; }
.pipeline span, .section-kicker { color: var(--coral); font-size: 10px; font-weight: 700; }
.pipeline h3 { margin: 24px 0 8px; font-size: 15px; }
.taxonomy-section { display: grid; grid-template-columns: .8fr 1.2fr; gap: 64px; align-items: center; margin-top: 72px; padding: 42px; border: 1px solid var(--line); background: var(--surface-muted); }
.taxonomy-section h2, .records-head h2 { margin: 7px 0 0; font-size: 27px; line-height: 1.3; }
.taxonomy { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.taxonomy > span { display: grid; gap: 5px; padding: 16px; border-left: 3px solid var(--teal); background: var(--surface); font-size: 14px; font-weight: 700; }
.taxonomy small { color: var(--ink-soft); font-size: 10px; font-weight: 400; }
.records-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 18px; }
.demo-label { padding: 7px 10px; border-radius: 5px; color: var(--gold); background: var(--gold-soft); font-size: 10px; font-weight: 700; }
.table-filters { display: flex; align-items: end; gap: 10px; padding: 12px; border: 1px solid var(--line); border-bottom: 0; background: var(--surface-muted); }
.table-filters > svg { align-self: center; margin: 0 4px; color: var(--teal); }
.table-filters label { min-width: 150px; display: grid; gap: 4px; }
.table-filters label span { color: var(--ink-soft); font-size: 9px; }
select { min-height: 36px; padding: 0 10px; border: 1px solid var(--line); border-radius: 5px; background: #fff; }
.table-wrap { overflow-x: auto; border: 1px solid var(--line); background: var(--surface); }
table { width: 100%; min-width: 880px; border-collapse: collapse; font-size: 12px; }
th { padding: 12px 14px; text-align: left; color: var(--ink-soft); background: #f4f5f1; font-size: 10px; }
td { padding: 14px; border-top: 1px solid var(--line); }
td code { color: var(--teal-dark); } td strong { color: var(--coral); }
.empty-row { padding: 36px; text-align: center; color: var(--ink-soft); }
@media (max-width: 900px) { .source-band { grid-template-columns: repeat(2, 1fr); } .pipeline { grid-template-columns: 1fr; } .pipeline article { min-height: auto; border-right: 0; border-bottom: 1px solid var(--line); } .taxonomy-section { grid-template-columns: 1fr; gap: 28px; } }
@media (max-width: 620px) { .page-intro, .records-head { flex-direction: column; align-items: start; } .source-band { grid-template-columns: 1fr; } .taxonomy-section { padding: 24px 18px; } .taxonomy { grid-template-columns: 1fr; } .table-filters { align-items: stretch; flex-direction: column; } .table-filters label { width: 100%; } }
</style>
