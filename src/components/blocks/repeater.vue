<template>
<div>
    <Content v-for="(item, index) in newData" v-if="dataloaded" :data="item"  :key="index" :blockindex="blockindex+'-'+index"></Content>
</div>
</template>
<script setup>
import { useOda } from "../../store/oda.js"

const oda = useOda()
const dataloaded = ref(false)
//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})


const content = ref([...props.data.content])

const newData = []

// READ PROPERTIES
const newDataProperties = {}
Object.keys(props.data).forEach(key => {
   if(
        key!='block' &&
        key!='repeat' && 
        key!='content' &&
        key!='indexstart'
    ){
        newDataProperties[key] = props.data[key]
    }
    newDataProperties['block'] = props.data['repeat']
});


// BUILD
const buildData = () => {
    let dataindex = 0
    if(props.data.indexstart){
        dataindex+=props.data.indexstart
    }
    content.value.forEach(key => {
        newData.push(
            {...key, ...newDataProperties, id:dataindex}
        )
        dataindex++
    });
    dataloaded.value = true
}

// EXTERNAL FILE
const loadFile = async () => {
    const response = await fetch(oda.baseurl+'/ODAS/'+oda.odaID+'/'+props.data.file)
    const file = await response.json()
    content.value = file
    buildData()
}
if(props.data.file){
    loadFile()
} else {
    buildData()
}






</script>