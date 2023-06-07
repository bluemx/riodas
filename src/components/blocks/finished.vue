<template>
   <div class="text-xl">You answered <strong class="text-success">{{ all.positive }} question correctly</strong> out of a total of <span class="text-neutral/50">{{ all.total }} questions</span>.</div>
</template>
<script setup>
import { useOda } from "../../store/oda.js"
import CryptoJS from 'crypto-js';
const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const all = oda.getAllInputs


const cleanresponse = () => {
    const res = {
        total: oda.getEvaluations.auto + oda.getEvaluations.manual,
        evaluations: oda.getEvaluations,
        responded: oda.getAllInputs.responded,
        positive: oda.getAllInputs.positive,
        seconds: oda.user.totaltime,
        inputs: CryptoJS.AES.encrypt(JSON.stringify(oda.getAllInputs.inputs),'blue').toString(),
    }
    return res
}


const pMessage = () => {
    const message = JSON.stringify(cleanresponse())
    window.parent.postMessage(message, "*");
}
pMessage()

</script>