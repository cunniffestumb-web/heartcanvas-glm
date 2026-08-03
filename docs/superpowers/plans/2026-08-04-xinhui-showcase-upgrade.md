# 心绘 GLM 评委展示版升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复数据图表并把咨询页升级为可持久化、可定制人格、支持浏览器语音通话的评委展示版本。

**Architecture:** 图表继续通过纯函数生成 ECharts 配置；会话和人格由 Pinia 管理并通过独立存储服务持久化；语音能力封装为浏览器能力服务与独立通话组件。服务端只接收经过长度限制的人格配置，并把它附加在不可覆盖的安全系统提示之后。

**Tech Stack:** Vue 3、TypeScript、Pinia、ECharts 6、Express、Anthropic SDK、Web Speech API、Vitest。

## Global Constraints

- 不新增云语音服务，不上传原始录音。
- 危机分流始终优先于人格与在线模型。
- 不在评委界面展示密钥、mock、MVP、接口地址或开发状态。
- 所有生产行为先有失败测试，再做最小实现。

---

### Task 1: 图表完整性

**Files:**
- Modify: `tests/components/chart-options.test.ts`
- Modify: `tests/stores/gallery.test.ts`
- Modify: `src/components/charts/chartOptions.ts`
- Modify: `src/components/charts/echartsRuntime.ts`
- Modify: `src/data/mock/regions.json`

- [ ] 增加失败测试：词云使用可见的 scatter 文字节点，地图覆盖全部省级行政区且值均有限。
- [ ] 运行对应测试并确认因现有 graph 词云和 12 条区域数据失败。
- [ ] 实现 scatter 词云并补齐地图数据，同时为提示框增加有限数值保护。
- [ ] 运行图表和数据测试并确认通过。

### Task 2: 会话与人格领域模型

**Files:**
- Create: `src/types/consultation.ts`
- Create: `src/services/conversationStorage.ts`
- Create: `tests/services/conversation-storage.test.ts`
- Modify: `shared/chat.ts`
- Modify: `src/stores/consultation.ts`
- Create: `tests/stores/consultation.test.ts`
- Modify: `server/deepseekClient.ts`
- Create: `tests/server/deepseek-client.test.ts`

- [ ] 增加失败测试：保存恢复会话、切换、重命名、删除、自动标题和人格请求。
- [ ] 实现版本化 localStorage 数据结构与四种内置人格。
- [ ] 重写 Pinia store，使当前消息派生自当前会话并在变更时持久化。
- [ ] 把经过裁剪的人格说明添加到 DeepSeek 系统提示，安全规则保持最高优先级。
- [ ] 运行新增测试并确认通过。

### Task 3: 会话、人设与语音界面

**Files:**
- Create: `src/components/consultation/SessionSidebar.vue`
- Create: `src/components/consultation/DoctorProfilePanel.vue`
- Create: `src/components/consultation/VoiceCallPanel.vue`
- Create: `src/services/voiceService.ts`
- Create: `tests/services/voice-service.test.ts`
- Modify: `src/components/consultation/ChatInput.vue`
- Modify: `src/pages/ConsultationPage.vue`
- Modify: `src/env.d.ts`

- [ ] 增加失败测试：中文声音筛选和人格声音匹配。
- [ ] 实现语音选择、朗读、识别能力检测和通话状态。
- [ ] 实现会话侧栏、医生人格面板和通话覆盖层。
- [ ] 接通发送、自动朗读、改名删除和自定义人格事件。
- [ ] 运行组件与服务测试并确认通过。

### Task 4: 评委展示文案

**Files:**
- Modify: `src/pages/HomePage.vue`
- Modify: `src/pages/GalleryPage.vue`
- Modify: `src/pages/DatabasePage.vue`
- Modify: `src/pages/TechnologyPage.vue`
- Modify: `src/components/common/ModeBadge.vue`
- Modify: `tests/components/product-pages.test.ts`

- [ ] 增加失败测试：关键页面不出现 MVP、mock、本地演示与接口地址。
- [ ] 用面向产品价值的真实措辞替换内部文字并删除接口展示区。
- [ ] 运行页面测试并确认通过。

### Task 5: 集成验收

**Files:**
- Modify: `README.md`

- [ ] 运行 `npm test`，要求全部通过且无未处理错误。
- [ ] 运行 `npm run build`，要求前后端构建退出码为 0。
- [ ] 验证 `/api/health` 在线并进行一次真实对话请求。
- [ ] 在桌面和手机视口检查词云、完整地图、会话切换、人格定制和语音面板。
- [ ] 运行依赖安全、密钥隔离与 Git 差异检查后提交。
