<template>

<div :class="data.class || ''">
    <div class="text-lg">
        <div v-if="data.id" class="inline-block">
            <div class="bg-white mr-2 aspect-square h-8 rounded flex justify-center items-center text-neutral/50">
                {{ data.id }}
            </div>
        </div>
        {{ data.content }}
    </div>
    <div class="w-full mt-4 text-center">
        <div class="flex justify-center items-center gap-2 flex-wrap">
            <template v-for="(item, index) in options" :key="index">
                <button :class="['btn', item==input?'btn-success':'']" @click="choose(item)">{{ item }}</button>                    
            </template>
        </div>
    </div>
</div>

</template>
<script setup>


import { useOda } from "../../store/oda.js"
const oda = useOda()
//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})
//OPTIONS sort
const options = [...props.data.options].sort(() => Math.random() - 0.5);
//INPUT
const input = ref()
const result = ref()
//ACTION
const choose = (item) => {
    input.value = item
    result.value = input.value == props.data.options[0]
    oda.setInput(props.blockindex, result.value, input.value, props.data)
}
//INIT
const hasinput = oda.getInput(props.blockindex)
if(hasinput){
    input.value = hasinput.v
    result.value = hasinput.r
} else {
    oda.setInput(props.blockindex, null, null)
}
//AUTORESOLVE

const currentInstance = getCurrentInstance()
currentInstance.appContext.config.globalProperties.emitter.on('autosolve', e => {
    console.log('autosolve')
    choose(props.data.options[0])
} )






</script>