<template>
<div ref="wrapper" class="relative">
    <div :class="['flex justify-center items-center gap-1 cursor-pointer text-white font-bold p-1 rounded ', 'bg-red-500']" @click="toggle">
        <iconify-icon icon="solar:info-square-outline"></iconify-icon>
        <div class="text-xs">Instrucciones</div>
    </div>
    <!--backdrop:backdrop-blur-sm open:backdrop:animate-in open:backdrop:fade-in open:backdrop:duration-500-->
    
    <dialog id="instructions" ref="dialog" class="bg-red-500 text-white z-50 shadow-xl rounded-lg p-1 animate-in slide-in-from-top spin-in focus:outline-none m-0 mt-2 absolute top-full -translate-y-1 right-0 left-auto min-w-[220px] md:min-w-[420px]  ">
        <div class="p-1 flex items-center justify-between  gap-4">
            <div class="font-bold">Instrucciones</div>
            <div @click="close" class="cursor-pointer  flex justify-center"><iconify-icon icon="solar:close-square-outline"></iconify-icon></div>
        </div>
        <div class="p-1 text-sm !text-white">
            <Content :data="item" v-for="(item, index) in data.content" :key="index" :blockindex="'instructions-'+index"></Content>
        </div>
    </dialog>
</div>
</template>
<script setup>


import sound1 from '../../assets/uisound/question_004.mp3'
import sound2 from '../../assets/uisound/glass_002.mp3'
import ShapesAnimation from './ShapesAnimation.js'
const isopen = ref(false)
const props = defineProps({
    data: Object,
    first: Boolean
})
const wrapper = ref(null)
const dialog = ref(null)
const buttonColor = ref('bg-white')
const open = () => {
    isopen.value = true
    dialog.value.show()
    ShapesAnimation.play(dialog.value)
    buttonColor.value='text-accent scale-110'
    setTimeout(()=>{
        buttonColor.value='text-primary scale-100'
        new Howl({ src: [sound1], rate: 1, volume: 0.2, autoplay:true })
    },240)
}
const toggle = () => {
    if(!dialog.value.open){
        open()
    } else {
        close()
    }
    
}
const close = () => {
    isopen.value = false
    dialog.value.close()
    new Howl({ src: [sound2], volume: 0.4, autoplay:true })
}

if(props.data.open){
    setTimeout(()=>{
        open()
    }, 800)
}

</script>
