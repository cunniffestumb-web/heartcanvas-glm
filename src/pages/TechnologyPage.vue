<script setup lang="ts">
import {
  ArrowRightIcon,
  BrainCircuitIcon,
  ChartNoAxesCombinedIcon,
  MessagesSquareIcon,
  ShieldCheckIcon,
  UserRoundCogIcon,
} from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
const modelStages = [
  ['本地 GLM 基座', '以本地 GLM 基础模型作为中文语言理解与生成的底座。'],
  ['心理支持场景训练', '围绕心理支持场景开展训练，使模型回应贴近情绪表达与支持需求。'],
  ['心绘 GLM', '形成项目专属的心理支持模型，连接对话上下文与个性化陪伴。'],
]
const steps = [
  ['01', '表达感受', '文字或浏览器语音输入'],
  ['02', '安全识别', '优先处理需要立即求助的表达'],
  ['03', '个性化组织', '结合沟通风格与对话上下文'],
  ['04', '心绘 GLM 回应', '结合当前情境组织支持回复'],
  ['05', '清楚呈现', '整理回复、情绪与关键词'],
]
const technologies = [
  {
    icon: BrainCircuitIcon,
    index: '01',
    name: '心绘 GLM',
    tag: '基于本地模型训练',
    text: '心绘 GLM 基于本地 GLM 基础模型训练而成，面向心理支持场景形成专属的理解与回应能力。训练后的模型结合对话上下文与陪伴风格，生成适合当前交流情境的支持回复。',
    to: '/consultation',
    action: '体验智能支持',
  },
  {
    icon: ShieldCheckIcon,
    index: '02',
    name: '安全策略',
    tag: '安全优先',
    text: '客户端与服务端识别需要优先确认安全的表达，提供清楚的求助提示，陪伴风格不会改变安全规则。',
    to: '/consultation',
    action: '查看支持空间',
  },
  {
    icon: MessagesSquareIcon,
    index: '03',
    name: '会话记忆',
    tag: '随时继续自己的对话',
    text: '浏览器保存会话与草稿，支持切换、改名和删除。请求绑定原会话，切换时仍能正确接收回应。',
    to: '/consultation',
    action: '开始一次对话',
  },
  {
    icon: UserRoundCogIcon,
    index: '04',
    name: '人格化交互',
    tag: '适合你的沟通方式',
    text: '四种内置陪伴风格与自定义设置，调整表达方式和浏览器声音偏好，让交流更贴近使用习惯。',
    to: '/consultation',
    action: '选择陪伴风格',
  },
  {
    icon: ChartNoAxesCombinedIcon,
    index: '05',
    name: '数据可视化',
    tag: '看见不同视角',
    text: '趋势、地图、人群、情绪构成与关键词五类视图，清楚展示筛选范围，支持从数据探索进入心理支持。',
    to: '/gallery',
    action: '探索陈列馆',
  },
]
</script>
<template>
  <section class="page technology-page">
    <div class="page-inner">
      <SectionHeading
        eyebrow="技术亮点"
        title="以本地训练的心绘 GLM，连接理解与陪伴"
        description="以本地 GLM 基础模型为底座，围绕心理支持场景开展训练，形成心绘 GLM。模型能力与安全策略、个性化交互及数据探索共同构成心绘的技术体系。"
      />
      <section class="model-foundation" aria-labelledby="model-foundation-title">
        <p class="section-kicker">心绘 GLM 的模型来源</p>
        <h2 id="model-foundation-title">从本地模型底座，到心绘 GLM</h2>
        <div class="model-training-route">
          <article v-for="(stage, index) in modelStages" :key="stage[0]" data-model-stage>
            <span class="stage-number">0{{ index + 1 }}</span>
            <h3>{{ stage[0] }}</h3>
            <p>{{ stage[1] }}</p>
          </article>
        </div>
      </section>
      <ol class="architecture-rail" aria-label="支持处理流程">
        <li v-for="step in steps" :key="step[0]">
          <span>{{ step[0] }}</span>
          <h2>{{ step[1] }}</h2>
          <p>{{ step[2] }}</p>
        </li>
      </ol>
      <div class="technology-list">
        <article v-for="item in technologies" :key="item.name">
          <span class="tech-index">{{ item.index }}</span
          ><span class="tech-icon"><component :is="item.icon" :size="25" /></span>
          <div>
            <p class="section-kicker">{{ item.tag }}</p>
            <h2>{{ item.name }}</h2>
            <p class="tech-description">{{ item.text }}</p>
            <RouterLink class="text-link" :to="item.to"
              >{{ item.action }}<ArrowRightIcon :size="17"
            /></RouterLink>
          </div>
        </article>
      </div>
      <section class="stack-section">
        <h2>心绘模型与应用服务架构</h2>
        <p>
          心绘 GLM 是基于本地模型训练形成的心理支持模型，应用服务层衔接模型推理、安全策略与对话上下文。
          Vue 3与TypeScript组织界面，Pinia管理会话与筛选，ECharts呈现图表，浏览器提供语音识别与朗读能力。
        </p>
        <div class="stack-labels">
          <span>本地 GLM 模型底座</span><span>心理支持场景训练</span><span>心绘 GLM 推理</span>
          <span>交互界面</span><span>会话与本地保存</span><span>应用服务层</span><span>数据探索</span>
        </div>
      </section>
    </div>
  </section>
