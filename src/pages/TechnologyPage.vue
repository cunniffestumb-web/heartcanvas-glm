<script setup lang="ts">
import { BrainCircuitIcon, ChartNoAxesCombinedIcon, MessagesSquareIcon, ShieldCheckIcon, UserRoundCogIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'

const technologies = [
  { icon: BrainCircuitIcon, index: '01', name: 'DeepSeek', tag: '智能对话引擎', text: '通过 Anthropic 兼容接口接入中文大语言模型，为多轮心理支持提供语境理解与结构化回复。' },
  { icon: ShieldCheckIcon, index: '02', name: '安全策略', tag: '危机优先分流', text: '浏览器与服务端双层识别高风险表达，危机提示优先于人格设置和在线模型调用。' },
  { icon: MessagesSquareIcon, index: '03', name: '会话记忆', tag: '持续支持体验', text: '多会话内容、情绪洞察和咨询背景保存在当前设备，支持恢复、切换、改名与删除。' },
  { icon: UserRoundCogIcon, index: '04', name: '人格化交互', tag: '沟通风格与声音', text: '四种内置医生人格与自定义风格共同驱动模型表达，并匹配不同中文系统音色。' },
  { icon: ChartNoAxesCombinedIcon, index: '05', name: '数据可视化', tag: '多维联动洞察', text: 'ECharts 驱动趋势、地图、雷达、情绪构成与关键词五类视图，筛选条件全局联动。' },
]
</script>

<template>
  <section class="page technology-page">
    <div class="page-inner">
      <SectionHeading eyebrow="技术亮点" title="把智能能力放进专业边界" description="每项技术都对应当前可操作的产品能力，兼顾心理语境理解、数据洞察与安全输出。" />

      <div class="architecture-rail" aria-label="技术链路">
        <span>数据治理</span><i></i><span>安全识别</span><i></i><span>智能对话</span><i></i><span>人格表达</span><i></i><span>支持输出</span>
      </div>

      <div class="technology-list">
        <article v-for="item in technologies" :key="item.name">
          <span class="tech-index">{{ item.index }}</span>
          <div class="tech-icon"><component :is="item.icon" :size="24" /></div>
          <div><p>{{ item.tag }}</p><h2>{{ item.name }}</h2><span>{{ item.text }}</span></div>
        </article>
      </div>

      <section class="capability-band">
        <div><p>可信产品能力</p><h2>关键链路均可现场验证</h2><span>从群体趋势筛选到人格化对话与危机分流，形成完整、可交互的体验。</span></div>
        <dl><div><dt>34</dt><dd>省级区域完整覆盖</dd></div><div><dt>5 类</dt><dd>联动心理数据视图</dd></div><div><dt>4+1</dt><dd>内置与自定义医生人格</dd></div><div><dt>双层</dt><dd>客户端与服务端安全识别</dd></div></dl>
      </section>
    </div>
  </section>
</template>

<style scoped>
.architecture-rail { display: flex; align-items: center; gap: 12px; margin: 32px 0 42px; padding: 18px 20px; border-block: 1px solid var(--line); color: var(--ink-soft); font-size: 11px; }.architecture-rail i { flex: 1; height: 1px; background: var(--line); }.technology-list { display: grid; border-top: 1px solid var(--line); }.technology-list article { display: grid; grid-template-columns: 52px 48px 1fr; gap: 20px; align-items: start; padding: 30px 8px; border-bottom: 1px solid var(--line); transition: background 180ms ease, padding 180ms ease; }.technology-list article:hover { padding-inline: 18px; background: var(--surface); }.tech-index { color: var(--coral); font: 700 11px/1.5 monospace; }.tech-icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 7px; color: var(--teal); background: var(--teal-soft); }.technology-list p { margin: 0; color: var(--teal); font-size: 10px; font-weight: 700; }.technology-list h2 { margin: 5px 0 8px; font-size: 23px; }.technology-list div:last-child > span { display: block; max-width: 760px; color: var(--ink-soft); font-size: 13px; line-height: 1.75; }
.capability-band { display: grid; grid-template-columns: .8fr 1.2fr; gap: 60px; margin-top: 72px; padding: 42px; border-radius: var(--radius); color: white; background: var(--ink); }.capability-band p { margin: 0 0 8px; color: #77c5b8; font-size: 10px; font-weight: 700; }.capability-band h2 { margin: 0 0 10px; font-size: 28px; }.capability-band span { color: #aeb9b6; font-size: 11px; line-height: 1.6; }.capability-band dl { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 0; }.capability-band dl div { padding-left: 14px; border-left: 2px solid var(--coral); }.capability-band dt { font-size: 25px; font-weight: 700; }.capability-band dd { margin: 4px 0 0; color: #aeb9b6; font-size: 10px; }
@media (max-width: 760px) { .architecture-rail { align-items: stretch; flex-direction: column; }.architecture-rail i { width: 1px; min-height: 10px; margin-left: 4px; }.capability-band { grid-template-columns: 1fr; gap: 34px; padding: 28px 20px; } }@media (max-width: 480px) { .technology-list article { grid-template-columns: 36px 1fr; }.tech-icon { display: none; }.capability-band dl { grid-template-columns: 1fr; } }
</style>
