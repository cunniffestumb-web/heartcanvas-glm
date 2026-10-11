<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from '@lucide/vue'
import { cases } from '@/data/cases'
import { getCaseBySlug, getRelatedCases } from '@/services/caseService'
import '@/styles/application-library.css'

const props = withDefaults(defineProps<{ application?: boolean }>(), { application: false })
const basePath = computed(() => props.application ? '/app/library' : '/cases')
const route = useRoute()
const mobileToc = ref<HTMLDetailsElement>()
const chapters = [
  '案例背景',
  '主要困扰',
  '情绪和行为表现',
  '形成背景',
  '求助过程',
  '应对方法',
  '后续变化',
  '科普启示',
  '案例局限',
  '来源与参考资料',
  '隐私说明',
  '免责声明',
].map((title, index) => ({ id: `case-section-${index + 1}`, title }))
function closeToc() {
  if (mobileToc.value) mobileToc.value.open = false
}
const item = computed(() => getCaseBySlug(cases, String(route.params.slug ?? '')))
const relatedCases = computed(() => (item.value ? getRelatedCases(cases, item.value) : []))
</script>

<template>
  <section class="page case-detail-page" :class="{ 'application-library': application }">
    <div v-if="item" class="page-inner">
      <RouterLink class="back-link" :to="basePath"
        ><ArrowLeftIcon :size="16" aria-hidden="true" />返回案例列表</RouterLink
      >

      <header class="case-hero">
        <div class="hero-main">
          <div class="badges">
            <span>{{ item.category }}</span
            ><span>{{ item.caseNature }}</span
            ><span :class="{ pending: item.verificationStatus === '条件核验' }">{{
              item.verificationStatus
            }}</span>
          </div>
          <h1>{{ item.title }}</h1>
          <p>{{ item.summary }}</p>
          <div class="hero-facts">
            <span>{{ item.alias }} · {{ item.ageRange }}</span
            ><span><BookOpenIcon :size="15" />{{ item.readingTime }} 分钟阅读</span
            ><span><CalendarDaysIcon :size="15" />更新于 {{ item.updatedAt }}</span>
          </div>
        </div>
        <div class="source-stamp">
          <ShieldCheckIcon :size="24" aria-hidden="true" /><strong
            >来源可靠性 {{ item.sourceReliability }}</strong
          ><span>{{ item.sourceOrganization }}</span>
        </div>
      </header>

      <details ref="mobileToc" class="mobile-toc">
        <summary>阅读目录</summary>
        <nav aria-label="案例章节">
          <RouterLink
            v-for="chapter in chapters"
            :key="chapter.id"
            :to="{ path: route.path, hash: `#${chapter.id}` }"
            @click="closeToc"
            >{{ chapter.title }}</RouterLink
          >
        </nav>
      </details>
      <div class="case-layout">
        <article class="case-content">
          <section id="case-section-1">
            <span class="section-no">01</span>
            <h2>案例背景</h2>
            <p>{{ item.background }}</p>
          </section>
          <section id="case-section-2">
            <span class="section-no">02</span>
            <h2>主要困扰</h2>
            <p>{{ item.mainConcern }}</p>
          </section>
          <section id="case-section-3">
            <span class="section-no">03</span>
            <h2>情绪和行为表现</h2>
            <div class="sign-grid">
              <div>
                <h3>情绪表现</h3>
                <ul>
                  <li v-for="sign in item.emotionalSigns" :key="sign">{{ sign }}</li>
                </ul>
              </div>
              <div>
                <h3>行为与身体表现</h3>
                <ul>
                  <li v-for="sign in item.behavioralSigns" :key="sign">{{ sign }}</li>
                </ul>
              </div>
            </div>
          </section>
          <section id="case-section-4">
            <span class="section-no">04</span>
            <h2>形成背景</h2>
            <p>{{ item.context }}</p>
          </section>
          <section id="case-section-5">
            <span class="section-no">05</span>
            <h2>求助过程</h2>
            <p>{{ item.helpSeekingProcess }}</p>
            <h3>专业支持</h3>
            <p>{{ item.professionalSupport }}</p>
          </section>
          <section id="case-section-6">
            <span class="section-no">06</span>
            <h2>应对方法</h2>
            <ul>
              <li v-for="method in item.copingMethods" :key="method">{{ method }}</li>
            </ul>
          </section>
          <section id="case-section-7">
            <span class="section-no">07</span>
            <h2>后续变化</h2>
            <p>{{ item.outcome }}</p>
          </section>
          <section id="case-section-8">
            <span class="section-no">08</span>
            <h2>科普启示</h2>
            <ul class="takeaways">
              <li v-for="takeaway in item.educationalTakeaways" :key="takeaway">{{ takeaway }}</li>
            </ul>
          </section>
          <section id="case-section-9">
            <span class="section-no">09</span>
            <h2>案例局限</h2>
            <p>{{ item.limitations }}</p>
          </section>
          <section class="source-section" id="case-section-10">
            <span class="section-no">10</span>
            <h2>来源与参考资料</h2>
            <dl>
              <div>
                <dt>来源机构</dt>
                <dd>{{ item.sourceOrganization }}</dd>
              </div>
              <div>
                <dt>原文标题</dt>
                <dd>{{ item.sourceTitle }}</dd>
              </div>
              <div>
                <dt>作者</dt>
                <dd>{{ item.sourceAuthor }}</dd>
              </div>
              <div>
                <dt>来源类型</dt>
                <dd>{{ item.sourceType }}</dd>
              </div>
              <div>
                <dt>发布日期</dt>
                <dd>{{ item.sourcePublishedAt }}</dd>
              </div>
              <div>
                <dt>访问日期</dt>
                <dd>{{ item.sourceAccessedAt }}</dd>
              </div>
              <div>
                <dt>核验状态</dt>
                <dd>{{ item.verificationStatus }}</dd>
              </div>
            </dl>
            <a data-source-link :href="item.sourceUrl" target="_blank" rel="noopener noreferrer"
              >阅读原始资料<ExternalLinkIcon :size="16" aria-hidden="true"
            /></a>
            <p class="copyright">{{ item.copyrightNote }}</p>
          </section>
          <section id="case-section-11">
            <span class="section-no">11</span>
            <h2>隐私说明</h2>
            <p>{{ item.privacyNote }}</p>
            <p class="case-status">案例真实性说明：{{ item.realCaseStatus }}</p>
          </section>
          <section class="disclaimer" id="case-section-12">
            <span class="section-no">12</span>
            <h2>免责声明</h2>
            <p>
              本案例仅用于心理健康科普，不能替代医生诊断、心理治疗或个体化建议。案例中的表现与应对方式不应被用于自行诊断。若你或身边的人正处于紧急危险中，请立即联系当地急救、公安机关或可获得的专业危机支持。
            </p>
          </section>
          <div class="case-support">
            <h2>这段经历，让你想起了什么？</h2>
            <p>你可以把自己的困扰写下来，按喜欢的方式慢慢展开。</p>
            <RouterLink
              class="button primary"
              :to="{ path: application ? '/app/chat' : '/consultation', query: { case: item.slug } }"
              >聊聊类似困扰 <ArrowRightIcon :size="18"
            /></RouterLink>
          </div>
        </article>

        <aside class="case-aside">
          <nav class="desktop-toc" aria-label="案例章节">
            <p class="section-kicker">阅读目录</p>
            <RouterLink
              v-for="chapter in chapters"
              :key="chapter.id"
              :to="{ path: route.path, hash: `#${chapter.id}` }"
              >{{ chapter.title }}</RouterLink
            >
          </nav>
          <section>
            <h2>案例信息</h2>
            <dl>
              <div>
                <dt>性质</dt>
                <dd>{{ item.caseNature }}</dd>
              </div>
              <div>
                <dt>核验</dt>
                <dd>{{ item.verificationStatus }}</dd>
              </div>
              <div>
                <dt>风险说明</dt>
                <dd>{{ item.riskLevel }}</dd>
              </div>
            </dl>
          </section>
          <section v-if="item.verificationStatus === '条件核验'" class="verification-note">
            <ShieldAlertIcon :size="20" aria-hidden="true" />
            <div>
              <h2>仍需人工核验</h2>
              <p>{{ item.limitations }}</p>
            </div>
          </section>
        </aside>
      </div>

      <section class="related-section">
        <div>
          <p>继续阅读</p>
          <h2>相关推荐</h2>
        </div>
        <div class="related-grid">
          <RouterLink
            v-for="related in relatedCases"
            :key="related.id"
            :to="`${basePath}/${related.slug}`"
          >
            <span>{{ related.category }}</span>
            <h3>{{ related.title }}</h3>
            <small>{{ related.readingTime }} 分钟阅读</small
            ><ArrowRightIcon :size="17" aria-hidden="true" />
          </RouterLink>
        </div>
      </section>
    </div>

    <div v-else class="page-inner not-found" role="alert">
      <ShieldAlertIcon :size="34" aria-hidden="true" />
      <h1>没有找到这个案例</h1>
      <p>案例可能已被移除，或当前链接不完整。</p>
      <RouterLink :to="basePath"
        ><ArrowLeftIcon :size="16" aria-hidden="true" />返回案例列表</RouterLink
      >
    </div>
  </section>
