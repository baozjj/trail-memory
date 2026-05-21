import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-mobile-vue'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import 'tdesign-mobile-vue/es/style/index.css'
import './styles/tokens.css'
import './styles/base.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(TDesign)

async function bootstrap() {
  const authStore = useAuthStore(pinia)
  await authStore.bootstrap()
  app.mount('#app')
}

void bootstrap()
