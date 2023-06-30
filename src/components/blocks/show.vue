<template>
    <Content v-if="thecondition" v-for="(item, index) in data.content" :key="index" :data="item" :blockindex="blockindex"></Content>
</template>
<script setup>


import { useRoute } from 'vue-router';
import { useOda } from '../../store/oda';
const oda = useOda()
const route = useRoute()
const props = defineProps({
    data: Object,
    blockindex: String
})
const scenenum = route.params.scene || 0

const thecondition = computed(()=>{
    const positives = oda.getSceneInputs(scenenum).positive
    console.log()
    let positivesEq = false
    if(positives == props.data.positives){
        positivesEq = true
    } else {
        positivesEq = false
    }


    if(props.data.istrue){
        return positivesEq
    }
    else if(!props.data.istrue){
        return !positivesEq
    }
})

</script>