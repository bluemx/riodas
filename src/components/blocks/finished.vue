<template>
   <div class="text-xl">You answered <strong class="text-success">{{ all.positive }} question correctly</strong> out of a total of <span class="text-neutral/50">{{ all.total }} questions</span>.</div>
</template>
<script setup>
import { useOda } from "../../store/oda.js"

const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const all = oda.getAllInputs


const cleanresponse = () => {
    const res = {
        total: oda.getAllInputs.total,
        responded: oda.getAllInputs.responded,
        positive: oda.getAllInputs.positive,
        inputs: oda.getAllInputs.inputs
    }
    return res
}


const pMessage = () => {
    const message = JSON.stringify(cleanresponse())
    window.parent.postMessage(message, "*");
}
pMessage()

</script>