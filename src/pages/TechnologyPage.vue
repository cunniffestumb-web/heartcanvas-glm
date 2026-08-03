<script setup lang="ts">
import { BookOpenCheckIcon, BrainCircuitIcon, GitBranchIcon, Layers3Icon, NetworkIcon } from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'

const technologies = [
  { icon: BrainCircuitIcon, index: '01', name: 'ChatGLM2-6B', tag: '原始模型基座', text: '项目原始叙事中的大模型基座，面向心理问答、情绪理解和多轮支持场景。DeepSeek 仅作为 MVP 在线 Provider。' },
  { icon: Layers3Icon, index: '02', name: 'LoRA', tag: '低成本适配', text: '通过参数高效微调降低训练成本，使通用模型更贴近心理健康任务和中文表达语境。' },
  { icon: GitBranchIcon, index: '03', name: 'Prompt', tag: '专业流程约束', text: '把共情、情绪识别、问题归类、行动建议和专业求助提示组织为稳定输出流程。' },
  { icon: BookOpenCheckIcon, index: '04', name: 'LangChain', tag: '知识检索链路', text: '承担知识库检索、多轮对话记忆和文档调度，连接模型与经审核的心理知识内容。' },
  { icon: NetworkIcon, index: '05', name: '心理知识图谱', tag: '关联与解释', text: '关联症状文本、情绪、人群和支持建议，帮助回答保持上下文一致与可解释。' },
]
</script>

<template>
  <section class="page technology-page">
    <div class="page-inner">
      <SectionHeading eyebrow="技术亮点" title="把模型能力放进专业边界" description="技术路线服务于心理语境理解、知识检索和安全输出，不把参数规模等同于专业诊断能力。" />

      <div class="architecture-rail" aria-label="技术链路">
        <span>数据治理</span><i></i><span>LoRA 微调</span><i></i><span>Prompt 逻辑</span><i></i><span>知识检索</span><i></i><span>支持输出</span>
      </div>

      <div class="technology-list">
        <article v-for="item in technologies" :key="item.name">
          <span class="tech-index">{{ item.index }}</span>
          <div class="tech-icon"><component :is="item.icon" :size="24" /></div>
          <div><p>{{ item.tag }}</p><h2>{{ item.name }}</h2><span>{{ item.text }}</span></div>
        </article>
      </div>

      <section class="training-band">
        <div><p>训练与数据策略</p><h2>专业语料与多源情绪信号</h2><span>以下为项目规划与原始技术叙事，不代表当前 MVP 已完成全部训练。</span></div>
        <dl><div><dt>10 本</dt><dd>心理学教材结构拆解</dd></div><div><dt>20 万+</dt><dd>心理问答对规划</dd></div><div><dt>4 类</dt><dd>教材、问答、社交文本、问卷</dd></div><div><dt>DSM</dt><dd>症状文本作为知识参考</dd></div></dl>
      </section>
    </div>
  </section>
</template>

<style scoped>
.architecture-rail { display: flex; align-items: center; gap: 12px; margin: 32px 0 42px; padding: 18px 20px; border-block: 1px solid var(--line); color: var(--ink-soft); font-size: 11px; }
.architecture-rail i { flex: 1; height: 1px; background: var(--line); }
.technology-list { display: grid; border-top: 1px solid var(--line); }
.technology-list article { display: grid; grid-template-columns: 52px 48px 1fr; gap: 20px; align-items: start; padding: 30px 8px; border-bottom: 1px solid var(--line); transition: background 180ms ease, padding 180ms ease; }
.technology-list article:hover { padding-inline: 18px; background: var(--surface); }
.tech-index { color: var(--coral); font: 700 11px/1.5 monospace; }
.tech-icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 7px; color: var(--teal); background: var(--teal-soft); }
.technology-list p { margin: 0; color: var(--teal); font-size: 10px; font-weight: 700; }
.technology-list h2 { margin: 5px 0 8px; font-size: 23px; }
.technology-list div:last-child > span { display: block; max-width: 760px; color: var(--ink-soft); font-size: 13px; line-height: 1.75; }
.training-band { display: grid; grid-template-columns: .8fr 1.2fr; gap: 60px; margin-top: 72px; padding: 42px; border-radius: var(--radius); color: white; background: var(--ink); }
.training-band p { margin: 0 0 8px; color: #77c5b8; font-size: 10px; font-weight: 700; }
.training-band h2 { margin: 0 0 10px; font-size: 28px; }.training-band span { color: #aeb9b6; font-size: 11px; line-height: 1.6; }
.training-band dl { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 0; }
.training-band dl div { padding-left: 14px; border-left: 2px solid var(--coral); }
.training-band dt { font-size: 25px; font-weight: 700; }.training-band dd { margin: 4px 0 0; color: #aeb9b6; font-size: 10px; }
@media (max-width: 760px) { .architecture-rail { align-items: stretch; flex-direction: column; } .architecture-rail i { width: 1px; min-height: 10px; margin-left: 4px; } .training-band { grid-template-columns: 1fr; gap: 34px; padding: 28px 20px; } }
@media (max-width: 480px) { .technology-list article { grid-template-columns: 36px 1fr; }.tech-icon { display: none; }.training-band dl { grid-template-columns: 1fr; } }
</style>
