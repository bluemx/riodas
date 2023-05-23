<template>
    <span :class="data.class || ''">
        {{ level() }}
    </span>
<!--
    <div class="text-xs overflow-scroll h-96">
    <hr>
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
        level: level(),
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