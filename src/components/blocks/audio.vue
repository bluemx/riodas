<template>
<button :class="['btn relative aspect-square text-3xl p-0.5', (playing?'btn-primary':'btn-secondary'), data.class || '']" @click="clicked" :disabled="!sound">
    <iconify-icon icon="solar:headphones-square-sound-bold" :class="['absolute', !playing?'animate-in zoom-in':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
    <iconify-icon icon="solar:soundwave-broken" :class="['absolute', playing?'repeat-infinite animate-pulse duration-500 ease-in-out':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
</button>

</template>
<script setup>
import { useOda } from "../../store/oda.js"
const oda = useOda()
const sound = ref(null)
const playing = ref(false)

//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})



const init = async () => {
    const file = await fetch('/ODAS/'+oda.odaID+'/'+props.data.file)
    sound.value = new Howl({
        src: [file.url], volume: 1, autoplay:false,
        onplay: () => { playing.value = true },
        onend: () => { playing.value = false },
        onstop: () => { playing.value = false },
    })
   
}

init()

const clicked = async () => {
    if(playing.value){
        sound.value.stop()
        return false
    }
    sound.value.play()
}

</script>