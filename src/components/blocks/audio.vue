<template>
<div ref="block" :class="['flex gap-0.5 items-center justify-center']">
    <button :class="['btn relative aspect-square  p-0.5 flex-grow-0 m-2', (playing?'btn-primary':'btn-secondary'), data.class || '']" @click="clicked" :disabled="!sound && !wavesurfer" >
        <iconify-icon icon="solar:play-stream-bold-duotone" :class="['absolute text-4xl', !playing?'animate-in zoom-in':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
        <iconify-icon icon="solar:stop-circle-line-duotone" :class="['absolute text-4xl', playing?'repeat-infinite animate-pulse duration-500 ease-in-out':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
    </button>
    <div v-if="data.wave" ref="blockwave" class="flex-grow bg-white rounded p-2 min-w-[200px] w-full"></div>

</div>
</template>
<script setup>
import WaveSurfer from 'wavesurfer.js'
import Record from 'wavesurfer.js'

import { useOda } from "../../store/oda.js"

const oda = useOda()
const sound = ref(null)
const playing = ref(false)
const block = ref()
const blockwave = ref()
const wavesurfer = ref(null)

//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})


const filepath = computed(()=>{
  return props.data.file.includes('http')? props.data.file :oda.baseurl+'/ODAS/'+oda.odaID+'/'+props.data.file
})


watch(()=>filepath, () => {
    init()
}, {deep:true})


const init = async () => {
    if(!filepath.value){
        return false
    }
    if(props.data.wave ){
        if(!blockwave.value){
            return false
        }
        

        blockwave.value.innerHTML = ""
        
        wavesurfer.value = WaveSurfer.create({
            container: blockwave.value,
            waveColor: '#00a8e1',
            progressColor: '#e7004c',
            barWidth: 8,
            barGap: 1,
            barRadius: 4,
            cursorWidth: 10,
            fillParent: true,
            splitChannels: false,
            normalize: true
        })



        wavesurfer.value.load(filepath.value)

        wavesurfer.value.on('interaction', () => {
            wavesurfer.value.play()
        })
        wavesurfer.value.on('play', () => {
           playing.value = true
        })
        wavesurfer.value.on('pause', () => {
            playing.value = false
        })



    } else {
        sound.value = new Howl({
            src: [filepath.value], volume: 1, autoplay:props.data.autoplay || false,
            onplay: () => { playing.value = true },
            onend: () => { playing.value = false },
            onstop: () => { playing.value = false },
        })



    }


    
   
}
onMounted(() => {
    init()
})

const clicked = async () => {

    if(playing.value){
        if(props.data.wave){
            wavesurfer.value.stop()
        } else {
            sound.value.stop()
        }
    } else {
        if(props.data.wave){
            wavesurfer.value.play()
        } else {
            sound.value.play()
        }
    }


    
}

</script>