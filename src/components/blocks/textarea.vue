<template>
 <div :class="['w-full p-1  relativerounded flex flex-col justify-center items-center !h-auto relative border-solid', blocks.resultClass.value ]"  ref="block">
    <textarea :maxlength="data.maxlength>0? data.maxlength : false" ref="blockarea" :readonly="blocks.freeze.value" v-if="data.multiline" v-model="input" :class="['block border-2 border-secondary rounded w-full min-h-[32px] resize-none  max-h-40', data.class || '']" @input="onChange"  :placeholder="data?.placeholder || 'Write here...'">
    </textarea>
    <input :maxlength="data.maxlength>0? data.maxlength : false" :readonly="blocks.freeze.value" v-else v-model="input" :class="['block border-2 border-secondary rounded w-full min-h-[32px] resize-none  max-h-40 bg-white', data.class || '']" @input="onChange"  :placeholder="data?.placeholder || 'Write here...'">
    <div class="text-xs ml-auto w-full text-right text-neutral/30 absolute -bottom-3 right-2">
        {{ input?input.length:0 }}
        <template v-if="data.maxlength>0">/{{ data.maxlength }}</template>
    </div>
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



function evaluatePositiveAndInput(caseSensitive, rightAnswer, userInput) {
  const possibleAnswers = rightAnswer.split("|");
  if (caseSensitive) {
    return possibleAnswers.some(answer => answer.trim() === userInput);
  } else {
    return possibleAnswers.some(answer => answer.trim().toLowerCase() === userInput.toLowerCase());
  }
}


const onChange = (itemindex) => {
    if(blocks.freeze.value){
        return false
    }
    resize()

    if(props.data.positive){

        const caseSensitive = props.data.case
        const rightAnswer = props.data.positive
        const userInput = input.value
        blocks.result.value = evaluatePositiveAndInput(caseSensitive, rightAnswer, userInput);
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
