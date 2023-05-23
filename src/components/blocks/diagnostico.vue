<template>
    <span :class="data.class || ''">
        {{ level() }}
    </span>

    {{ oda.getAllInputs }}

</template>
<script setup>
import { useOda } from "../../store/oda.js"
const oda = useOda()
const props = defineProps({
    data: Object
})

const pos = oda.getAllInputs.positive
console.log(pos)
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
</script>