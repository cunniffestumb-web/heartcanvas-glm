# 心绘 GLM MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished six-page Vue application with five linked ECharts visualizations, a safe psychological-support chat, and an Anthropic-compatible DeepSeek proxy with automatic mock fallback.

**Architecture:** The Vite client owns presentation, navigation, mock statistics, and Pinia state. An Express server owns crisis checks, provider credentials, upstream requests, response normalization, and fallback. Shared chat contracts keep online and mock replies interchangeable.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, Pinia, Apache ECharts, echarts-wordcloud, Lucide Vue, Express, Anthropic SDK, Vitest, Vue Test Utils, Supertest.

## Global Constraints

- Never expose the real API token to browser code, committed files, logs, README, or screenshots.
- Store the token only in local `.env`; commit only `.env.example` with empty values.
- Use `https://api.deepseek.com/anthropic` and official model ID `deepseek-v4-pro`.
- Mark all psychology statistics as demonstration data and never claim medical diagnosis.
- Crisis expressions must bypass normal advice and return immediate safety guidance.
- Keep cards at 8px radius or less, avoid nested cards, and support `prefers-reduced-motion`.
- Preserve a complete mock experience when the provider is absent or fails.

## File Map

- Root config: `package.json`, `vite.config.ts`, `tsconfig*.json`, `vitest.config.ts`, `.gitignore`, `.env.example`, `.env`, `index.html`.
- Shared contract: `shared/chat.ts` is the single source of truth for chat request and response types.
- Server: `server/index.ts`, `server/app.ts`, `server/config.ts`, `server/safety.ts`, `server/mockReply.ts`, `server/deepseekClient.ts`.
- App shell: `src/main.ts`, `src/App.vue`, `src/router/index.ts`, `src/components/layout/AppHeader.vue`.
- Shared UI: `src/components/common/SectionHeading.vue`, `StatCard.vue`, `FilterBar.vue`, `ModeBadge.vue`.
- Charts: `src/components/charts/BaseChart.vue`, five chart components, and `src/components/charts/chartOptions.ts`.
- Consultation: `src/components/consultation/ChatWindow.vue`, `ChatInput.vue`, `MessageBubble.vue`, `InsightPanel.vue`, `CrisisNotice.vue`.
- Pages: six files under `src/pages/`.
- State/services: `src/stores/gallery.ts`, `src/stores/consultation.ts`, `src/services/chatService.ts`, `src/services/statisticsService.ts`.
- Data/contracts: JSON fixtures under `src/data/mock/` plus `src/types/statistics.ts`; client and server both import chat contracts from `shared/chat.ts`.
- Styling/docs: `src/styles/base.css`, `src/styles/theme.css`, `src/styles/motion.css`, `README.md`.
- Tests: `tests/server/*.test.ts`, `tests/stores/*.test.ts`, `tests/services/*.test.ts`, `tests/components/*.test.ts`.

---

### Task 1: Project Foundation and App Shell

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Create: `.gitignore`, `.env.example`, `src/main.ts`, `src/App.vue`, `src/router/index.ts`
- Create: `src/components/layout/AppHeader.vue`, `src/styles/base.css`, `src/styles/theme.css`, `src/styles/motion.css`
- Test: `tests/components/app-shell.test.ts`

**Interfaces:**
- Produces: six named routes (`home`, `gallery`, `database`, `consultation`, `technology`, `scenarios`) and a reusable responsive header.

- [ ] **Step 1: Write the shell test**

```ts
it('exposes all six product routes', () => {
  expect(routes.map((route) => route.name)).toEqual([
    'home', 'gallery', 'database', 'consultation', 'technology', 'scenarios'
  ])
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- tests/components/app-shell.test.ts`
Expected: FAIL because the router and dependencies do not exist.

- [ ] **Step 3: Create the Vue/Vite configuration, dependencies, router, app shell, navigation, design tokens, reset, and reduced-motion rules**

```ts
export const routes = [
  { path: '/', name: 'home', component: () => import('../pages/HomePage.vue') },
  { path: '/gallery', name: 'gallery', component: () => import('../pages/GalleryPage.vue') },
  { path: '/database', name: 'database', component: () => import('../pages/DatabasePage.vue') },
  { path: '/consultation', name: 'consultation', component: () => import('../pages/ConsultationPage.vue') },
  { path: '/technology', name: 'technology', component: () => import('../pages/TechnologyPage.vue') },
  { path: '/scenarios', name: 'scenarios', component: () => import('../pages/ScenariosPage.vue') },
]
```

