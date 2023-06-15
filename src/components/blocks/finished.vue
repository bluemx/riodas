<template>
<div>
    <template v-if="oda.getEvaluations.auto">
        <div class="text-xl">You answered <strong class="text-success">{{ all.positive }} question correctly</strong> out of a total of <span class="text-neutral/50 dark:text-white/50">{{ oda.getEvaluations.auto }} questions</span>.</div>
    </template>
    <template v-if="oda.getEvaluations.manual>0"> 
        <div class="text-xl"><span class="text-neutral/50">{{oda.getEvaluations.manual}} answer(s)</span> require teacher's evaluation.</div>
    </template>
    
</div>
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

    const buildInputs = JSON.parse(JSON.stringify(oda.user))

    const res = {
        total: oda.getEvaluations.auto + oda.getEvaluations.manual,
        evaluations: oda.getEvaluations,
        responded: oda.getAllInputs.responded,
        positive: oda.getAllInputs.positive,
        seconds: oda.user.totaltime,
        //inputs: CryptoJS.AES.encrypt(JSON.stringify(oda.getAllInputs.inputs),'blue').toString(),
        //inputs: window.btoa(JSON.stringify(oda.user))
        inputs: window.btoa(JSON.stringify(buildInputs))
    }

    if(res.total === 0){
        res.total = 1;
        res.positive = 1;
        //res.responded = 1;
        //res.evaluations.auto = 1;
    }
    //console.log(res)
    return res
}


const pMessage = () => {
    const message = JSON.stringify(cleanresponse())
    if(oda.freeze){
        return false
    }
        window.parent.postMessage(message, "*");
}
pMessage()

</script>