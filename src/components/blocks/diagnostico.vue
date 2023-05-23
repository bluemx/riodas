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
        total: oda.getAllInputs.total,
        responded: oda.getAllInputs.responded,
        positive: oda.getAllInputs.positive,
        level: level(),
        inputs: {}
    }
    Object.keys(oda.getAllInputs.inputs).forEach((key)=>{
        const id = oda.getAllInputs.inputs[key].data.id
        const result = oda.getAllInputs.inputs[key].r
        const value = oda.getAllInputs.inputs[key].v
        res.inputs[id] = {
            r:result,
            v:value
        }

    })
    return res
}

</script>