<template>

<!--
<iconify-icon icon="solar:square-double-alt-arrow-down-line-duotone" class="text-neutral absolute opacity-25 pointer-events-none"></iconify-icon>
-->
<draggable
    :list="items"
    :group="{ name: data.group, pull: data.pull, put: data.put }"
    :sort="data.sort"
    @start ="onstart"
    @end ="onend"
    @change="onchange"
    :disabled="freeze"
    :scroll="true"
    :scroll-sensitivity="200"
    :force-fallback="true"
    :bubbleScroll="true"
    item-key="id"
    ref="block"
    :scroll-fn="watchScroll"
    :class="['draggable relative outline-dashed outline-1 outline-slate-200 bg-slate-100 rounded py-2 px-1 min-w-[60px] min-h-[24px] flex justify-center items-center', showResultClass, data.class || '']"
>   
    <template #header v-if="data.positive">
        <iconify-icon icon="solar:square-double-alt-arrow-down-line-duotone" class="text-neutral absolute opacity-25 pointer-events-none"></iconify-icon>
    </template>
    <template #item="{element}">
        <div class="btn btn-accent text-neutral shadow-md shadow-slate-500/50 cursor-move border-double border-b-4 border-neutral/50 relative flex justify-center items-center">
                <iconify-icon icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
                <Content :data="element" ></Content>
        </div>
    </template>
</draggable>



</template>
<script setup>

import { useOda } from "../../store/oda.js"
const oda = useOda()
import draggable from 'vuedraggable'
import sound1 from '../../assets/uisound/navigation_backward-selection-minimal.mp3'
import sound2 from '../../assets/uisound/navigation_unavailable-selection.mp3'
import sound3 from '../../assets/uisound/notification_decorative-01.mp3'
import sound4 from '../../assets/uisound/error_001.mp3'
import ShapesAnimation from "../all/ShapesAnimation";

const watchScroll = (offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) => {
     console.log('offsetY', offsetY)
    }

const props = defineProps({
    data: Object,
    blockindex: String
})
const block = ref(null)
const result = ref()
const attempts = ref(0)
const items = ref(JSON.parse(JSON.stringify(props.data.content)))
const drag = ref(false)

const freeze = ref(false)

if(oda.freeze){
    freeze.value = true
}

const onstart = () => {
    drag.value = true
    new Howl({ src: [sound2], rate: 1, volume: 1, autoplay:true })
}
const onchange = (e) => {
    attempts.value += 1
    if(items.value.length>1){
        items.value.push( items.value.splice(e.added.newIndex, 1)[0] )
    }
    if(e.added && props.data.positive){
        if(items.value.length > props.data.positive.length){
            items.value.splice(items.value.length-2,1)
        }
    }
    evaluate()
}
const showResultClass = ref()

const onend = (e) => {
    drag.value = false
    new Howl({ src: [sound1], rate: 1, volume: 1, autoplay:true })
}

const evaluate = (mute) => {
    // Freeze block if attempts limit
    if(props.data.attempts>0 && (attempts.value >= props.data.attempts)){
        freeze.value = true
    }
    //If has answer:positive it evaluates
    if(props.data.positive){
        // Get RESULT
        let itemsArrayOfIds = []
        itemsArrayOfIds = items.value.map((e)=>{return e.id})
        result.value = _.isEqual(itemsArrayOfIds, props.data.positive)

        
        //ShowResult
        if(props.data.showResult && props.data.positive && result.value!=null){
            //Class
            showResultClass.value = result.value ? 'border-2 border-success' : 'border-2 border-primary'
            //Sound
            if(!mute){
                if(result.value){
                    new Howl({ src: [sound3], rate: 1, volume: 0.8, autoplay:true })
                } else {
                    new Howl({ src: [sound4], rate: 1, volume: 0.6, autoplay:true })
                }
            }
            //Freeze
            if(result.value){
                ShapesAnimation.playkeep(block.value.targetDomElement, ['positive'])

                freeze.value = true
            }
        }
    
        //## SAVE
        oda.setInput(props.blockindex, result.value, items.value, {attempts: attempts.value})
    }
}

//## INIT
const initload = () => {
    const hasinput = oda.getInput(props.blockindex)
    if(hasinput){
        items.value = hasinput.v || []
        result.value = hasinput.r
        attempts.value = hasinput.data.attempts
        if(items.value.length || result.value){
            evaluate(true)
        }
    } else {
        oda.setInput(props.blockindex, null, null, {attempts:0})
    }
}

onMounted(() => {
   if(props.data.positive){
    initload()
   } else {
    items.value = _.shuffle(items.value)
   }
})



</script>