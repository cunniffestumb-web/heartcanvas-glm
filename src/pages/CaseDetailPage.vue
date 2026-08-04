<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, ArrowRightIcon, BookOpenIcon, CalendarDaysIcon, ExternalLinkIcon, ShieldAlertIcon, ShieldCheckIcon } from '@lucide/vue'
import { cases } from '@/data/cases'
import { getCaseBySlug, getRelatedCases } from '@/services/caseService'

const route = useRoute()
const item = computed(() => getCaseBySlug(cases, String(route.params.slug ?? '')))
const relatedCases = computed(() => item.value ? getRelatedCases(cases, item.value) : [])
</script>

<template>
  <section class="page case-detail-page">
    <div v-if="item" class="page-inner">
      <RouterLink class="back-link" to="/cases"><ArrowLeftIcon :size="16" aria-hidden="true" />返回案例列表</RouterLink>

      <header class="case-hero">
        <div class="hero-main">
          <div class="badges"><span>{{ item.category }}</span><span>{{ item.caseNature }}</span><span :class="{ pending: item.verificationStatus === '条件核验' }">{{ item.verificationStatus }}</span></div>
          <h1>{{ item.title }}</h1>
          <p>{{ item.summary }}</p>
          <div class="hero-facts"><span>{{ item.alias }} · {{ item.ageRange }}</span><span><BookOpenIcon :size="15" />{{ item.readingTime }} 分钟阅读</span><span><CalendarDaysIcon :size="15" />更新于 {{ item.updatedAt }}</span></div>
        </div>
        <div class="source-stamp"><ShieldCheckIcon :size="24" aria-hidden="true" /><strong>来源可靠性 {{ item.sourceReliability }}</strong><span>{{ item.sourceOrganization }}</span></div>
      </header>

      <div class="case-layout">
        <article class="case-content">
          <section><span class="section-no">01</span><h2>案例背景</h2><p>{{ item.background }}</p></section>
          <section><span class="section-no">02</span><h2>主要困扰</h2><p>{{ item.mainConcern }}</p></section>
          <section>
            <span class="section-no">03</span><h2>情绪和行为表现</h2>
            <div class="sign-grid"><div><h3>情绪表现</h3><ul><li v-for="sign in item.emotionalSigns" :key="sign">{{ sign }}</li></ul></div><div><h3>行为与身体表现</h3><ul><li v-for="sign in item.behavioralSigns" :key="sign">{{ sign }}</li></ul></div></div>
          </section>
          <section><span class="section-no">04</span><h2>形成背景</h2><p>{{ item.context }}</p></section>
          <section><span class="section-no">05</span><h2>求助过程</h2><p>{{ item.helpSeekingProcess }}</p><h3>专业支持</h3><p>{{ item.professionalSupport }}</p></section>
          <section><span class="section-no">06</span><h2>应对方法</h2><ul><li v-for="method in item.copingMethods" :key="method">{{ method }}</li></ul></section>
          <section><span class="section-no">07</span><h2>后续变化</h2><p>{{ item.outcome }}</p></section>
          <section><span class="section-no">08</span><h2>科普启示</h2><ul class="takeaways"><li v-for="takeaway in item.educationalTakeaways" :key="takeaway">{{ takeaway }}</li></ul></section>
          <section><span class="section-no">09</span><h2>案例局限</h2><p>{{ item.limitations }}</p></section>
          <section class="source-section">
            <span class="section-no">10</span><h2>来源与参考资料</h2>
            <dl>
              <div><dt>来源机构</dt><dd>{{ item.sourceOrganization }}</dd></div>
              <div><dt>原文标题</dt><dd>{{ item.sourceTitle }}</dd></div>
              <div><dt>作者</dt><dd>{{ item.sourceAuthor }}</dd></div>
              <div><dt>来源类型</dt><dd>{{ item.sourceType }}</dd></div>
              <div><dt>发布日期</dt><dd>{{ item.sourcePublishedAt }}</dd></div>
              <div><dt>访问日期</dt><dd>{{ item.sourceAccessedAt }}</dd></div>
              <div><dt>核验状态</dt><dd>{{ item.verificationStatus }}</dd></div>
            </dl>
            <a data-source-link :href="item.sourceUrl" target="_blank" rel="noopener noreferrer">阅读原始资料<ExternalLinkIcon :size="16" aria-hidden="true" /></a>
            <p class="copyright">{{ item.copyrightNote }}</p>
          </section>
          <section><span class="section-no">11</span><h2>隐私说明</h2><p>{{ item.privacyNote }}</p><p class="case-status">案例真实性说明：{{ item.realCaseStatus }}</p></section>
          <section class="disclaimer"><span class="section-no">12</span><h2>免责声明</h2><p>本案例仅用于心理健康科普，不能替代医生诊断、心理治疗或个体化建议。案例中的表现与应对方式不应被用于自行诊断。若你或身边的人正处于紧急危险中，请立即联系当地急救、公安机关或可获得的专业危机支持。</p></section>
        </article>

        <aside class="case-aside">
          <section><h2>案例信息</h2><dl><div><dt>性质</dt><dd>{{ item.caseNature }}</dd></div><div><dt>核验</dt><dd>{{ item.verificationStatus }}</dd></div><div><dt>风险说明</dt><dd>{{ item.riskLevel }}</dd></div></dl></section>
          <section v-if="item.verificationStatus === '条件核验'" class="verification-note"><ShieldAlertIcon :size="20" aria-hidden="true" /><div><h2>仍需人工核验</h2><p>{{ item.limitations }}</p></div></section>
        </aside>
      </div>

      <section class="related-section">
        <div><p>继续阅读</p><h2>相关推荐</h2></div>
        <div class="related-grid">
          <RouterLink v-for="related in relatedCases" :key="related.id" :to="`/cases/${related.slug}`">
            <span>{{ related.category }}</span><h3>{{ related.title }}</h3><small>{{ related.readingTime }} 分钟阅读</small><ArrowRightIcon :size="17" aria-hidden="true" />
          </RouterLink>
        </div>
      </section>
    </div>

    <div v-else class="page-inner not-found" role="alert">
      <ShieldAlertIcon :size="34" aria-hidden="true" />
      <h1>没有找到这个案例</h1>
      <p>案例可能已被移除，或当前链接不完整。</p>
      <RouterLink to="/cases"><ArrowLeftIcon :size="16" aria-hidden="true" />返回案例列表</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.back-link { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 24px; color: var(--teal-dark); font-size: 12px; font-weight: 700; }
