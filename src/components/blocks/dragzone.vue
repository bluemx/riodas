<template>

<div ref="block" :blockindex="blockindex" class="relative rounded p-1 border-2 border-dashed border-slate-400 min-w-[80px] min-h-[60px]" :class="[ data.class || '' ]">  </div>

</template>
<script setup>
import interact from 'interactjs'

const props = defineProps({
    data: Object,
    blockindex: String
})
const block = ref()

watch(()=>props.data,(nuv)=>{
    init()
}, {deep:true})

const init = () => {
    if(!block.value){
        return false
    }
    const dragzone = interact(block.value)
    if(!dragzone){
        return false
    }
    dragzone.dropzone({
        accetp: '.dragitem',
        ondropactivate: function (event) {
            //console.log('🔔 🔔 🔔 🔔 activate')
            event.target.classList.add('border-rose-500')
        },
        ondropdeactivate: function (event) {
            //console.log('🔔 🔔 🔔 🔔 DE - activate')
            event.target.classList.remove('border-rose-500')
        },
        ondrop: function (event) {
            //console.log('🔔 🔔 🔔 🔔 DROP!')
            block.value.appendChild(event.relatedTarget)
        },
        /*
        ondragleave: function (event) {
            console.log('bye', event.relatedTarget)
        }
        */
    })

}

onMounted(() => {
    init()
});

</script>