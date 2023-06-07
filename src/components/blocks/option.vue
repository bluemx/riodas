<template>
<div :class="data.class || ''">
    <div class="w-full mt-4 text-center">
        <div ref="block" :class="['relative flex justify-center items-center gap-2 flex-wrap rounded', blocks.resultClass.value]" >
            <template v-for="(item, index) in options" :key="index">
                <button :class="['btn', item.index==input?'btn-accent ':'btn-neutral btn-outline']" @click="onChange(item.index)">
                    <Content :data="item" ></Content>
                </button>
            </template>
        </div>
    </div>
</div>

</template>
<script setup>


import { useOda } from "../../store/oda.js"
import blocks from './blocks.js'
const oda = useOda()
const block = ref()

const initOptions = ref([])
const options = ref([]);

//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})

//OPTIONS sort
if(props.data.options){
    props.data.options.forEach((element, index) => {
        initOptions.value.push({...element, index:index})
    });
    options.value = [...initOptions.value].sort(() => Math.random() - 0.5)
}
//INPUT
const input = ref()
const result = ref()

//ACTION
const onChange = (itemindex) => {
    if(blocks.freeze.value){
        return false
    }
    blocks.attemptsFN()
    evaluate(itemindex)
}


const evaluate = (itemindex) => {
    input.value = itemindex
    blocks.result.value = input.value == 0
    
    blocks.evaluateFN(input.value)
}


onMounted(() => {

    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    if(blockdata && blockdata?.v!=null){
        input.value = blockdata.v
    }
})
// INIT




/*
//AUTORESOLVE
const currentInstance = getCurrentInstance()
currentInstance.appContext.config.globalProperties.emitter.on('autosolve', e => {
    console.log('autosolve')
    //onChange(initOptions.value[0])
} )
*/





</script>