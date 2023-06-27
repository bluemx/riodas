<template>
    <Content :data="item" :blockindex="blockindex" :key="Math.random()"></Content>
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

const item = ref()



const replaceitemkeys = (itemtoreplace, fromObj, key) => {
    if(
        key!='symbol' &&
        key!='byname' &&
        key!='name' &&
        !key.includes(".")
    ){

        if(itemtoreplace[key]){
            itemtoreplace[key] = fromObj[key]
        }
    }
}

const init = () => {
    item.value = JSON.parse(JSON.stringify(oda.oda.symbols[props.data.symbol]))
    Object.keys(props.data).forEach(key => {
        
        // Keys on root
        replaceitemkeys(item.value, props.data, key)
        // Search and replace deep
        if(key=='byname'){
            Object.keys(props.data[key]).forEach(keybyname => {
                _.eachDeep(item.value, (valueD, keyD, parentD, ctxD) => {
                    if(keyD=='name' && valueD==keybyname){
                        //console.log(props.data[key][keybyname])
                        Object.keys(props.data[key][keybyname]).forEach(deepkeys => {
                            //Replacing $1 by $2
                            //console.log('%c'+keybyname +' - '+  props.data[key][keybyname][deepkeys],  'background:#ffdd00;')

                            replaceitemkeys(parentD, props.data[key][keybyname], deepkeys)

                        })
                    }
                })
            })
        }
        if( key.includes(".") ){
            const keysplit = key.split('.')
            const thename = keysplit[0]
            const thekey = keysplit[1]
            _.eachDeep(item.value, (valueD, keyD, parentD, ctxD) => {
                if(valueD==thename){
                    parentD[thekey] = props.data[key]
                }
            })
        
        }

    })
}
init()

watch(()=>props, (nv)=>{
    item.value = {}
    setTimeout(()=>{
        init()
    }, 100)
}, {deep:true})










</script>