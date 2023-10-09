<template>
<div :class="[data.class || '']">
    <div class="text-3xl mt-2 mb-5 font-bold">
        <span class="bg-primary text-white py-1 px-2 rounded">{{ oda.leveltemp }} level</span> !
    </div>
    <div class="text-xl text-zinc-400">You answered <strong class="text-success">{{ cleanresponse().positive }} question correctly</strong> out of a total of <span class="text-primary/50">{{ cleanresponse().responded }} questions</span>.</div>
</div>
   
<!--
    <div class="text-xs overflow-scroll h-96">
    {{ cleanresponse() }}
    </div>
-->

</template>
<script setup>
import { useOda } from "../../store/oda.js"

const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

console.log('::LEVEL', oda.leveltemp)

const pos = oda.getAllInputs.positive

const level = () => {
    let lev = "A1"
    if(pos<=20){
        lev = "A1"
    }
    if(pos>20 && pos<=45){
        lev = "A2"
    }
    if(pos>45 && pos<=70){
        lev = "B1"
    }
    if(pos>70){
        lev = "B2"
    }
    return lev
}

const cleanresponse = () => {
    const res = {
        total: 100,
        totalLevel: oda.getAllInputs.total,
        responded: oda.getAllInputs.responded,
        positive: oda.getAllInputs.positive,
        level: oda.leveltemp,
        inputs: []
    }
    Object.keys(oda.getAllInputs.inputs).forEach((key)=>{
        const theitem = oda.getAllInputs.inputs[key]

        res.inputs.push({
            id: theitem.data.id,
            r: theitem.r,
            v: theitem.v,
            questiontext: theitem.data.content,
            lvl: theitem.data.level
        })

    })
    return res
}


const pMessage = () => {
    const message = JSON.stringify(cleanresponse())
    window.parent.postMessage(message, "*");
}
pMessage()

</script>