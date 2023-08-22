<template>
<div :class="[ data.class || 'flex gap-1 flex-wrap']">
    <template v-for="(item, index) in data.content" :key="index" >
        <div :class="['cursor-pointer', input[index]?data.classitem2:data.classitem1]"  @click="onChange(index)">
            <Content :data="item" ></Content>
        </div>
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

const input = ref([])

watch(()=>props.data, ()=>{
    init()
})

const init = () => {
    if(input.value.length==0){
        props.data.content.forEach((i)=>{
            input.value.push(false)
        })
    }
}


const onChange = (index) => {
    if(blocks.freeze.value){
        return false
    }
    //Increase
    new Howl({ src: [soundClick], rate: 2, volume: 2, autoplay:true })
    
    input.value[index] = !input.value[index]

    blocks.result.value = evaluator()

    blocks.evaluateFN(input.value)
}

const evaluator = () => {

    //Convert positive to array
    let positiveItems = props.data.positive.split(',')
    let positiveArray = []
    props.data.content.forEach((i)=>{
        positiveArray.push(false)
    })
    positiveItems.forEach((i)=>{
        positiveArray[parseInt(i)] = true
    })
    const res = _.isEqual(input.value, positiveArray)
    console.log(res)
    return res
}


onMounted(() => {
    
    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    if(blockdata && blockdata?.v!=null){
        input.value = blockdata.v
    } else {
        init()
        blocks.evaluateFN(input.value)
    }
})

</script>