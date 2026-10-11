import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeAppInstall } from './composables/useAppInstall'
import './styles/base.css'
import './styles/theme.css'
import './styles/motion.css'

const app = createApp(App)
const cleanupAppInstall = initializeAppInstall()
app.onUnmount(cleanupAppInstall)
app.use(createPinia()).use(router).mount('#app')

// App-only scope: the product website and API stay outside this worker.
if (import.meta.env.PROD && 'serviceWorker' in navigator && window.isSecureContext) {
  void navigator.serviceWorker.register('/sw.js', { scope: '/app' }).catch(() => {
    // Installation is optional; the connected web app continues to work.
  })
}
