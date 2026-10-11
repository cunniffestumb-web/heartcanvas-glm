<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import {
  ActivityIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  ChartNoAxesCombinedIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
} from '@lucide/vue'
import { builtInDoctors } from '@/data/doctors'
import { supportTopics } from '@/data/supportTopics'
import { getGalleryDataset } from '@/services/statisticsService'
import ChartSkeleton from '@/components/charts/ChartSkeleton.vue'
const TrendLineChart = defineAsyncComponent({
  loader: () => import('@/components/charts/TrendLineChart.vue'),
  loadingComponent: ChartSkeleton,
  delay: 0,
})
const preview = getGalleryDataset({
  year: 2025,
  region: '全国',
  population: '大学生',
  emotionType: '焦虑',
})
const examples: Record<string, string> = {
  warm: '先听见你的感受，再一起慢慢展开。',
  rational: '厘清事实与想法，找到可行的下一步。',
  coach: '看见已有的力量，按自己的节奏行动。',
  steady: '留出安静的空间，尊重每一次停顿。',
}
</script>
<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="page-inner hero-layout">
        <div class="hero-copy">
          <p class="section-kicker"><span></span>心理数据与智能支持</p>
          <h1>心绘 <span>GLM</span></h1>
          <h2>把心事说出来，<br />让情绪被看见。</h2>
          <p class="hero-description">
            基于本地 GLM 模型训练而成，陪你理解此刻的感受。用自在的方式表达心事，找到一个更轻松、更可行的下一步。
          </p>
          <div class="hero-actions">
            <RouterLink class="button primary" to="/app"
              >进入心绘应用 <ArrowRightIcon :size="18" /></RouterLink
            ><RouterLink class="button" to="/gallery"
              >探索心理数据 <ArrowUpRightIcon :size="18"
            /></RouterLink>
          </div>
          <p class="safety-line">
            <ShieldCheckIcon :size="16" />心理支持建议，不替代专业咨询或医疗服务
          </p>
        </div>
        <div class="hero-preview">
          <div class="conversation-preview">
            <header>
              <span class="preview-mark"><ActivityIcon :size="21" /></span>
              <div><strong>温柔陪伴</strong><small>从你的感受开始</small></div>
              <span class="preview-label">体验片段</span>
            </header>
            <p class="preview-user">最近事情好多，总觉得自己做得不够好。</p>
            <div class="preview-reply">
              <span class="reply-label">林医生</span>
              <p>
                听起来，你已经努力了很久。我们先不用急着解决所有事情，可以从最让你疲惫的一件事说起。
              </p>
            </div>
            <RouterLink class="preview-composer" to="/consultation"
              ><span>说说你此刻的感受…</span><ArrowUpRightIcon :size="20"
            /></RouterLink>
          </div>
          <div class="trend-preview">
            <div>
              <p class="section-kicker">看见情绪的变化</p>
              <span>大学生 · 群体趋势样例</span
              ><RouterLink to="/gallery" aria-label="查看完整心理数据"
                ><ArrowUpRightIcon :size="20"
              /></RouterLink>
            </div>
            <TrendLineChart :data="preview.trends" context="大学生 · 焦虑" />
          </div>
        </div>
      </div>
    </section>
    <section class="topic-section">
      <div class="page-inner">
        <div class="section-head">
          <div>
            <p class="section-kicker">从一件小事说起</p>
            <h2>今天，想聊点什么？</h2>
          </div>
          <p>选择一个话题，整理好思绪再开始。</p>
        </div>
        <div class="topic-grid">
          <RouterLink
            v-for="(topic, index) in supportTopics"
            :key="topic.id"
            :to="{ path: '/consultation', query: { topic: topic.id } }"
            ><span class="topic-number">0{{ index + 1 }}</span>
            <h3>{{ topic.title }}</h3>
            <p>{{ topic.description }}</p>
            <ArrowUpRightIcon :size="20"
          /></RouterLink>
        </div>
      </div>
    </section>
    <section class="styles-section">
      <div class="page-inner">
        <div class="section-head">
          <div>
            <p class="section-kicker">用你自在的方式交流</p>
            <h2>四种陪伴风格，同一份认真倾听</h2>
          </div>
          <RouterLink class="text-link" to="/consultation"
            >选择你的陪伴 <ArrowRightIcon :size="18"
          /></RouterLink>
        </div>
        <div class="style-grid">
          <article v-for="doctor in builtInDoctors" :key="doctor.id" :data-style="doctor.id">
            <span class="style-avatar">{{ doctor.name.slice(0, 1) }}</span>
            <h3>{{ doctor.title }}</h3>
            <p>{{ examples[doctor.id] }}</p>
            <small
              >{{ doctor.name }} ·
              {{ doctor.voicePreference === 'female' ? '柔和女声' : '沉稳男声' }}</small
            >
          </article>
        </div>
      </div>
    </section>
    <section class="resources-section">
      <div class="page-inner resource-layout">
        <div>
          <p class="section-kicker">理解，也来自更多视角</p>
          <h2>看见自己，<br />也理解不同的经历。</h2>
          <p class="resource-description">
            群体数据帮助理解常见困扰，公开案例提供认识与求助的线索。你可以带着自己的问题继续交流。
          </p>
        </div>
        <div class="resource-links">
          <RouterLink to="/gallery"
            ><ChartNoAxesCombinedIcon :size="24" />
            <div>
              <h3>心理数据陈列馆</h3>
              <p>探索趋势、地区与人群的情绪关注方向</p>
            </div>
            <ArrowRightIcon :size="20" /></RouterLink
          ><RouterLink to="/cases"
            ><BookOpenIcon :size="24" />
            <div>
              <h3>公开案例中心</h3>
              <p>从不同经历中认识困扰与求助过程</p>
            </div>
            <ArrowRightIcon :size="20" /></RouterLink
          ><RouterLink to="/consultation"
            ><MessageCircleIcon :size="24" />
            <div>
              <h3>持续的支持对话</h3>
              <p>文字与语音交流，随时回到自己的会话</p>
            </div>
            <ArrowRightIcon :size="20"
          /></RouterLink>
        </div>
      </div>
    </section>
    <section class="capabilities">
      <div class="page-inner">
        <div><strong>34</strong><span>省级地区视图</span></div>
        <div><strong>5</strong><span>数据探索视角</span></div>
        <div><strong>4</strong><span>内置陪伴风格</span></div>
        <div><strong>文字＋语音</strong><span>按习惯选择表达方式</span></div>
      </div>
    </section>
  </div>
