<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ArrowRightIcon, ChevronDownIcon, DatabaseIcon, InfoIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { baseRegions, filterDatabaseRecords } from '@/services/statisticsService'
import type { GalleryFilters } from '@/types/statistics'
const filters = reactive<Pick<GalleryFilters, 'region' | 'population' | 'emotionType'>>({
  region: '全国',
  population: '大学生',
  emotionType: '焦虑',
})
const visibleRecords = computed(() => filterDatabaseRecords(filters))
</script>
<template>
  <section class="page database-page">
    <div class="page-inner">
      <SectionHeading
        eyebrow="心理数据数据库"
        title="每一个视角，都有清楚的口径"
        description="用时间、地区、人群与情绪四个字段组织聚合记录，理解图表背后的数据结构。"
      />
      <div class="data-note">
        <InfoIcon :size="18" />
        <p>
          当前记录为匿名化聚合数据的展示样例；来源字段与样本量用于说明结构，不代表已开展对应调查。
        </p>
      </div>
      <section class="records-section">
        <div class="records-head">
          <h2>探索数据记录</h2>
          <span>{{ visibleRecords.length }} 条匹配记录</span>
        </div>
        <div class="table-filters">
          <label
            ><span>地区</span
            ><select v-model="filters.region" data-filter="region">
              <option value="全国">全国</option>
              <option v-for="region in baseRegions" :key="region.name" :value="region.name">
                {{ region.name }}
              </option>
            </select></label
          ><label
            ><span>人群</span
            ><select v-model="filters.population">
              <option v-for="group in ['青少年', '大学生', '职场人', '老年群体']" :key="group">
                {{ group }}
              </option>
            </select></label
          ><label
            ><span>情绪</span
            ><select v-model="filters.emotionType">
              <option
                v-for="emotion in ['焦虑', '抑郁', '压力', '孤独', '睡眠困扰']"
                :key="emotion"
              >
                {{ emotion }}
              </option>
            </select></label
          >
        </div>
        <div class="table-wrap records-desktop">
          <table>
            <thead>
              <tr>
                <th>记录ID</th>
                <th>年份</th>
                <th>地区</th>
                <th>人群</th>
                <th>情绪类型</th>
                <th>关注指数</th>
                <th>样例来源</th>
                <th>样例样本量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in visibleRecords" :key="record.id">
                <td>
                  <code>{{ record.id }}</code>
                </td>
                <td>{{ record.year }}</td>
                <td>{{ record.region }}</td>
                <td>{{ record.population }}</td>
                <td>{{ record.emotionType }}</td>
                <td>
                  <strong>{{ record.riskIndex }}</strong>
                </td>
                <td>{{ record.source }}</td>
                <td>{{ record.sampleSize.toLocaleString() }}</td>
              </tr>
              <tr v-if="!visibleRecords.length">
                <td colspan="8" class="empty-row">当前筛选组合暂无匹配记录，请调整条件。</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="records-mobile">
          <details v-for="record in visibleRecords" :key="record.id" class="record-item">
            <summary>
              <span
                ><strong>{{ record.region }} · {{ record.population }}</strong
                ><small>{{ record.year }} · {{ record.emotionType }}</small></span
              ><span class="record-value">{{ record.riskIndex }}<small>关注指数</small></span
              ><ChevronDownIcon :size="18" />
            </summary>
            <dl>
              <div>
                <dt>记录ID</dt>
                <dd>{{ record.id }}</dd>
              </div>
              <div>
                <dt>年份</dt>
                <dd>{{ record.year }}</dd>
              </div>
              <div>
                <dt>地区</dt>
                <dd>{{ record.region }}</dd>
              </div>
              <div>
                <dt>人群</dt>
                <dd>{{ record.population }}</dd>
              </div>
              <div>
                <dt>情绪类型</dt>
                <dd>{{ record.emotionType }}</dd>
              </div>
              <div>
                <dt>样例来源</dt>
                <dd>{{ record.source }}</dd>
              </div>
              <div>
                <dt>样例样本量</dt>
                <dd>{{ record.sampleSize.toLocaleString() }}</dd>
              </div>
            </dl>
          </details>
          <p v-if="!visibleRecords.length" class="empty-state">
            当前筛选组合暂无匹配记录，请调整条件。
          </p>
        </div>
      </section>
      <section class="data-explanation">
        <div>
          <p class="section-kicker">理解数据结构</p>
          <h2>同一条记录，四个观察维度</h2>
          <p>个人对话与这里的群体样例分别保存，个人消息不会直接变成全国统计。</p>
          <RouterLink class="text-link" to="/gallery"
            >回到陈列馆探索 <ArrowRightIcon :size="18"
          /></RouterLink>
        </div>
        <div class="dimensions">
          <article>
            <span>01</span>
            <h3>时间</h3>
            <p>记录年份，比较不同时间的展示样例。</p>
          </article>
          <article>
            <span>02</span>
            <h3>地区</h3>
            <p>按地区组织记录，查看相关背景。</p>
          </article>
          <article>
            <span>03</span>
            <h3>人群</h3>
            <p>区分四类群体，保持比较口径清楚。</p>
          </article>
          <article>
            <span>04</span>
            <h3>情绪</h3>
            <p>标注关注主题，连接图表与支持入口。</p>
          </article>
        </div>
      </section>
      <div class="source-description">
        <DatabaseIcon :size="22" />
        <div>
          <h2>资料来源与使用方式</h2>
          <p>
            公开研究与报告用于科普框架参考；案例中心保留原文链接和核验状态。此处的展示样例用于体验筛选与可视化，不构成真实流行病学结论。
          </p>
        </div>
        <RouterLink class="text-link" to="/cases"
          >阅读公开案例 <ArrowRightIcon :size="17"
        /></RouterLink>
      </div>
    </div>
  </section>
