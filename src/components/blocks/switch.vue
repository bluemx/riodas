<template>
<div :class="['cursor-pointer', data.class || '']" @click="onChange">
    <template v-for="(item, index) in data.content" :key="index" >
        <Content :data="item" v-if="input==index"></Content>
    </template>
</div>
</template>
<script setup>
import soundClick from '../../assets/uisound/navigation_backward-selection-minimal.mp3'

import { useOda } from "../../store/oda.js"
import {useBlocks} from './blocks.js'
const blocks = useBlocks()



const oda = useOda()
const block = ref()

const props = defineProps({
    data: Object,
    blockindex: String
})

const input = ref(0)

const onChange = () => {
    if(blocks.freeze.value){
        return false
    }
    //Increase
    new Howl({ src: [soundClick], rate: 2, volume: 2, autoplay:true })
    input.value = (input.value<props.data.content.length-1) ? input.value+1 : 0

    blocks.result.value = input.value == props.data.positive

    blocks.evaluateFN(input.value)
}

onMounted(() => {
    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    if(blockdata && blockdata?.v!=null){
        input.value = blockdata.v
    } else {
        blocks.result.value = input.value == props.data.positive
        blocks.evaluateFN(input.value)
    }
})

</script>