</template>
<style scoped>
.home-hero {
  padding: 64px 24px 58px;
  border-bottom: 1px solid var(--line);
  background: radial-gradient(ellipse at 82% 25%, #e7eee2 0, transparent 48%), var(--bg);
}
.hero-layout {
  display: grid;
  grid-template-columns: 0.95fr 1fr;
  gap: 80px;
  align-items: center;
}
.hero-copy .section-kicker {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hero-copy .section-kicker span {
  width: 24px;
  height: 2px;
  background: var(--coral);
}
h1 {
  margin: 0 0 18px;
  font-size: 64px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.04em;
}
h1 span {
  color: var(--teal);
  font-weight: 400;
}
h2 {
  margin: 0;
  font-size: 32px;
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: -0.02em;
}
.hero-description {
  max-width: 430px;
  margin: 22px 0 28px;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.9;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.safety-line {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 20px 0 0;
  color: var(--ink-soft);
  font-size: 12px;
}
.safety-line svg {
  flex-shrink: 0;
  margin-top: 3px;
}
.hero-preview {
  position: relative;
  min-width: 0;
}
.conversation-preview {
  position: relative;
  padding: 24px;
  border: 1px solid #dce4d7;
  border-radius: 20px;
  background: #fffefa;
  box-shadow: var(--shadow-md);
}
.conversation-preview header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.preview-mark {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: var(--teal);
  background: var(--teal-soft);
}
.conversation-preview header div {
  display: grid;
}
.conversation-preview strong {
  font-size: 14px;
}
.conversation-preview small,
.preview-label {
  color: var(--ink-soft);
  font-size: 12px;
}
.preview-label {
  margin-left: auto;
}
.preview-user {
  max-width: 85%;
  margin: 0 0 22px auto;
  padding: 12px 15px;
  border-radius: 14px 14px 4px 14px;
  background: #e8f1e6;
  font-size: 14px;
}
.preview-reply {
  max-width: 94%;
}
.reply-label {
  color: var(--teal);
  font-size: 12px;
  font-weight: 700;
}
.preview-reply p {
  margin: 6px 0 24px;
  font-size: 14px;
  line-height: 1.9;
}
.preview-composer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 12px 15px;
  border: 1px solid #e4e7df;
  border-radius: 13px;
  color: var(--ink-soft);
  background: #f7f8f1;
  font-size: 14px;
}
.preview-composer svg {
  color: var(--teal);
}
.trend-preview {
  width: 84%;
  margin: 20px 0 0 auto;
  padding: 16px 20px 6px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fffefa;
}
.trend-preview > div:first-child {
  position: relative;
}
.trend-preview .section-kicker {
  margin: 0;
}
.trend-preview span {
  color: var(--ink-soft);
  font-size: 12px;
}
.trend-preview a {
  position: absolute;
  right: 0;
  top: 0;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--teal);
}
.trend-preview :deep(.chart-canvas) {
  height: 155px !important;
  min-height: 155px;
}
.topic-section,
.styles-section,
.resources-section {
  padding: 66px 24px;
}
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}
.section-head h2 {
  font-size: 28px;
}
.section-head > p {
  max-width: 290px;
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
}
.topic-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.topic-grid a {
  position: relative;
  display: block;
  min-height: 156px;
  padding: 22px 0;
  border-top: 2px solid #c6d9cb;
  border-bottom: 1px solid var(--line);
}
.topic-number {
  color: var(--coral);
  font-size: 12px;
}
.topic-grid h3 {
  margin: 14px 0 6px;
  font-size: 18px;
  font-weight: 500;
}
.topic-grid p {
  max-width: 190px;
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
}
.topic-grid svg {
  position: absolute;
  top: 24px;
  right: 0;
  color: var(--teal);
}
.topic-grid a:hover {
  border-top-color: var(--teal);
}
.styles-section {
  border-block: 1px solid var(--line);
  background: #f0f2eb;
}
.style-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}
.style-grid article {
  --style-color: var(--teal);
  --style-bg: #dcebe0;
  padding: 22px 0 8px;
}
.style-grid article[data-style='rational'] {
  --style-color: #5b819d;
  --style-bg: #e0e9ef;
}
.style-grid article[data-style='coach'] {
  --style-color: #bb7665;
  --style-bg: #f0e1d8;
}
.style-grid article[data-style='steady'] {
  --style-color: #9d803e;
  --style-bg: #eae5d1;
}
.style-avatar {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  border-radius: 16px;
  color: var(--style-color);
  background: var(--style-bg);
  font-size: 20px;
}
.style-grid h3 {
  margin: 0 0 10px;
  font-size: 19px;
  font-weight: 500;
}
.style-grid p {
  max-width: 240px;
  margin: 0 0 15px;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.9;
}
.style-grid small {
  color: var(--style-color);
  font-size: 12px;
}
.resource-layout {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 90px;
}
.resource-description {
  max-width: 380px;
  margin: 18px 0 0;
  color: var(--ink-soft);
  font-size: 16px;
}
.resource-links a {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 118px;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
}
.resource-links a:first-child {
  border-top: 1px solid var(--line);
}
.resource-links svg {
  flex-shrink: 0;
  color: var(--teal);
}
.resource-links a > svg:last-child {
  margin-left: auto;
}
.resource-links h3 {
  margin: 0 0 7px;
  font-size: 19px;
  font-weight: 500;
}
.resource-links p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
}
.capabilities {
  padding: 34px 24px 44px;
  border-top: 1px solid var(--line);
}
.capabilities .page-inner {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.capabilities .page-inner > div {
  display: grid;
  gap: 5px;
  padding-left: 22px;
  border-left: 1px solid var(--line);
}
.capabilities strong {
  font-size: 25px;
  color: var(--teal);
  font-weight: 500;
}
.capabilities span {
  color: var(--ink-soft);
  font-size: 12px;
}
@media (max-width: 1023px) {
  .hero-layout {
    gap: 38px;
  }
  h1 {
    font-size: 50px;
  }
  .hero-copy h2 {
    font-size: 27px;
  }
  .resource-layout {
    gap: 44px;
  }
  .topic-grid,
  .style-grid {
    gap: 16px;
  }
}
@media (max-width: 767px) {
  .home-hero {
    padding: 36px 16px;
  }
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  h1 {
    font-size: 48px;
  }
  .hero-copy h2 {
    font-size: 28px;
  }
  .hero-description {
    margin: 16px 0 22px;
  }
  .conversation-preview {
    padding: 20px;
  }
  .trend-preview {
    width: 100%;
    margin-top: 14px;
  }
  .topic-section,
  .styles-section,
  .resources-section {
    padding: 40px 16px;
  }
  .section-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
  .section-head h2 {
    font-size: 25px;
  }
  .topic-grid,
  .style-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .topic-grid a {
    min-height: 166px;
  }
  .resource-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .capabilities {
    padding: 24px 16px;
  }
  .capabilities .page-inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 8px;
  }
  .capabilities strong {
    font-size: 22px;
  }
  .capabilities .page-inner > div {
    padding-left: 14px;
  }
}
@media (max-width: 360px) {
  .hero-actions .button {
    width: 100%;
  }
  .preview-label {
    display: none;
  }
  .topic-grid p {
    font-size: 12px;
  }
}
</style>
