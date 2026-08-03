<script setup lang="ts">
import { BoxIcon, Building2Icon, ChartNoAxesCombinedIcon, Globe2Icon, HospitalIcon, MicIcon, PuzzleIcon, SchoolIcon, ScanFaceIcon, SmartphoneIcon, UsersIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'

const scenarios = [
  { icon: SchoolIcon, name: '学校心理健康中心', text: '辅助观察学生群体趋势，提供低门槛心理支持入口与专业转介提示。', accent: 'teal' },
  { icon: HospitalIcon, name: '医院或心理门诊', text: '作为辅助预筛查与信息整理工具，不取代医生诊断、治疗或临床决策。', accent: 'coral' },
  { icon: Building2Icon, name: '社区心理服务', text: '帮助社区工作者理解群体关注方向，规划心理科普与服务资源。', accent: 'gold' },
  { icon: UsersIcon, name: '心理咨询机构', text: '聚合匿名趋势、咨询主题与服务触点，为运营和内容建设提供参考。', accent: 'blue' },
]
</script>

<template>
  <section class="page scenarios-page">
    <div class="page-inner">
      <SectionHeading eyebrow="应用场景" title="让心理支持进入更近的服务触点" description="MVP 面向机构演示与项目路演。所有场景都坚持辅助定位，不替代专业判断和紧急救助。" />
      <div class="scenario-grid">
        <article v-for="(item, index) in scenarios" :key="item.name" :data-accent="item.accent">
          <div><component :is="item.icon" :size="25" /></div><span>0{{ index + 1 }}</span><h2>{{ item.name }}</h2><p>{{ item.text }}</p>
        </article>
      </div>

      <section class="product-forms">
        <div><p class="section-kicker">推广形态</p><h2>从 Web 演示到多端服务能力</h2></div>
        <div class="form-list"><article><Globe2Icon :size="22" /><h3>Web 平台</h3><p>当前 MVP 主载体</p></article><article><SmartphoneIcon :size="22" /><h3>微信小程序</h3><p>面向轻量触达</p></article><article><PuzzleIcon :size="22" /><h3>医疗平台插件</h3><p>作为辅助模块接入</p></article></div>
      </section>

      <section class="future-section">
        <div class="future-head"><p class="section-kicker">未来展望</p><h2>从数据呈现走向多模态理解</h2></div>
        <div class="future-list">
          <article><BoxIcon :size="21" /><div><h3>3D 情绪地图</h3><p>以空间层级观察区域与人群变化。</p></div></article>
          <article><MicIcon :size="21" /><div><h3>语音播报</h3><p>提供更低阅读负担的支持方式。</p></div></article>
          <article><ScanFaceIcon :size="21" /><div><h3>多模态情绪识别</h3><p>在明确授权与隐私边界内探索更多信号。</p></div></article>
          <article><ChartNoAxesCombinedIcon :size="21" /><div><h3>干预效果评估</h3><p>追踪行动反馈，形成可解释的服务改进闭环。</p></div></article>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.scenario-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 34px; }
.scenario-grid article { min-height: 280px; display: flex; flex-direction: column; padding: 22px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow-sm); transition: transform 180ms ease, border-color 180ms ease; }
.scenario-grid article:hover { transform: translateY(-4px); border-color: var(--teal); }
.scenario-grid article > div { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 7px; color: var(--teal); background: var(--teal-soft); }
.scenario-grid article[data-accent="coral"] > div { color: var(--coral); background: var(--coral-soft); }.scenario-grid article[data-accent="gold"] > div { color: var(--gold); background: var(--gold-soft); }.scenario-grid article[data-accent="blue"] > div { color: var(--blue); background: #e2ebf3; }
.scenario-grid article > span { margin-top: auto; color: var(--coral); font: 700 10px/1.5 monospace; }
.scenario-grid h2 { margin: 9px 0; font-size: 17px; line-height: 1.4; }.scenario-grid p { margin: 0; color: var(--ink-soft); font-size: 12px; line-height: 1.7; }
.product-forms { display: grid; grid-template-columns: .7fr 1.3fr; gap: 60px; margin-top: 72px; padding: 42px 0; border-block: 1px solid var(--line); }
.section-kicker { margin: 0 0 8px; color: var(--teal); font-size: 10px; font-weight: 700; }.product-forms h2, .future-head h2 { margin: 0; font-size: 28px; line-height: 1.35; }
.form-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }.form-list article { padding: 18px; border-left: 2px solid var(--teal); background: var(--surface); }.form-list svg { color: var(--teal); }.form-list h3 { margin: 20px 0 5px; font-size: 14px; }.form-list p { margin: 0; color: var(--ink-soft); font-size: 10px; }
.future-section { display: grid; grid-template-columns: .7fr 1.3fr; gap: 60px; padding-top: 72px; }.future-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }.future-list article { display: flex; gap: 14px; padding: 18px; border: 1px solid var(--line); background: var(--surface); }.future-list svg { flex: 0 0 auto; color: var(--coral); }.future-list h3 { margin: 0 0 6px; font-size: 14px; }.future-list p { margin: 0; color: var(--ink-soft); font-size: 11px; line-height: 1.6; }
@media (max-width: 900px) { .scenario-grid { grid-template-columns: repeat(2, 1fr); }.product-forms, .future-section { grid-template-columns: 1fr; gap: 30px; } }
@media (max-width: 560px) { .scenario-grid, .form-list, .future-list { grid-template-columns: 1fr; }.scenario-grid article { min-height: 230px; } }
</style>
