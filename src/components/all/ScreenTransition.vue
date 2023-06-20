<template>
    <div id="bouncy" ref="container" class="fixed inset-0 h-screen w-screen overflow-clip z-50 pointer-events-none" v-if="visible"></div>
</template>

<script setup>
import mojs from '@mojs/core'
import ShapesAnimation from './ShapesAnimation.js'
const visible = ref(true)
const container = ref(null)


onMounted(() => {

    ShapesAnimation.play(container.value)

    const square = new mojs.Shape({
        parent: '#bouncy',
        shape: 'rect',
        fill: '#e11d48',
        left: '50%',
        radius: 1000,
        fillOpacity: { 1: 0 },
        duration: 300
    }).play()
    
    const circle = new mojs.Shape({
        parent: "#bouncy",
        shape: 'circle',
        //scale:{ 0.1 : 1 },
        left: '50%',
        fill: 'none',
        stroke: '#e11d48',
        strokeWidth: { 1000: 100 },
        radius: { 300: 1000 },
        duration: 1000,
        repeat: 0,
        onComplete: () => {
            visible.value = false
            
        }
    }).play();
})

</script>