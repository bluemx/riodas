<template>
<div v-if="filepath" :class="['mockup-window border bg-slate-100 px-2 pb-2', data.class || '']">
  <video-player
    crossorigin="anonymous"
    class="rounded-2xl overflow-clip "
    :src="filepath"
    poster
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
const filepath = ref()
const posterpath = ref()


watch((props), () => {
  if(props.data.file){
    filepath.value = '/ODAS/'+oda.odaID+'/'+props.data.file  
  }
  if(props.data.poster){
    posterpath.value = '/ODAS/'+oda.odaID+'/'+props.data.poster
  }

  if(props.data.file.includes('http')){
    filepath.value = props.data.file
  }
  if(props.data.poster.includes('http')){
    posterpath.value = props.data.poster
  }
  video.poster = posterpath.value
}, {deep:true})





const vmounted = () => {}
const vready = () => {}
const vplay = () => {}
const vpause = () => {}
const vended = () => {}
const vseeking = () => {}




</script>