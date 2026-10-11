<script setup lang="ts">
import {
  ArrowRightIcon,
  Building2Icon,
  Globe2Icon,
  HospitalIcon,
  PuzzleIcon,
  SchoolIcon,
  SmartphoneIcon,
  UsersIcon,
} from '@lucide/vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
const scenarios = [
  {
    icon: SchoolIcon,
    name: '学校心理健康中心',
    scene: '考试、适应与人际关系',
    text: '学生可以从具体困扰开始交流，也可以阅读公开案例，理解常见情绪与求助过程。',
    to: { path: '/consultation', query: { topic: 'exam', population: '大学生' } },
    action: '聊聊考试压力',
    accent: 'teal',
  },
  {
    icon: HospitalIcon,
    name: '医院或心理门诊',
    scene: '就诊前后的表达与整理',
    text: '帮助使用者整理想表达的感受和问题，作为心理支持入口；专业判断与诊疗由专业人员负责。',
    to: { path: '/consultation' },
    action: '开始表达与梳理',
    accent: 'coral',
  },
  {
    icon: Building2Icon,
    name: '社区心理服务',
    scene: '日常困扰与心理科普',
    text: '以容易访问的Web入口提供基础心理支持，结合案例与群体数据开展科普阅读。',
    to: { path: '/cases' },
    action: '阅读公开案例',
    accent: 'gold',
  },
  {
    icon: UsersIcon,
    name: '心理咨询机构',
    scene: '认识困扰与求助方式',
    text: '让使用者了解不同的经历和支持方式，为进一步表达需求和寻求专业帮助提供线索。',
    to: { path: '/cases' },
    action: '了解不同的求助经历',
    accent: 'blue',
  },
]
</script>
<template>
  <section class="page scenarios-page">
    <div class="page-inner">
      <SectionHeading
        eyebrow="应用场景"
        title="让支持，出现在更贴近生活的地方"
        description="从校园到社区，围绕具体困扰提供表达与科普入口。使用者可以按自己的节奏交流，需要时继续寻求专业帮助。"
      />
      <div class="scenario-grid">
        <article v-for="(item, index) in scenarios" :key="item.name" :data-accent="item.accent">
          <span class="scenario-icon"><component :is="item.icon" :size="25" /></span
          ><small>0{{ index + 1 }} · {{ item.scene }}</small>
          <h2>{{ item.name }}</h2>
          <p>{{ item.text }}</p>
          <RouterLink class="text-link" :to="item.to"
            >{{ item.action }}<ArrowRightIcon :size="17"
          /></RouterLink>
        </article>
      </div>
      <section class="product-forms">
        <div>
          <p class="section-kicker">现在与下一步</p>
          <h2>从完整的Web体验开始</h2>
          <p>先做好当前功能，再拓展适合不同使用情境的触达方式。</p>
        </div>
        <div class="form-list">
          <article>
            <Globe2Icon :size="24" /><span class="form-status current">当前可体验</span>
            <h3>Web 平台</h3>
            <p>文字与语音对话、会话管理、数据探索和案例阅读。</p>
            <RouterLink class="text-link" to="/consultation"
              >开始体验 <ArrowRightIcon :size="17"
            /></RouterLink>
          </article>
          <article>
            <SmartphoneIcon :size="24" /><span class="form-status">后续规划</span>
            <h3>微信小程序</h3>
            <p>探索更轻量的移动入口与校园服务触达。</p>
          </article>
          <article>
            <PuzzleIcon :size="24" /><span class="form-status">后续规划</span>
            <h3>医疗平台插件</h3>
            <p>探索经授权的机构资源连接和辅助信息整理。</p>
          </article>
        </div>
      </section>
      <section class="scenario-bottom">
        <div>
          <h2>从此刻最想表达的感受开始</h2>
          <p>选择适合你的陪伴方式，或先读一段与你有关的经历。</p>
        </div>
        <RouterLink class="button primary" to="/consultation"
          >开始智能支持 <ArrowRightIcon :size="18"
        /></RouterLink>
      </section>
    </div>
  </section>
</template>
<style scoped>
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px;
}
.scenario-grid article {
  --accent: var(--teal);
  --accent-bg: var(--teal-soft);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
}
.scenario-grid article[data-accent='coral'] {
  --accent: var(--coral);
  --accent-bg: var(--coral-soft);
}
.scenario-grid article[data-accent='gold'] {
  --accent: var(--gold);
  --accent-bg: var(--gold-soft);
}
.scenario-grid article[data-accent='blue'] {
  --accent: var(--blue);
  --accent-bg: #e8eff4;
}
.scenario-icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 20px;
  border-radius: 16px;
  color: var(--accent);
  background: var(--accent-bg);
}
.scenario-grid small {
  color: var(--accent);
  font-size: 12px;
}
.scenario-grid h2 {
  margin: 10px 0 14px;
  font-size: 24px;
  font-weight: 500;
}
.scenario-grid p {
  margin: 0 0 18px;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.9;
}
.scenario-grid a {
  margin-top: auto;
}
.product-forms {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: 50px;
  margin-top: 58px;
  padding-top: 40px;
  border-top: 1px solid var(--line);
}
.product-forms h2 {
  margin: 0 0 14px;
  font-size: 27px;
  font-weight: 500;
}
.product-forms > div > p:last-child {
  color: var(--ink-soft);
  font-size: 16px;
}
.form-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.form-list article {
  padding: 18px 0 0 16px;
  border-left: 2px solid #ccddca;
}
.form-list svg {
  display: block;
  margin-bottom: 16px;
  color: var(--teal);
}
.form-status {
  display: block;
  color: var(--ink-soft);
  font-size: 12px;
}
.form-status.current {
  color: var(--teal);
}
.form-list h3 {
  margin: 9px 0 10px;
  font-size: 18px;
  font-weight: 500;
}
.form-list p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
}
.form-list a svg {
  margin-bottom: 0;
}
.scenario-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 48px;
  padding: 28px;
  border-radius: 14px;
  background: #edf2e8;
}
.scenario-bottom h2 {
  margin: 0 0 10px;
  font-size: 23px;
  font-weight: 500;
}
.scenario-bottom p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 14px;
}
.scenario-bottom .button {
  flex-shrink: 0;
}
@media (max-width: 1023px) {
  .product-forms {
    grid-template-columns: 1fr;
    gap: 22px;
  }
}
@media (max-width: 600px) {
  .scenario-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .scenario-grid article {
    padding: 22px;
  }
  .scenario-grid h2 {
    font-size: 22px;
  }
  .form-list {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .scenario-bottom {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px;
  }
  .scenario-bottom h2 {
    font-size: 21px;
  }
}
</style>
