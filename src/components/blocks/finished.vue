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
                    {{ (all.positive/all.total) * 100 }}%
                </div>
                <progress class="progress progress-success w-full mt-2" :value="all.positive+10" :max="all.total"></progress>
            </div>
        </div>
       
        <template v-if="oda.oda.elashexam">
            <div class="bg-neutral p-5 rounded mt-2 text-white">
                You have completed Recrea ELASH practice test. <br>
                Your raw score is <strong class="text-success">{{ all.positive }}</strong> / <strong>{{ all.total }}</strong>.<br>
                It means you are a <strong class="text-success">{{ elashtable(all.positive) }}</strong> level according to the CEFR.
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


const elashtable = (value) => {
    let thevalue = ''
    if(value<=19){                      thevalue = 'A1- (True beginner)'}
    if(value>=20 &&     value<=49){     thevalue = 'A1'     }
    if(value>=50 &&     value<=69){     thevalue = 'A1+'    }
    if(value>=70 &&     value<=79){     thevalue = 'A2'     }
    if(value>=80 &&     value<=89){     thevalue = 'A2+'    }
    if(value>=90 &&     value<=99){     thevalue = 'B1+'    }
    if(value>=100 &&    value<=109){    thevalue = 'B1+'     }
    if(value>=110 &&    value<=119){    thevalue = 'B2'      }
    if(value>=120){                     thevalue = 'B2+'     }
    
    return thevalue
    
}

</script>