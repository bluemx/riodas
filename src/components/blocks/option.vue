<template>
<div :class="data.class || ''">
    <div class="w-full mt-4 text-center">
        <div :class="['flex justify-center items-center gap-2 flex-wrap', ]" >
            <template v-for="(item, index) in options" :key="index">
                <button :class="['btn', item.index==input?'btn-accent '+blocks.showResultClass:'btn-neutral btn-outline']" @click="onChange(item.index)">
                    <Content :data="item" ></Content>
                </button>
            </template>
        </div>
    </div>
    <div>Attempts: {{ blocks.attempts }}</div>
    <div>Freeze: {{ blocks.freeze }}</div>
    <div>ResultClass: {{ blocks.resultClass }}</div>
</div>

</template>
<script setup>


import { useOda } from "../../store/oda.js"
import blocks from './blocks.js'
const oda = useOda()
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
    blocks.attemptsFN(props.data)
    evaluate()
    //blocks.evaluateFN(props.data, result.value, 0)
    
}


const evaluate = () => {
    input.value = itemindex
    result.value = input.value == 0
    blocks.evaluateFN(oda,props.data, props.blockindex, input.value, result.value, false)
}


/*
// EVALUATE
const evaluate = (mute) => {
    // Freeze block if attempts limit
    if(props.data.attempts>0 && (attempts.value >= props.data.attempts)){
        freeze.value = true
    }
    if(props.data.showResult && result.value!=null){
        showResultClass.value = result.value ? 'border-2 border-success' : 'border-2 border-primary',
        
    }

    //Sound
    if(!mute){
        if(result.value){
            new Howl({ src: [sound3], rate: 1, volume: 0.8, autoplay:true })
        } else {
            new Howl({ src: [sound4], rate: 1, volume: 0.6, autoplay:true })
        }
    }
//#SAVE
oda.setInput(props.blockindex, result.value, input.value, props.data)
}
*/


//INIT
const hasinput = oda.getInput(props.blockindex)
if(hasinput){
    input.value = hasinput.v
    result.value = hasinput.r
    //onChange(input.value)
} else {
    oda.setInput(props.blockindex, null, null, props.data)
}

//AUTORESOLVE
const currentInstance = getCurrentInstance()
currentInstance.appContext.config.globalProperties.emitter.on('autosolve', e => {
    console.log('autosolve')
    //onChange(initOptions.value[0])
} )






</script>