import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router.js'
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import 'animate.css';
import { emitter } from './bus.js'
import 'daisyui/dist/styled.css'


declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    emitter: typeof emitter
  }
}




const app = createApp(App)
const pinia = createPinia()
app.use(VueVideoPlayer)

app.use(pinia)
app.use(router)
app.config.globalProperties.emitter = emitter
app.mount('#app')




