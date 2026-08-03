<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { ArrowRightIcon, BarChart3Icon, DatabaseIcon, MessageCircleIcon, ShieldCheckIcon, UsersIcon } from '@lucide/vue'
import StatCard from '@/components/common/StatCard.vue'
import ChartSkeleton from '@/components/charts/ChartSkeleton.vue'
import { getGalleryDataset } from '@/services/statisticsService'

const TrendLineChart = defineAsyncComponent({
  loader: () => import('@/components/charts/TrendLineChart.vue'),
  loadingComponent: ChartSkeleton,
  delay: 0,
})
const preview = getGalleryDataset({ year: 2025, region: '全国', population: '大学生', emotionType: '焦虑' })
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="page-inner hero-layout">
        <div class="hero-copy reveal">
          <p class="product-kicker"><span></span> 基于 ChatGLM2-6B 的心理数据平台</p>
          <h1>心绘 GLM</h1>
          <p class="hero-subtitle">用数据看见情绪，用智能辅助干预</p>
          <p class="hero-description">连接心理健康数据陈列、群体风险洞察与非诊断性智能支持，形成“识别 → 分析 → 干预”的演示闭环。</p>
          <div class="hero-actions">
            <RouterLink class="button primary" to="/gallery">进入陈列馆 <ArrowRightIcon :size="17" /></RouterLink>
            <RouterLink class="button secondary" to="/consultation">进入诊疗室 <MessageCircleIcon :size="17" /></RouterLink>
          </div>
          <p class="safety-line"><ShieldCheckIcon :size="16" /> 平台提供心理支持建议，不替代专业咨询或医疗服务</p>
        </div>

        <div class="hero-data reveal delay-1" aria-label="全国心理风险数据预览">
          <div class="preview-head">
            <div><span class="live-dot"></span><small>全国演示数据 · 2025</small></div>
            <strong>69</strong>
            <span>综合关注指数</span>
          </div>
          <TrendLineChart :data="preview.trends" context="大学生 · 焦虑" />
        </div>
      </div>
    </section>

    <section class="home-stats">
      <div class="page-inner stats-grid">
        <StatCard value="69" label="全国情绪风险指数" note="基于演示数据" tone="teal"><template #icon><BarChart3Icon :size="20" /></template></StatCard>
        <StatCard value="12,680" label="本月咨询模拟次数" note="MVP 演示指标" tone="coral"><template #icon><MessageCircleIcon :size="20" /></template></StatCard>
        <StatCard value="大学生" label="当前高关注人群" note="焦虑与睡眠困扰" tone="gold"><template #icon><UsersIcon :size="20" /></template></StatCard>
        <StatCard value="4 维" label="平台数据标签" note="时间 · 地域 · 人群 · 情绪" tone="blue"><template #icon><DatabaseIcon :size="20" /></template></StatCard>
      </div>
    </section>

    <section class="value-band">
      <div class="page-inner value-layout">
        <div>
          <p class="section-kicker">问题与回应</p>
          <h2>让分散的心理信号，成为可理解的行动线索</h2>
        </div>
        <div class="pain-list">
          <article><span>01</span><div><h3>识别</h3><p>从趋势、地域、人群与开放文本中识别值得关注的情绪信号。</p></div></article>
          <article><span>02</span><div><h3>分析</h3><p>通过四维标签和联动图表理解风险背景，不把演示数据包装成诊断。</p></div></article>
          <article><span>03</span><div><h3>干预</h3><p>以温和的心理支持建议和专业求助提示，提供低压力的下一步。</p></div></article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-hero { min-height: min(720px, calc(100vh - 68px)); padding: 58px 24px 34px; display: grid; align-items: center; overflow: hidden; }
.hero-layout { display: grid; grid-template-columns: minmax(0, .9fr) minmax(480px, 1.1fr); gap: 64px; align-items: center; }
.product-kicker, .section-kicker { margin: 0 0 16px; color: var(--teal-dark); font-size: 12px; font-weight: 700; }
.product-kicker span { display: inline-block; width: 22px; height: 2px; margin-right: 8px; vertical-align: middle; background: var(--coral); }
h1 { margin: 0; font-size: 72px; line-height: 1; letter-spacing: 0; }
.hero-subtitle { margin: 18px 0 0; color: var(--teal-dark); font-size: 25px; font-weight: 700; }
.hero-description { max-width: 620px; margin: 20px 0 0; color: var(--ink-soft); font-size: 16px; line-height: 1.85; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.button { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 18px; border: 1px solid var(--teal); border-radius: 7px; font-size: 14px; font-weight: 700; transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease; }
.button:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.button.primary { color: white; background: var(--teal); }
.button.secondary { color: var(--teal-dark); background: transparent; }
.safety-line { display: flex; align-items: center; gap: 7px; margin: 20px 0 0; color: var(--ink-soft); font-size: 11px; }
.hero-data { min-width: 0; padding: 22px 22px 8px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-md); }
.preview-head { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 3px 16px; }
.preview-head > div { display: flex; align-items: center; gap: 7px; color: var(--ink-soft); }
.preview-head strong { grid-row: span 2; color: var(--teal-dark); font-size: 48px; line-height: 1; }
.preview-head > span { color: var(--ink-soft); font-size: 11px; }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--coral); animation: pulse 1.6s ease-in-out infinite; }
.home-stats { padding: 0 24px 70px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.value-band { padding: 72px 24px 90px; border-top: 1px solid var(--line); background: var(--surface-muted); }
.value-layout { display: grid; grid-template-columns: .85fr 1.15fr; gap: 80px; }
.value-layout h2 { max-width: 500px; margin: 0; font-size: 36px; line-height: 1.35; }
.pain-list { display: grid; }
.pain-list article { display: grid; grid-template-columns: 46px 1fr; gap: 18px; padding: 22px 0; border-bottom: 1px solid var(--line); }
.pain-list article:first-child { padding-top: 0; }
.pain-list span { color: var(--coral); font: 700 12px/1.5 monospace; }
.pain-list h3 { margin: 0 0 8px; font-size: 18px; }
.pain-list p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.7; }
.reveal { animation: reveal 420ms ease both; }
.delay-1 { animation-delay: 100ms; }
@keyframes reveal { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 50% { opacity: .35; transform: scale(.75); } }
@media (max-width: 1000px) { .hero-layout { grid-template-columns: 1fr; gap: 36px; } .home-hero { min-height: auto; } .hero-data { width: 100%; } .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 720px) { .home-hero { padding: 42px 16px 26px; } .hero-layout { gap: 28px; } h1 { font-size: 52px; } .hero-subtitle { font-size: 20px; } .hero-data { padding: 16px 10px 0; } .home-stats { padding: 0 16px 52px; } .stats-grid { grid-template-columns: 1fr; } .value-band { padding: 54px 16px 68px; } .value-layout { grid-template-columns: 1fr; gap: 36px; } .value-layout h2 { font-size: 29px; } }
</style>