</template>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  margin-bottom: 16px;
  color: var(--teal);
  font-size: 14px;
}
.case-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 52px;
  align-items: end;
  padding: 16px 0 32px;
  border-bottom: 1px solid var(--line);
}
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.badges span {
  padding: 5px 10px;
  border-radius: 7px;
  color: var(--teal);
  background: var(--teal-soft);
  font-size: 12px;
}
.badges .pending {
  color: #866a30;
  background: var(--gold-soft);
}
h1 {
  margin: 0;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.5;
  font-weight: 500;
}
.hero-main > p {
  margin: 18px 0;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.9;
}
.hero-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  color: var(--ink-soft);
  font-size: 12px;
}
.hero-facts span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.source-stamp {
  display: grid;
  gap: 10px;
  padding: 18px 0 18px 22px;
  border-left: 2px solid #c8dccd;
}
.source-stamp svg {
  color: var(--teal);
}
.source-stamp strong {
  font-size: 14px;
  font-weight: 500;
}
.source-stamp span {
  color: var(--ink-soft);
  font-size: 12px;
  overflow-wrap: anywhere;
}
.case-layout {
  display: grid;
  grid-template-columns: minmax(0, 800px) minmax(200px, 1fr);
  gap: 64px;
  margin-top: 38px;
}
.case-content {
  min-width: 0;
}
.case-content > section {
  position: relative;
  margin-bottom: 36px;
  padding-left: 42px;
  scroll-margin-top: 96px;
}
.section-no {
  position: absolute;
  left: 0;
  top: 4px;
  color: var(--coral);
  font-size: 12px;
}
.case-content h2 {
  margin: 0 0 16px;
  font-size: 23px;
  font-weight: 500;
}
.case-content h3 {
  margin: 22px 0 10px;
  font-size: 17px;
  font-weight: 500;
}
.case-content p,
.case-content li {
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.95;
}
.case-content p {
  margin: 0 0 12px;
}
.case-content ul {
  padding-left: 22px;
  margin: 0;
}
.case-content li {
  margin-bottom: 9px;
}
.sign-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.sign-grid h3 {
  margin-top: 0;
}
.source-section dl {
  margin: 0 0 18px;
  border-top: 1px solid var(--line);
}
.source-section dl div {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 16px;
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}
.source-section dt {
  color: var(--ink-soft);
}
.source-section dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.source-section a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--teal);
  font-size: 14px;
}
.source-section .copyright,
.case-content .case-status {
  margin-top: 12px;
  font-size: 12px;
}
.disclaimer {
  padding-block: 18px;
  border-top: 1px solid var(--line);
}
.disclaimer .section-no {
  top: 23px;
}
.disclaimer p {
  font-size: 14px;
}
.case-aside {
  position: sticky;
  top: 92px;
  align-self: start;
  min-width: 0;
}
.desktop-toc {
  display: grid;
  margin-bottom: 22px;
}
.desktop-toc a {
  display: block;
  min-height: 32px;
  padding: 5px 12px;
  border-left: 1px solid var(--line);
  color: var(--ink-soft);
  font-size: 12px;
}
.desktop-toc a:hover {
  color: var(--teal);
  border-left-color: var(--teal);
  background: var(--teal-soft);
}
.case-aside > section {
  margin-bottom: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
.case-aside h2 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 500;
}
.case-aside dl {
  margin: 0;
}
.case-aside dl div {
  margin-bottom: 12px;
}
.case-aside dt {
  color: var(--ink-soft);
  font-size: 12px;
}
.case-aside dd {
  margin: 4px 0 0;
  font-size: 14px;
}
.verification-note {
  display: flex;
  gap: 10px;
  color: #82692d;
}
.verification-note svg {
  flex-shrink: 0;
}
.verification-note p {
  margin: 0;
  font-size: 12px;
  line-height: 1.9;
}
.mobile-toc {
  display: none;
}
.case-support {
  padding: 26px;
  border-radius: 14px;
  background: #edf2e8;
}
.case-support h2 {
  font-size: 22px;
}
.case-support p {
  font-size: 14px;
}
.case-support a {
  margin-top: 8px;
}
.related-section {
  margin-top: 48px;
  padding-top: 34px;
  border-top: 1px solid var(--line);
}
.related-section > div:first-child {
  margin-bottom: 24px;
}
.related-section > div:first-child p {
  margin: 0 0 7px;
  color: var(--teal);
  font-size: 12px;
}
.related-section h2 {
  margin: 0;
  font-size: 25px;
  font-weight: 500;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.related-grid a {
  position: relative;
  min-height: 160px;
  padding: 18px 0;
  border-top: 2px solid #cedfcf;
}
.related-grid span,
.related-grid small {
  color: var(--ink-soft);
  font-size: 12px;
}
.related-grid h3 {
  margin: 10px 0;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
}
.related-grid svg {
  float: right;
  color: var(--teal);
}
.not-found {
  padding: 70px 0;
  text-align: center;
}
.not-found svg {
  color: var(--teal);
}
.not-found p {
  color: var(--ink-soft);
}
.not-found a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--teal);
}
@media (max-width: 1023px) {
  .case-hero {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .source-stamp {
    padding-block: 10px;
  }
  .case-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .case-aside {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
  .desktop-toc {
    display: none;
  }
  .mobile-toc {
    display: block;
    margin-top: 22px;
    border-bottom: 1px solid var(--line);
  }
  .mobile-toc summary {
    min-height: 48px;
    padding: 10px 0;
    color: var(--teal);
    font-size: 14px;
  }
  .mobile-toc nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
    padding-bottom: 14px;
  }
  .mobile-toc a {
    min-height: 44px;
    padding: 10px;
    border-radius: 8px;
    background: var(--surface-muted);
    font-size: 12px;
  }
}
@media (max-width: 600px) {
  .case-layout {
    margin-top: 28px;
  }
  .case-content > section {
    padding-left: 30px;
    margin-bottom: 28px;
  }
  .case-content h2 {
    font-size: 21px;
  }
  .sign-grid,
  .case-aside,
  .related-grid {
    grid-template-columns: 1fr;
  }
  .source-section dl div {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .case-support {
    padding: 20px;
  }
  .related-grid {
    gap: 12px;
  }
  .related-grid a {
    min-height: auto;
  }
}
</style>
