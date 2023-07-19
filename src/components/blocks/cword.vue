<template>
    <div class="aspect-square w-full  relative bg-slate-100/60">
        <div v-if="word" class="w-full aspect-square bg-white  flex justify-center items-center text-neutral ring-1 ring-slate-200 shadow-inner">
            <input :placeholder="word[0]" v-model="input" @input="onChange" class="w-full h-full aspect-square text-center uppercase border-0 ring-0 outline-0" maxlength="1" minlength="1">
            <div class="absolute animate-pulse  w-10/12 aspect-square text-center flex justify-center items-center text-white text-xs" :class="theid[1]=='h'?'right-full rounded-l bg-secondary':'bottom-full rounded-t bg-primary'" v-if="theid">{{ theid[0] }}</div>
        </div>
        <div v-else  class="w-full aspect-square ring-1 ring-slate-200 opacity-20"></div>
    </div>
    </template>
<script setup>

const props = defineProps({
    word: Array,
    theid: [Array, Boolean],
    blockindex: String,
    loadvalue: String
})
const emit = defineEmits(['result'])

const input = ref("")

const onChange = () => {
    if(!props.word){
        emit('result', null)
        return false
    }
    input.value = input.value.toUpperCase()
    emit('result', {letter: props.word[0], pos: {x:props.word[1][0], y:props.word[1][1]}, answer:input.value, result: input.value==props.word[0]})
}
onMounted(() => {
    onChange()
})

watch(()=>props.word, ()=>{
    if(props?.word){
        if(props?.word[2]){
            input.value = props?.word[2]
            onChange()
        }
    }

}, {deep:true})

</script>