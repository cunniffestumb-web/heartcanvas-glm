import { createApiApp } from './app.js'
import { getServerPort } from './config.js'

const port = getServerPort()
const app = createApiApp()

app.listen(port, '127.0.0.1', () => {
  console.log(`[api] 心绘 GLM 服务已启动：http://127.0.0.1:${port}`)
})
