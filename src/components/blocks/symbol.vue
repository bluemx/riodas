<template>

<Content :data="item" :blockindex="blockindex"></Content>

</template>
<script setup>
import { useOda } from "../../store/oda.js"
import deepdash from 'deepdash-es';

const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})
deepdash(_)

const item = {...oda.oda.symbols[props.data.symbol]}


const replaceitemkeys = (itemtoreplace, fromObj, key) => {
    
    if(
        key!='symbol' &&
        key!='byname' &&
        key!='name'
    ){
        //console.log(itemtoreplace[key], key)
        if(itemtoreplace[key]){
            itemtoreplace[key] = fromObj[key]
        }
    }
}


Object.keys(props.data).forEach(key => {
    // Keys on root
    replaceitemkeys(item, props.data, key)
    // Search and replace deep
    if(key=='byname'){
        Object.keys(props.data[key]).forEach(keybyname => {
            _.eachDeep(item, (valueD, keyD, parentD, ctxD) => {
                if(keyD=='name' && valueD==keybyname){
                    
                    Object.keys(props.data[key][keybyname]).forEach(deepkeys => {
                        console.log(keyD, valueD, parentD, deepkeys)
                        //console.log(parent)
                        replaceitemkeys(parentD, props.data[key][keybyname], deepkeys)
                    })
                }
            })

        })
    }

})







</script>