</template>
<style scoped>
.data-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-left: 3px solid #b8cda8;
  background: #edf1e7;
  color: var(--ink-soft);
}
.data-note svg {
  flex-shrink: 0;
  margin-top: 2px;
}
.data-note p {
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
}
.records-section {
  margin-top: 36px;
}
.records-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.records-head h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}
.records-head span {
  color: var(--ink-soft);
  font-size: 12px;
}
.table-filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 12px 12px 0 0;
  background: var(--surface-muted);
}
label {
  display: grid;
  gap: 6px;
}
label span {
  color: var(--ink-soft);
  font-size: 12px;
}
select {
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  background: var(--surface);
  font-size: 16px;
}
.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-top: 0;
  border-radius: 0 0 12px 12px;
  background: var(--surface);
}
table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}
th {
  padding: 15px 16px;
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 500;
  text-align: left;
}
td {
  padding: 17px 16px;
  border-top: 1px solid var(--line);
  font-size: 14px;
}
td strong {
  color: var(--teal);
  font-weight: 500;
}
code {
  color: var(--ink-soft);
  font-size: 12px;
}
.empty-row {
  padding: 40px;
  color: var(--ink-soft);
  text-align: center;
}
.records-mobile {
  display: none;
}
.data-explanation {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 70px;
  margin-top: 64px;
  padding-top: 42px;
  border-top: 1px solid var(--line);
}
.data-explanation h2 {
  margin: 0 0 14px;
  font-size: 27px;
  font-weight: 500;
}
.data-explanation > div > p:not(.section-kicker) {
  color: var(--ink-soft);
  font-size: 16px;
}
.dimensions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.dimensions article {
  padding-left: 16px;
  border-left: 2px solid #c7dcca;
}
.dimensions span {
  color: var(--coral);
  font-size: 12px;
}
.dimensions h3 {
  margin: 8px 0 5px;
  font-size: 18px;
  font-weight: 500;
}
.dimensions p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
}
.source-description {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 52px;
  padding: 24px;
  border-radius: 14px;
  background: #edf1e7;
}
.source-description > svg {
  flex-shrink: 0;
  margin-top: 4px;
  color: var(--teal);
}
.source-description h2 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 500;
}
.source-description p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
}
.source-description > a {
  flex-shrink: 0;
  margin-left: auto;
}
@media (max-width: 767px) {
  .records-desktop {
    display: none;
  }
  .records-mobile {
    display: grid;
    gap: 12px;
    margin-top: 14px;
  }
  .table-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    padding: 14px;
    border-radius: 12px;
  }
  .table-filters label:last-child {
    grid-column: 1 / -1;
  }
  .record-item {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
  }
  .record-item summary {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 82px;
    padding: 14px;
    list-style: none;
  }
  .record-item summary > span {
    display: grid;
    gap: 3px;
  }
  .record-item strong {
    font-size: 14px;
    font-weight: 500;
  }
  .record-item small {
    color: var(--ink-soft);
    font-size: 12px;
  }
  .record-value {
    margin-left: auto;
    color: var(--teal);
    text-align: right;
    font-size: 24px;
  }
  .record-item summary > svg {
    color: var(--ink-soft);
    flex-shrink: 0;
  }
  .record-item[open] summary > svg {
    transform: rotate(180deg);
  }
  .record-item dl {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin: 0;
    padding: 16px;
    border-top: 1px solid var(--line);
  }
  dt {
    color: var(--ink-soft);
    font-size: 12px;
  }
  dd {
    margin: 3px 0 0;
    font-size: 14px;
    overflow-wrap: anywhere;
  }
  .data-explanation {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 40px;
    padding-top: 28px;
  }
  .data-explanation h2 {
    font-size: 24px;
  }
  .source-description {
    flex-wrap: wrap;
    gap: 12px;
    padding: 18px;
    margin-top: 36px;
  }
  .source-description > div {
    flex: 1;
  }
  .source-description > a {
    flex-basis: 100%;
    margin-left: 34px;
  }
}
</style>
