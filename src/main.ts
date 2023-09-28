import { createApp } from 'vue'
import './recreaingles.css'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router.js'
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import 'animate.css';
import { emitter } from './bus.js'
import 'daisyui/dist/styled.css'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'




declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    emitter: typeof emitter
  }
}


localStorage.theme = 'recrea'
document.getElementsByTagName('html')[0].setAttribute('class', 'recrea')

const app = createApp(App)
const pinia = createPinia()
app.use(VueVideoPlayer)
app.use(FloatingVue)
app.use(pinia)
app.use(router)
app.config.globalProperties.emitter = emitter
app.mount('#app')




