/* No data or asset cache: only a static fallback for offline app navigations. */
const offlinePage = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#f7f6f2"><title>心绘 · 等待连接</title>
<style>html{color-scheme:light}*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:28px;background:#f7f6f2;color:#203c38;font:16px/1.8 system-ui,"Microsoft YaHei",sans-serif}main{width:min(100%,390px);text-align:center}svg{width:72px;height:72px;margin-bottom:18px}h1{font-size:23px;font-weight:600;margin:0 0 12px}p{color:#61736f;font-size:14px;margin:0 0 24px}a{display:inline-block;min-height:44px;padding:10px 24px;border-radius:14px;color:white;background:#617f6b;text-decoration:none}a:focus-visible{outline:3px solid #c97967;outline-offset:4px}small{display:block;margin-top:20px;color:#61736f;font-size:12px}</style></head>
<body><main><svg viewBox="0 0 100 100" role="img" aria-label="心绘"><rect width="100" height="100" rx="30" fill="#e4ebe0"/><path d="M50 73C40 65 22 50 22 37C22 24 42 22 50 37C58 22 78 24 78 37C78 50 60 65 50 73Z" fill="#fffefa" stroke="#617f6b" stroke-width="4"/><path d="M40 49Q50 59 60 49" fill="none" stroke="#c97967" stroke-width="3" stroke-linecap="round"/></svg><h1>稍等，心绘正在等你连接</h1><p>现在没有连上网络。连好后再回来，我们继续慢慢聊。</p><a href="/app">重新连接</a><small>离线页面无法显示或保存记录与对话。</small></main></body></html>`

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  const isApp = url.pathname === '/app' || url.pathname.startsWith('/app/')
  // The website, API, chat requests and all subresources use the browser normally.
  if (request.method !== 'GET' || request.mode !== 'navigate' || url.origin !== self.location.origin || !isApp) return
  event.respondWith(fetch(request).catch(() => new Response(offlinePage, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })))
})
