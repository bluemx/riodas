<template>
<div>
    <template v-if="oda.getEvaluations.auto">
        <div class="text-xl bg-slate-100 py-3 rounded">You answered <strong class="text-success">{{ all.positive }} question correctly</strong> out of a total of <span class="text-neutral/50">{{ oda.getEvaluations.auto }} questions</span>.</div>
    </template>
    <template v-if="oda.getEvaluations.manual>0"> 
        <div class="text-xl bg-white p-1 rounded"><span class="text-neutral/50">{{oda.getEvaluations.manual}} answer(s)</span> require teacher's evaluation.</div>
    </template>

    <!-- ELASH - DYNAMIC RESULTS -->
    <template v-if="oda.getEvaluations.auto === 0 && oda.getEvaluations.manual === 0 && all.total>0">
        
        <div class="text-xl bg-slate-100 py-3 rounded p-5">
            <div class="my-4">
                De un total de <span class="text-neutral/50">{{ all.total }} reactivos</span> tuviste <strong class="text-success">{{ all.positive }} respuestas correctas.</strong>
            </div>
            <div class="bg-slate-200 rounded p-5">
                <div class="text-success font-bold text-2xl">
                    {{ Math.round((all.positive/all.total) * 100) }}%
                </div>
                <progress class="progress progress-success w-full mt-2" :value="all.positive+10" :max="all.total"></progress>
            </div>
        </div>
       
        <template v-if="oda.oda.elashexam">
            <div class="bg-neutral p-5 rounded mt-2 text-white">
                You have completed Recrea ELASH practice test. <br>
                Your raw score is <strong class="text-success">{{ all.positive }}</strong> / <strong>{{ all.total }}</strong>.<br>
                It means you are a <strong class="text-success">{{ elashCefrLevel }}</strong> level according to the CEFR.
            </div>
        </template>

    </template>



    <!--attempts-->
    <template v-if="oda.odaAttemptsLimit<99">
        
        <template v-if="(oda.odaAttempts < oda.odaAttemptsLimit) && !oda.freeze">
            <div class="text-sky-50 mt-5 text-lg p-1">You still have {{ oda.odaAttemptsLimit - oda.odaAttempts }} {{oda.odaAttemptsLimit-oda.odaAttempts>1?'attempts' : 'attempt'  }} to complete this activity.</div>
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

// ELASH VALUES
const elashCefrLevel = ref('')
const elashLevel = ref('')
const elashPracticeTest = ref('')

const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const all = oda.getAllInputs


const elashtable = () => {
    let value = all.positive
    let thevalue = ''
    let elevel = ''
    if(value<=19){                      thevalue = 'A1- (True beginner)'; elevel = 'A1-1'; }
    if(value>=20 &&     value<=49){     thevalue = 'A1';    elevel = 'A1-1';    }
    if(value>=50 &&     value<=69){     thevalue = 'A1+';   elevel = 'A1-2';    }
    if(value>=70 &&     value<=79){     thevalue = 'A2';    elevel = 'A2-1';    }
    if(value>=80 &&     value<=89){     thevalue = 'A2+';   elevel = 'A2-2';    }
    if(value>=90 &&     value<=99){     thevalue = 'B1+';   elevel = 'B1-1';    }
    if(value>=100 &&    value<=109){    thevalue = 'B1+';   elevel = 'B1-2';    }
    if(value>=110 &&    value<=119){    thevalue = 'B2';    elevel = 'B2-1';    }
    if(value>=120){                     thevalue = 'B2+';   elevel = 'B2-2';    }
    elashCefrLevel.value = thevalue;
    elashLevel.value = elevel;
    console.log(elashCefrLevel.value, elashLevel.value)
}

const cleanresponse = () => {
    elashtable()
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

    if(oda.oda.elashexam){
        res.levelCEFR  = elashCefrLevel.value
        res.level = elashLevel.value
        res.practiceTest = oda.oda.title.replace(/\D/g, '');
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