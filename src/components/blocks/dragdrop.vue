<template>

<div data="dragdrop" v-if="ready">
    <div ref="block" :class="[blocks.freeze.value ? 'pointer-events-none':' ', 'relative']">
    <Container
        :orientation="data.class.includes('flex-col')?'vertical':'horizontal'"
        :group-name="data.group || 'basegroup'"
        @drop="onDrop"
        :getChildPayload="index => items[index]"
        tag="div"
        :drop-placeholder="{ className: 
            `bg-bg-slate-400 bg-opacity-20  border-dotted border-2 border-text-slate-600 rounded-lg mx-4`, 
          animationDuration: '200'}"
          drag-class="
            transition duration-100 ease-in z-50
            transform rotate-6 scale-75"
          drop-class="transition duration-100 
            ease-in z-50 transform -rotate-2 scale-90 "
        :class="[
            data.class || '', showResultClass, 
            'relative outline-dashed outline-1 outline-slate-200 bg-slate-100 rounded py-2 px-1 !min-w-[80px] min-h-full !min-h-[24px] !flex justify-center items-center flex-wrap gap-1',
            
            ]"
    >

    
      <Draggable v-for="(element, i) in items" :key="element.id" class="!overflow-visible">
        <div class="relative">
            <template v-if="data.positive">
            </template>
            <div class="scale- btn btn-accent max-w-full text-neutral shadow-md shadow-slate-500/50 cursor-move border-double border-b-4 border-neutral/50 relative flex justify-center items-center">
                <iconify-icon icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
                <Content :data="element" ></Content>
                
            </div>

        </div>
      </Draggable>
    </Container>
    </div>

    <template v-if="lineattrs" v-for="(item, index) in initialItems" :key="index">
        <Line  :data="{...lineattrs, to:item?.name}" :blockindex="blockindex+'-dragdropline-'+index"></Line>
    </template>
</div>
</template>

<script setup>

import { useOda } from "../../store/oda.js"
import {useBlocks} from './blocks.js'

import { Container, Draggable } from "vue3-smooth-dnd";

import sound1 from '../../assets/uisound/navigation_backward-selection-minimal.mp3'
import sound2 from '../../assets/uisound/navigation_unavailable-selection.mp3'
import sound3 from '../../assets/uisound/notification_decorative-01.mp3'
import sound4 from '../../assets/uisound/error_001.mp3'
import ShapesAnimation from "../all/ShapesAnimation";
import deepdash from 'deepdash-es';


deepdash(_)
const blocks = useBlocks()
const items = ref(null)
const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})
const block = ref(null)
const input = ref("")
const showResultClass = ref()
const ready = ref(false)

const lineattrs = ref(false)
const initialItems = ref()

const ddgroup = ref()


const onDragStart = (data) => {
    //console.log('start', data)
}
const onDrop = (dropResult) => {
    if(blocks.freeze.value){ return false }
    
    const { removedIndex, addedIndex, payload } = dropResult;
    if (removedIndex !== null) {
        items.value.splice(removedIndex, 1);
    }
    if (addedIndex !== null) {
        items.value.splice(addedIndex, 0, payload);
    }
    new Howl({ src: [sound2], rate: 1, volume: 1, autoplay:true })

    onChange()
}




const lineFN = () => {
    // #### LINE
    const hasline = items.value.findIndex(i=>i.block=='line')
    if(hasline>-1) {
        lineattrs.value = {...items.value[hasline]}
        lineattrs.value.from = props.data.name
        items.value.splice(hasline, 1)
    }
}




const onChange = (e) => {
    if(!props.data.evaluation){ return false }
    //Unique values
    items.value = [...new Map(items.value.map((m) => [m.name, m])).values()]
    // RESULT : COMPARE
    const positiveAND = props.data.positive.split(',')
    const positiveOR = props.data.positive.split('-')
    const positiveORclass = props.data.positive.replace('.','')
    const itemsorder = items.value.map(itm => itm.name)


    //POSITIVE  OR

    if(props.data.positive.includes('-')){
        if(itemsorder.length==1){
            blocks.result.value = positiveOR.includes(itemsorder[0])
        } else {
            blocks.result.value = false
        }
    } else if(props.data.positive.includes('.')){
        const itemsorderclass = items.value.map(itm => itm.class).toString().split(' ')

        if(itemsorder.length==1){
            blocks.result.value = itemsorderclass.includes(positiveORclass)
        } else {
            blocks.result.value = false
        }
    } else {
        //POSITIVE AND
        if(props.data?.order){
            blocks.result.value = positiveAND.toString() == itemsorder.toString()
        } else {
            blocks.result.value = positiveAND.sort().toString() == itemsorder.sort().toString()
        }
    }
    //console.log(positive.toString(), itemsorder.toString())
    blocks.evaluateFN(items.value)

}
const onEnd = (e) => {
    scroll.stop()
    drag.value = false
    new Howl({ src: [sound1], rate: 1, volume: 1, autoplay:true })
}



const init = () => {
    
    ready.value = false
    if(items.value===null){
        items.value = []
        items.value = JSON.parse(JSON.stringify(props.data.content))
    }
    //Desorder
    if(props.data.shuffle){
        items.value = _.shuffle(items.value)
        onChange()
    }
    lineFN()
    initialItems.value = JSON.parse(JSON.stringify(items.value))
    onChange()
    setTimeout(()=>{
        ready.value = true
    }, 100)
}



onMounted(() => {
    init()
    setTimeout(()=>{

        if(props.data.evaluation){
            const blockdata =  blocks.initFN(oda, props.data, props.blockindex, block.value)
            if(blockdata?.v){
                items.value = []
                items.value = blockdata.v
            }
        }
        
        watch(()=>props.data, ()=>{ init() }, {deep: true})
        onChange()
    }, 1000)
})


</script>