</template>
<style scoped>
.model-foundation {
  margin-top: 30px;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: linear-gradient(125deg, #f7f0e3, #edf3e9);
}
.model-foundation h2 {
  margin: 0 0 22px;
  font-size: 25px;
  font-weight: 500;
}
.model-training-route {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.model-training-route article {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgb(255 255 255 / 55%);
}
.stage-number {
  color: var(--coral);
  font-size: 14px;
}
.model-training-route h3 {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 500;
}
.model-training-route p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 15px;
  line-height: 1.8;
}
.architecture-rail {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  margin: 38px 0 46px;
  padding: 24px 0;
  border-block: 1px solid var(--line);
  list-style: none;
}
.architecture-rail li {
  border-left: 2px solid #c8dccd;
  padding-left: 16px;
}
.architecture-rail span {
  color: var(--coral);
  font-size: 12px;
}
.architecture-rail h2 {
  margin: 10px 0 7px;
  font-size: 17px;
  font-weight: 500;
}
.architecture-rail p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.9;
}
.technology-list article {
  display: grid;
  grid-template-columns: 42px 50px minmax(0, 1fr);
  gap: 24px;
  padding: 30px 0;
  border-bottom: 1px solid var(--line);
}
.tech-index {
  padding-top: 10px;
  color: var(--coral);
  font-size: 12px;
}
.tech-icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: var(--teal);
  background: var(--teal-soft);
}
.technology-list .section-kicker {
  margin-bottom: 6px;
}
.technology-list h2 {
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 500;
}
.tech-description {
  max-width: 780px;
  margin: 0 0 10px;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.9;
}
.stack-section {
  margin-top: 42px;
  padding: 28px;
  border-radius: 14px;
  background: #edf2e8;
}
.stack-section h2 {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 500;
}
.stack-section p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 16px;
}
.stack-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 28px;
  margin-top: 22px;
  color: var(--teal);
  font-size: 14px;
}
@media (max-width: 767px) {
  .model-foundation {
    padding: 22px;
  }
  .model-foundation h2 {
    font-size: 23px;
  }
  .model-training-route {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .architecture-rail {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-block: 24px;
    padding-block: 20px;
  }
  .architecture-rail li {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 4px 12px;
  }
  .architecture-rail h2 {
    margin: 0;
  }
  .architecture-rail p {
    grid-column: 2;
  }
  .technology-list article {
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 16px;
    padding-block: 24px;
  }
  .tech-index {
    display: none;
  }
  .tech-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }
  .technology-list h2 {
    font-size: 23px;
  }
  .stack-section {
    padding: 22px;
  }
}
</style>
