# 心绘 GLM

心绘 GLM 是一个“心理数据可视化 + 智能心理支持入口”的演示型 MVP。平台通过陈列馆、数据库和诊疗室呈现从识别、分析到支持建议的完整链路，同时保留 ChatGLM2-6B、LoRA、Prompt、LangChain 与心理知识图谱的项目技术叙事。

> 本项目不提供医学诊断，不能替代专业心理咨询、医疗服务或紧急救助。网站内所有统计记录均为演示数据，不代表真实流行病学结论。

## 页面

- 首页：项目价值、核心入口、指标预览和“识别 → 分析 → 干预”闭环。
- 陈列馆：趋势折线图、中国风险地图、人群雷达图、情绪堆叠柱状图和关键词云。
- 数据库：数据来源、治理流程、四维标签体系、演示记录和 API 能力。
- 诊疗室：在线模型或 mock 回复、实时情绪分析、风险等级和危机提示。
- 技术亮点：ChatGLM2-6B、LoRA、Prompt、LangChain、心理知识图谱和训练策略。
- 应用场景：学校、医院辅助预筛查、社区、心理咨询机构及未来方向。

## 技术栈

- Vue 3 + TypeScript + Vite
- Vue Router + Pinia
- Apache ECharts
- Express + Anthropic SDK
- Vitest + Vue Test Utils + Supertest

## 本地运行

安装依赖：

```bash
npm install
```

复制环境配置：

```powershell
Copy-Item .env.example .env
```

启动前端和 API 服务：

```bash
npm run dev
```

默认访问地址为 `http://127.0.0.1:5173`，API 服务为 `http://127.0.0.1:8787`。

## DeepSeek 在线模式

服务端使用 DeepSeek 的 Anthropic 兼容接口。真实密钥只能写入本地 `.env`：

```bash
ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
ANTHROPIC_AUTH_TOKEN=你的_API_Key
ANTHROPIC_MODEL=deepseek-v4-pro
PORT=8787
```

模型名应使用官方 ID `deepseek-v4-pro`。`deepseek-v4-pro[1m]` 不是官方模型 ID；1M 上下文能力已属于 Pro 模型规格。DeepSeek 的 Anthropic 兼容说明见 [官方文档](https://api-docs.deepseek.com/guides/anthropic_api)。

密钥不会发送到浏览器，也不会出现在健康检查响应中。前端只请求同源 `/api/chat`，由 Express 代理调用模型。

## Mock 模式与回退

以下任一情况发生时，聊天会自动切换为演示模式：

- 未配置 `ANTHROPIC_AUTH_TOKEN`。
- API 服务没有启动或网络不可达。
- 上游模型超时、拒绝请求或返回错误。

演示模式仍提供关键词识别、情绪分类、风险等级、行动建议和危机提示。页面右上角会显示“DeepSeek 在线模式”或“演示模式”。

## 验证

运行全部测试：

```bash
npm test
```

执行前端与服务端生产构建：

```bash
npm run build
```

## 安全边界

- 不输出医学诊断或确定性疾病判断。
- 普通回复按共情、情绪识别、可能压力来源、具体行动和专业帮助提示组织。
- 自伤、自杀、伤害他人等表达会优先进入危机响应，不展示复杂推理。
- 危机响应建议立即联系当地急救、附近医院急诊、专业危机资源或身边可信赖的人。
- `.env` 已被 `.gitignore` 忽略；不要把真实密钥写入 `.env.example`、源码、README 或前端环境变量。

## 数据与地图

当前统计数据位于 `src/data/mock/`，均为项目演示数据，可替换为真实的后端统计接口。中国地图 GeoJSON 已随项目本地化，来源为阿里云 DataV 地理数据服务，页面运行时不依赖第三方地图请求。
