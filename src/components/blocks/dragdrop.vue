<template>

<draggable
        :list="items"
        :group="ddgroup"
        :sort="true"
        @start="onStart"
        @end="onEnd"
        @change="onChange"
        :disabled="oda.freeze"
        :scroll="true"
        :bubbleScroll="true"
        item-key="name"
        ref="block"
        :class="[data.class || '', showResultClass, 'draggable relative outline-dashed outline-1 outline-slate-200 bg-slate-100 rounded py-2 px-1 min-w-[60px] min-h-[24px] flex justify-center items-center']"
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
import {useBlocks} from './blocks.js'
import draggable from 'vuedraggable'
import sound1 from '../../assets/uisound/navigation_backward-selection-minimal.mp3'
import sound2 from '../../assets/uisound/navigation_unavailable-selection.mp3'
import sound3 from '../../assets/uisound/notification_decorative-01.mp3'
import sound4 from '../../assets/uisound/error_001.mp3'
import ShapesAnimation from "../all/ShapesAnimation";
import deepdash from 'deepdash-es';
deepdash(_)

const blocks = useBlocks()
const items = ref(JSON.parse(JSON.stringify(props.data.content)))
const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})
const block = ref()
const input = ref("")
const drag = ref()
const showResultClass = ref()


const ddgroupname = props.data.group || 'basegroup'
const ddgroup = {
    name: ddgroupname,
    pull: [ddgroupname],
    put: [ddgroupname]
}
const onStart = () => {
    drag.value = true
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
    const positive = props.data.positive.split(',')
    const itemsorder = items.value.map(itm => itm.name)

    if(props.data?.order){
        blocks.result.value = positive.toString() == itemsorder.toString()
    } else {
        blocks.result.value = positive.sort().toString() == itemsorder.sort().toString()
    }

    blocks.evaluateFN(items.value)


}
const onEnd = (e) => {

    drag.value = false
    new Howl({ src: [sound1], rate: 1, volume: 1, autoplay:true })
}


onMounted(() => {
    if(props.data.evaluation){
        const blockdata =  blocks.initFN(oda, props.data, props.blockindex, items.value)
        if(blockdata?.v){
            items.value = blockdata.v
        }
    }
    
    onChange()
})
</script>