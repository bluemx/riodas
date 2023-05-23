import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router.js'

import { emitter } from './bus.js'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    emitter: typeof emitter
  }
}



const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.config.globalProperties.emitter = emitter
app.mount('#app')



