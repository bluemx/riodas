<template>

<Content v-if="dataloaded" :data="item" v-for="(item, index) in newData" :key="index" :blockindex="blockindex+'-'+index"></Content>

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
   if(key!='block' && key!='repeat' && key!='content'){
        newDataProperties[key] = props.data[key]
    }
    newDataProperties['block'] = props.data['repeat']
});


// BUILD
const buildData = () => {
    content.value.forEach(key => {
        newData.push(
            {...key, ...newDataProperties}
        )
    });
    dataloaded.value = true
}

// EXTERNAL FILE
const loadFile = async () => {

    const response = await fetch('/ODAS/'+oda.odaID+'/'+props.data.file)
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