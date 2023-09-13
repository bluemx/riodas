<template>
<div>
    <template v-if="oda.getEvaluations.auto">
        <div class="text-xl ">You answered <strong class="text-success">{{ all.positive }} question correctly</strong> out of a total of <span class="text-neutral/50">{{ oda.getEvaluations.auto }} questions</span>.</div>
    </template>
    <template v-if="oda.getEvaluations.manual>0"> 
        <div class="text-xl"><span class="text-neutral/50">{{oda.getEvaluations.manual}} answer(s)</span> require teacher's evaluation.</div>
    </template>


    <!--attempts-->
    <template v-if="oda.odaAttemptsLimit<99">
        
        <template v-if="(oda.odaAttempts < oda.odaAttemptsLimit) && !oda.freeze">
            <div class="text-sm mt-5 text-slate-500  bg-slate-100 rounded p-1">You still have {{ oda.odaAttemptsLimit - oda.odaAttempts }} {{oda.odaAttemptsLimit-oda.odaAttempts>1?'attempts' : 'attempt'  }} to complete this activity.</div>
            <RestartButton :data="'Try again'" class="mt-4"></RestartButton>
        </template>

    </template>
    <template v-else>
        <RestartButton :data="'Try again'" class="mt-4"></RestartButton>
    </template>


    
</div>
</template>
<script setup>
import { useOda } from "../../store/oda.js"
import CryptoJS from 'crypto-js';
import { useEventBus } from '@vueuse/core'

const bus = useEventBus()



const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const all = oda.getAllInputs


const cleanresponse = () => {

    const buildInputs = JSON.parse(JSON.stringify(oda.user))

    const res = {
        datatype: 'student',
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

    if(oda.freeze){
        return false
    }
    
    const message = JSON.stringify(cleanresponse())
    window.parent.postMessage(message, "*");
    oda.odaAttempts++
}
pMessage()

</script>