- [ ] **Step 4: Install dependencies and run the test**

Run: `npm install && npm test -- tests/components/app-shell.test.ts`
Expected: PASS with six routes.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json index.html vite.config.ts vitest.config.ts tsconfig*.json .gitignore .env.example src tests/components/app-shell.test.ts
git commit -m "feat: scaffold xinhui glm application shell"
```

### Task 2: Safety Classifier and Mock Support Engine

**Files:**
- Create: `shared/chat.ts`, `server/safety.ts`, `server/mockReply.ts`
- Test: `tests/server/safety.test.ts`, `tests/server/mock-reply.test.ts`

**Interfaces:**
- Produces: `detectCrisis(text: string): boolean`, `analyzeEmotion(text: string): ChatInsight`, and `createMockReply(text: string): ChatResponse`.
- Produces shared values from `shared/chat.ts`: `RiskLevel`, `ChatInsight`, `ChatMessage`, `ChatRequest`, `ChatResponse`.

- [ ] **Step 1: Write failing crisis and emotion tests**

```ts
expect(detectCrisis('我真的活不下去了')).toBe(true)
expect(detectCrisis('最近考试压力很大')).toBe(false)
expect(analyzeEmotion('考试让我焦虑，晚上睡不着')).toMatchObject({
  emotion: '焦虑', riskLevel: '中', keywords: expect.arrayContaining(['考试', '睡眠'])
})
```

- [ ] **Step 2: Run the tests and verify missing-module failures**

Run: `npm test -- tests/server/safety.test.ts tests/server/mock-reply.test.ts`
Expected: FAIL because the safety modules do not exist.

- [ ] **Step 3: Implement deterministic crisis detection, emotion scoring, and structured mock replies**

```ts
export function detectCrisis(text: string) {
  return ['自杀', '想死', '活不下去', '伤害自己', '伤害别人'].some((word) => text.includes(word))
}
```

The crisis reply must begin with concern for immediate safety and direct the user to emergency care, a nearby emergency department, or a trusted person. Ordinary replies must contain empathy, a small actionable step, and a professional-help reminder.

- [ ] **Step 4: Run the focused tests**

Run: `npm test -- tests/server/safety.test.ts tests/server/mock-reply.test.ts`
Expected: PASS for ordinary, mixed-emotion, and crisis inputs.

- [ ] **Step 5: Commit**

```bash
git add server src/types tests/server
git commit -m "feat: add psychological support safety engine"
```

### Task 3: Anthropic-Compatible Provider and API Fallback

**Files:**
- Create: `server/config.ts`, `server/deepseekClient.ts`, `server/app.ts`, `server/index.ts`
- Test: `tests/server/chat-api.test.ts`
- Modify: `package.json`, `vite.config.ts`, `.env.example`
- Local only: `.env`

**Interfaces:**
- Consumes: `detectCrisis`, `createMockReply`, `ChatResponse`.
- Produces: `GET /api/health`, `POST /api/chat`, `requestOnlineReply(messages, context): Promise<ChatResponse>`.

- [ ] **Step 1: Write API tests with an injected provider**

```ts
expect((await request(app).get('/api/health')).body).toMatchObject({ ok: true })
expect((await request(app).post('/api/chat').send({ messages: [{ role: 'user', content: '我很焦虑' }] })).body.mode).toBe('mock')
expect((await request(app).post('/api/chat').send({ messages: [{ role: 'user', content: '我想伤害自己' }] })).body.message.riskLevel).toBe('高')
```

- [ ] **Step 2: Run the API test and verify it fails**

Run: `npm test -- tests/server/chat-api.test.ts`
Expected: FAIL because the Express app does not exist.

- [ ] **Step 3: Implement config validation, the Anthropic SDK adapter, a 20-second timeout, request limits, response normalization, and mock fallback**

```ts
const client = new Anthropic({
  apiKey: config.authToken,
  baseURL: config.baseUrl,
})
```

Use `deepseek-v4-pro`, `max_tokens: 900`, and a Chinese non-diagnostic system prompt. Never return upstream errors or environment values to the browser.

- [ ] **Step 4: Create local `.env` and verify online configuration**

Set the supplied token only in `.env`, with official model ID `deepseek-v4-pro`. Run: `npm test -- tests/server/chat-api.test.ts` and then request `/api/health` and `/api/chat` from the running server.
Expected: tests PASS; health reports configured without revealing values; chat reports `online` when upstream succeeds and `mock` when forced to fail.

- [ ] **Step 5: Commit without staging `.env`**

```bash
git add server package.json package-lock.json vite.config.ts .env.example tests/server/chat-api.test.ts
git commit -m "feat: add secure model proxy with fallback"
```

### Task 4: Mock Statistics and Linked Gallery State

**Files:**
- Create: `src/types/statistics.ts`, `src/data/mock/*.json`
- Create: `src/services/statisticsService.ts`, `src/stores/gallery.ts`
- Test: `tests/stores/gallery.test.ts`

**Interfaces:**
- Produces: `GalleryFilters`, `RegionRecord`, `getGalleryDataset(filters)`, and Pinia actions `setFilter`, `selectRegion`, `resetFilters`.

- [ ] **Step 1: Write failing state tests**

```ts
store.setFilter('population', '大学生')
store.selectRegion('北京')
expect(store.filters.population).toBe('大学生')
expect(store.selectedRegion?.name).toBe('北京')
expect(store.chartRevision).toBeGreaterThan(0)
```

- [ ] **Step 2: Run the store test and verify it fails**

Run: `npm test -- tests/stores/gallery.test.ts`
Expected: FAIL because the store and fixtures do not exist.

- [ ] **Step 3: Add clearly labeled demonstration datasets for 2020-2025, all selectable populations/emotions, province records, database rows, and keywords; implement deterministic filter transforms**

```ts
const factor = populationFactors[filters.population] * emotionFactors[filters.emotionType]
return base.map((point) => ({ ...point, value: Math.round(point.value * factor) }))
```

- [ ] **Step 4: Run the store test**

Run: `npm test -- tests/stores/gallery.test.ts`
Expected: PASS and every filter combination returns finite chart values.

- [ ] **Step 5: Commit**

```bash
git add src/data src/types/statistics.ts src/services src/stores tests/stores
git commit -m "feat: add linked demonstration statistics"
```

### Task 5: Five Responsive ECharts Visualizations

**Files:**
- Create: `src/components/charts/BaseChart.vue`, `TrendLineChart.vue`, `ChinaRiskMap.vue`, `PopulationRadarChart.vue`, `EmotionStackedBar.vue`, `KeywordCloud.vue`, `chartOptions.ts`
- Add: `src/assets/china.geo.json`
- Test: `tests/components/chart-options.test.ts`

**Interfaces:**
- Consumes: typed datasets and selected-region events.
- Produces: five stable-size accessible chart components and pure option builders.

- [ ] **Step 1: Write failing option-builder tests**

```ts
expect(buildTrendOption(dataset, context).series).toHaveLength(4)
expect(buildMapOption(regions).visualMap).toBeTruthy()
expect(buildRadarOption(populations).radar.indicator).toHaveLength(5)
```

- [ ] **Step 2: Run the chart test and verify it fails**

Run: `npm test -- tests/components/chart-options.test.ts`
Expected: FAIL because option builders do not exist.

- [ ] **Step 3: Implement pure options, ECharts registration, ResizeObserver cleanup, map click emission, loading and empty states, unified tooltip and animation timings**

```ts
chart.on('click', (params) => {
  if (props.clickable && typeof params.name === 'string') emit('select', params.name)
})
```

- [ ] **Step 4: Run chart tests and build**

Run: `npm test -- tests/components/chart-options.test.ts && npm run build:web`
Expected: PASS; no TypeScript or bundling error.

- [ ] **Step 5: Commit**

```bash
git add src/components/charts src/assets tests/components/chart-options.test.ts
git commit -m "feat: add interactive psychology visualizations"
```

### Task 6: Product Pages and Gallery Workflow

**Files:**
- Create: `src/components/common/*.vue`, `src/pages/HomePage.vue`, `GalleryPage.vue`, `DatabasePage.vue`, `TechnologyPage.vue`, `ScenariosPage.vue`
- Test: `tests/components/product-pages.test.ts`

**Interfaces:**
- Consumes: router, gallery store, chart components, demonstration database rows.
- Produces: complete home, gallery, database, technology, and scenarios routes; gallery-to-consultation query handoff.

- [ ] **Step 1: Write route-level rendering tests**

```ts
expect(wrapper.get('h1').text()).toContain('心绘 GLM')
expect(gallery.findAll('[data-chart]')).toHaveLength(5)
expect(database.text()).toContain('演示数据')
```

- [ ] **Step 2: Run tests and verify missing-page failures**

Run: `npm test -- tests/components/product-pages.test.ts`
Expected: FAIL because product pages are not implemented.

- [ ] **Step 3: Implement the five pages, filter controls, region detail, data table filtering, CTA routing, compact entrance motion, and explicit demonstration-data labels**

The gallery consultation CTA must route with `region`, `population`, and `emotion` query keys. The homepage must expose both primary product entrances in the first viewport.

- [ ] **Step 4: Run page tests and web build**

Run: `npm test -- tests/components/product-pages.test.ts && npm run build:web`
Expected: PASS and five routes bundle successfully.

- [ ] **Step 5: Commit**

```bash
git add src/components/common src/pages tests/components/product-pages.test.ts
git commit -m "feat: build xinhui glm product pages"
```

### Task 7: Consultation Experience

**Files:**
- Create: `src/stores/consultation.ts`, `src/services/chatService.ts`
- Create: `src/components/consultation/*.vue`, `src/pages/ConsultationPage.vue`
- Test: `tests/services/chat-service.test.ts`, `tests/components/consultation.test.ts`

**Interfaces:**
- Consumes: `/api/health`, `/api/chat`, route query context, shared `ChatResponse`.
- Produces: `sendMessage(content: string)`, online/mock mode badge, crisis notice, and reactive insight panel.

- [ ] **Step 1: Write failing service and component tests**

```ts
await store.sendMessage('考试让我焦虑，晚上睡不着')
expect(store.messages.at(-1)?.role).toBe('assistant')
expect(store.insight.keywords).toContain('睡眠')
expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
```

- [ ] **Step 2: Run the tests and verify failures**

Run: `npm test -- tests/services/chat-service.test.ts tests/components/consultation.test.ts`
Expected: FAIL because the consultation layer does not exist.

- [ ] **Step 3: Implement the three-column desktop layout, mobile stacking, seeded sessions, message bubbles, loading indicator, autosizing input, mode badge, context banner, insight updates, and immediate crisis rendering**

```ts
if (!trimmed || store.isSending) return
await store.sendMessage(trimmed)
```

- [ ] **Step 4: Run consultation tests and full unit suite**

Run: `npm test`
Expected: all server, store, service, chart, page, and consultation tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/consultation src/pages/ConsultationPage.vue src/stores/consultation.ts src/services/chatService.ts tests
git commit -m "feat: add safe intelligent consultation experience"
```

### Task 8: Documentation, Build, API, and Visual Verification

**Files:**
- Create: `README.md`
- Modify: CSS and components only for verified defects.

**Interfaces:**
- Produces: reproducible setup instructions, final builds, running local server, desktop/mobile evidence.

- [ ] **Step 1: Write README with project purpose, stack, page list, commands, mock behavior, API configuration, safety statement, and troubleshooting**

Document `npm install`, `npm run dev`, `npm test`, `npm run build`, local `.env` variables, the official model ID, and the meaning of online/mock badges.

- [ ] **Step 2: Run complete automated verification**

Run: `npm test && npm run build`
Expected: all tests PASS; client and server builds exit 0.

- [ ] **Step 3: Start the development server and exercise API paths**

Verify `/api/health`, ordinary chat, and crisis chat. Confirm ordinary chat is online with valid credentials; otherwise capture the sanitized upstream status and verify mock fallback.

- [ ] **Step 4: Inspect every route at 1440x1000 and 390x844**

Capture screenshots and verify nonblank charts, correct China map framing, active navigation, filter updates, province selection, query handoff, table filtering, chat loading, mode badge, crisis notice, no overlap, no clipped text, and no horizontal scroll.

- [ ] **Step 5: Fix visual defects and repeat tests, build, and screenshots**

Expected: no console errors, layout overflow, blank canvases, overlapping UI, or unusable controls.

- [ ] **Step 6: Commit final documentation and polish**

```bash
git add README.md src server tests package.json package-lock.json .env.example
git commit -m "docs: finalize xinhui glm mvp"
```
