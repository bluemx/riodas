<template>
<div :class="['mockup-window border bg-slate-100 px-2 pb-2', data.class || '']">
    <video-player
    class="rounded-2xl overflow-clip "
    :src="filepath"
    :poster="posterpath"
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

const filepath = '/ODAS/'+oda.odaID+'/'+props.data.file
const posterpath = '/ODAS/'+oda.odaID+'/'+props.data.poster


const vmounted = () => {}
const vready = () => {}
const vplay = () => {}
const vpause = () => {}
const vended = () => {}
const vseeking = () => {}

onMounted(() => {
    
})
/*
const dialog = ref()
onMounted(() => {
  dialog.value.show()  
})
*/

</script>