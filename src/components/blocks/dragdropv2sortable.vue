<template>
<div ref="block">
    <template v-for="(element, index) in items" :key="index">
        <div class="btn btn-accent max-w-full text-neutral shadow-md shadow-slate-500/50 cursor-move border-double border-b-4 border-neutral/50 relative flex justify-center items-center">
                <iconify-icon icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
                <Content :data="element" ></Content>
            </div>
    </template>
    <!--
    <draggable
            :list="items"
            :group="ddgroup"
            :sort="true"
            @start="onStart"
            @end="onEnd"
            @change="onChange"
            :disabled="oda.freeze"
            :fallback-override-scale-x="0.5"
            :fallback-override-scale-y="0.5"
            item-key="name"
            ref="block"
            
            :class="[data.class || '', showResultClass, 'draggable relative outline-dashed outline-1 outline-slate-200 bg-slate-100 rounded py-2 px-1 min-w-[60px] min-h-[24px] flex justify-center items-center']"
        >
        <template #header v-if="data.positive">
            <iconify-icon icon="solar:square-double-alt-arrow-down-line-duotone" class="text-neutral absolute opacity-25 pointer-events-none"></iconify-icon>
        </template>
        <template #item="{element}">
            <div @mousedown="mouseDownEvent" class="btn btn-accent max-w-full text-neutral shadow-md shadow-slate-500/50 cursor-move border-double border-b-4 border-neutral/50 relative flex justify-center items-center">
                <iconify-icon icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
                <Content :data="element" ></Content>
                
            </div>
        </template>
    </draggable>

    
    <template v-if="lineattrs" v-for="(item, index) in initialItems" :key="index">
        <Line  :data="{...lineattrs, to:item?.name}" :blockindex="blockindex+'-dragdropline-'+index"></Line>
    </template>
-->
</div>
</template>

<script setup>

import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

import { useOda } from "../../store/oda.js"
import {useBlocks} from './blocks.js'
import draggable from 'vuedraggable'
import sound1 from '../../assets/uisound/navigation_backward-selection-minimal.mp3'
import sound2 from '../../assets/uisound/navigation_unavailable-selection.mp3'
import sound3 from '../../assets/uisound/notification_decorative-01.mp3'
import sound4 from '../../assets/uisound/error_001.mp3'
import ShapesAnimation from "../all/ShapesAnimation";
import deepdash from 'deepdash-es';
import {useScroll} from '../utilities/scrollintoview.js'
deepdash(_)

const scroll = useScroll()
const blocks = useBlocks()
const items = ref()
const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})
const block = ref()
const input = ref("")
const drag = ref()
const showResultClass = ref()


const lineattrs = ref(false)
const initialItems = ref()
const ddgroup = ref()

const mouseDownEvent = () => {
    console.log('movingo')
}


const lineFN = () => {
    // #### LINE
    const hasline = items.value.findIndex(i=>i.block=='line')
    if(hasline>-1) {
        lineattrs.value = {...items.value[hasline]}
        lineattrs.value.from = props.data.name
        items.value.splice(hasline, 1)
    }
    
    // #### GROUP
    const ddgroupname = props.data.group || 'basegroup'
    ddgroup.value = {
        name: ddgroupname,
        pull: [ddgroupname],
        put: [ddgroupname]
    }

}


const onStart = ($ev) => {
    if(props.data?.line){
        leavesLine.value = true
    }
    drag.value = true
    scroll.start($ev.clone)
    new Howl({ src: [sound2], rate: 1, volume: 1, autoplay:true })
}



const onChange = (e) => {
    if(blocks.freeze.value){
        return false
    }

    if(!props.data.evaluation){
        return false
    }

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

const sortable = ref()

const init = () => {

    sortable.value = Sortable.create(block.value, {
        autoScroll: true,
        scrollFn: () => {
            console.log('scrolling!')
        }
    })


    items.value = JSON.parse(JSON.stringify(props.data.content))
    //Desorder
    if(props.data.shuffle){
        items.value = _.shuffle(items.value)
    }
    initialItems.value = JSON.parse(JSON.stringify(items.value))
    lineFN()
    onChange()
}

onMounted(() => {
    if(props.data.evaluation){
        const blockdata =  blocks.initFN(oda, props.data, props.blockindex, items.value)
        if(blockdata?.v){
            items.value = blockdata.v
        }
    }
    init()
})

setTimeout(()=>{
    watch(()=>props.data, ()=>{ init() }, {deep: true})
}, 1000)
</script>