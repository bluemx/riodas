<template>
<div v-if="filepath" :class="['mockup-window border bg-slate-100 px-2 pb-2', data.class || '']">
  <video-player
    crossorigin="anonymous"
    class="rounded-2xl overflow-clip "
    :src="filepath"
    
    aspect-ratio="1:1"
    :fluid="true"
    controls
    :loop="data.loop || false"
    :volume="data.volume || 1"
    @mounted="vmounted"
    @ready="vready"
    @play="vplay"
    @pause="vpause"
    @ended="vended"
    @seeking="vseeking"
    ref="video"
  />

</div>

</template>
<script setup>
import { useOda } from "../../store/oda.js"


const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})
const video = ref()


const filepath = computed(() => {
  const f = props?.data?.file || ''
  return /^(https?:|data:|blob:|\/\/)/i.test(f)
    ? f
    : `${oda.baseurl}/ODAS/${oda.odaID}/${f}`
})

const posterpath = computed(() => {
  const p = props?.data?.poster || ''
  return /^(https?:|data:|blob:|\/\/)/i.test(p)
    ? p
    : `${oda.baseurl}/ODAS/${oda.odaID}/${p}`
})


const vmounted = () => {}
const vready = (itm) => {
  itm.target.player.crossOrigin = "anonymous"
  itm.target.player.posterImage = posterpath
}
const vplay = () => {}
const vpause = () => {}
const vended = () => {}
const vseeking = () => {}




</script>