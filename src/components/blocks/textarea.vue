<template>
 <div :class="['w-full p-1 rounded flex justify-center items-center !h-auto relative border-solid', blocks.resultClass.value ]"  ref="block">
    <textarea ref="blockarea" :readonly="blocks.freeze.value" v-if="data.multiline" v-model="input" :class="['block border-2 border-secondary rounded w-full min-h-[32px] resize-none  max-h-40', data.class || '']" @input="onChange"  :placeholder="placeholder">
    </textarea>
    <input :readonly="blocks.freeze.value" v-else v-model="input" :class="['block border-2 border-secondary rounded w-full min-h-[32px] resize-none  max-h-40', data.class || '']" @input="onChange"  :placeholder="placeholder">
</div>

</template>
<script setup>
import { useOda } from "../../store/oda.js"
import {useBlocks} from './blocks.js'
const blocks = useBlocks()
const oda = useOda()
const block = ref()
const blockarea = ref()

const props = defineProps({
    data: Object,
    blockindex: String
})

const placeholder = props.data?.placeholder || 'Write here...'

const input = ref("")
const resize = () => {
    if(!props.data?.multiline){
        return false
    }
    let element = blockarea.value
    element.style.height = "16px";
    element.style.height = element.scrollHeight + "px";
}


const onChange = (itemindex) => {
    if(blocks.freeze.value){
        return false
    }
    resize()
    if(props.data.positive){
        if(props.data.case){
            blocks.result.value = input.value == props.data.positive
        } else {
            blocks.result.value = input.value.toLowerCase() == props.data.positive.toLowerCase()
        }
    }

    blocks.evaluateFN(input.value)
}

onMounted(() => {
    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    if(blockdata && blockdata?.v!=null){
        input.value = blockdata.v
        setTimeout(()=>{
            resize()

        }, 500)
    } else {
        blocks.evaluateFN(input.value)
    }
    resize()
})
</script>