.case-hero { display: grid; grid-template-columns: minmax(0, 1fr) 240px; gap: 60px; align-items: end; padding: 24px 0 38px; border-bottom: 1px solid var(--line); }
.badges { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
.badges span { padding: 5px 8px; border-radius: 4px; color: var(--teal-dark); background: var(--teal-soft); font-size: 10px; font-weight: 700; }
.badges span:nth-child(2) { color: #755319; background: var(--gold-soft); }.badges .pending { color: #8a3e34; background: var(--coral-soft); }
.hero-main h1 { max-width: 830px; margin: 0; font-size: 36px; line-height: 1.35; }
.hero-main > p { max-width: 820px; margin: 18px 0; color: var(--ink-soft); font-size: 15px; line-height: 1.85; }
.hero-facts { display: flex; flex-wrap: wrap; gap: 18px; color: var(--ink-soft); font-size: 11px; }.hero-facts span { display: inline-flex; align-items: center; gap: 6px; }
.source-stamp { display: grid; gap: 7px; padding-left: 18px; border-left: 3px solid var(--teal); }.source-stamp svg { color: var(--teal); }.source-stamp strong { font-size: 14px; }.source-stamp span { color: var(--ink-soft); font-size: 11px; line-height: 1.6; }
.case-layout { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 64px; align-items: start; padding-top: 24px; }
.case-content > section { position: relative; padding: 34px 0 34px 52px; border-bottom: 1px solid var(--line); }
.section-no { position: absolute; top: 38px; left: 0; color: var(--coral); font: 700 11px/1.4 monospace; }
.case-content h2 { margin: 0 0 16px; font-size: 21px; }.case-content h3 { margin: 22px 0 10px; font-size: 14px; }
.case-content p, .case-content li { color: var(--ink-soft); font-size: 14px; line-height: 1.95; }.case-content p { margin: 0; }.case-content ul { display: grid; gap: 7px; margin: 0; padding-left: 20px; }
.sign-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px; }.sign-grid h3 { margin-top: 0; color: var(--teal-dark); }
.takeaways { padding: 0 !important; list-style: none; counter-reset: takeaway; }.takeaways li { position: relative; padding: 13px 16px 13px 48px; border-left: 2px solid var(--teal); background: var(--teal-soft); counter-increment: takeaway; }.takeaways li::before { content: counter(takeaway); position: absolute; left: 18px; color: var(--teal-dark); font-weight: 700; }
.source-section dl { display: grid; gap: 0; margin: 0 0 20px; border-top: 1px solid var(--line); }.source-section dl div { display: grid; grid-template-columns: 110px 1fr; gap: 18px; padding: 11px 0; border-bottom: 1px solid var(--line); font-size: 12px; line-height: 1.7; }.source-section dt { color: var(--ink-soft); }.source-section dd { margin: 0; overflow-wrap: anywhere; }
.source-section > a { display: inline-flex; align-items: center; gap: 7px; min-height: 40px; padding: 0 14px; border-radius: 5px; color: white; background: var(--teal); font-size: 12px; font-weight: 700; }.copyright { margin-top: 14px !important; font-size: 11px !important; }
.case-status { margin-top: 12px !important; color: var(--ink) !important; font-weight: 700; }.disclaimer { border-bottom: 0 !important; }.disclaimer p { padding: 18px; border-left: 3px solid var(--coral); background: var(--coral-soft); color: #65352f; }
.case-aside { position: sticky; top: 92px; display: grid; gap: 12px; }.case-aside > section { padding: 18px; border: 1px solid var(--line); background: var(--surface); }.case-aside h2 { margin: 0 0 14px; font-size: 14px; }.case-aside dl { display: grid; gap: 12px; margin: 0; }.case-aside dl div { display: grid; gap: 3px; }.case-aside dt { color: var(--ink-soft); font-size: 10px; }.case-aside dd { margin: 0; font-size: 11px; line-height: 1.6; }.case-aside .verification-note { display: flex; gap: 10px; border-color: rgb(217 112 98 / 35%); background: var(--coral-soft); }.verification-note svg { flex: 0 0 auto; color: var(--coral); }.verification-note h2 { margin-bottom: 6px; }.verification-note p { margin: 0; color: #65352f; font-size: 10px; line-height: 1.7; }
.related-section { display: grid; grid-template-columns: 180px 1fr; gap: 40px; margin-top: 70px; padding-top: 36px; border-top: 1px solid var(--line); }.related-section > div:first-child p { margin: 0 0 6px; color: var(--teal); font-size: 10px; font-weight: 700; }.related-section h2 { margin: 0; font-size: 24px; }.related-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }.related-grid a { position: relative; min-height: 160px; display: flex; flex-direction: column; padding: 18px; border: 1px solid var(--line); background: var(--surface); }.related-grid span, .related-grid small { color: var(--ink-soft); font-size: 10px; }.related-grid h3 { margin: 12px 0 auto; font-size: 14px; line-height: 1.55; }.related-grid svg { position: absolute; right: 16px; bottom: 16px; color: var(--teal); }
.not-found { min-height: calc(100vh - 220px); display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; }.not-found svg { color: var(--coral); }.not-found h1, .not-found p { margin: 0; }.not-found p { color: var(--ink-soft); }.not-found a { display: inline-flex; align-items: center; gap: 7px; margin-top: 8px; color: var(--teal-dark); font-weight: 700; }
@media (max-width: 900px) { .case-hero { grid-template-columns: 1fr; gap: 28px; }.case-layout { grid-template-columns: 1fr; gap: 28px; }.case-aside { position: static; grid-row: 1; grid-template-columns: repeat(2, minmax(0, 1fr)); }.related-section { grid-template-columns: 1fr; }.related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .hero-main h1 { font-size: 28px; }.case-content > section { padding-left: 34px; }.sign-grid, .case-aside, .related-grid { grid-template-columns: 1fr; }.source-section dl div { grid-template-columns: 1fr; gap: 3px; }.related-grid a { min-height: 135px; } }
</style>
