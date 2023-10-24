<template>

<div ref="block" :blockindex="blockindex" :class="[' bg-slate-50 p-0.5 rounded relative  text-center min-w-[280px]']">
    <AudiorecordRecBtn :key="blockindex+'-audiorecordbtn'" v-if="verifyTimes>0" class="mx-auto" :isrecording="FNS.isrecording.value" @start="startRecord" @stop="stopRecord"></AudiorecordRecBtn>

    

    <div class="flex flex-wrap gap-0.5 items-center justify-center" ref="blockAnimationContainer">
        

        <progress v-if="FNS.isrecording.value" class="progress progress-primary w-full" :value="recordingProgress" :max="recordingTimelimit"></progress>
        
        <div v-show="audiorecordedB64" class="flex-grow flex gap-0.5 items-center bg-slate-50 p-0.5 rounded">
            <button :class="['btn relative aspect-square text-3xl p-0.5 flex-grow-0 m-2', (playing?'btn-primary':'btn-secondary'), data.class || '']" @click="clicked"  >
                <iconify-icon icon="solar:play-stream-bold-duotone" :class="['absolute text-4xl', !playing?'animate-in zoom-in':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
                <iconify-icon icon="solar:stop-circle-line-duotone" :class="['absolute text-4xl', playing?'repeat-infinite animate-pulse duration-500 ease-in-out':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
            </button>
            <div ref="blockwave" class=" bg-white rounded p-2 flex-grow ml-2"></div>
        </div>
    </div>
    <template v-if="audiorecordedB64 && data.evaluation!=='manual'">
        <div class="flex justify-center items-center my-2 animate-in slide-in-from-top">
            <div class="flex py-1 px-4 gap-4 bg-white rounded-md" v-if="!evaluatedText">
                <div class="text-sm text-left">
                    Listen <iconify-icon icon="solar:play-stream-bold-duotone" class="align-middle text-2xl"></iconify-icon> and record as many times as you need.
                    <br> 
                    You have  <strong :class="verifyClass">{{ verifyTimes }} </strong> <strong class="text-success">VERIFY</strong> <iconify-icon icon="solar:chat-round-check-bold-duotone" class="text-success  text-lg"></iconify-icon> attempt<template v-if="verifyTimes!==1">s left</template>.
                </div>
                <button class="btn btn-success" @click="verify" :class="loading?'!btn-neutral':''">
                    <template v-if="!loading">
                        Verify
                        <div><iconify-icon icon="solar:chat-round-check-bold-duotone" class="align-super text-2xl"></iconify-icon></div>
                    </template>
                    <template v-else>
                        <div>
                            <iconify-icon class="animate-spin" icon="solar:volume-knob-line-duotone"></iconify-icon>
                            Analyzing
                        </div>
                    </template>
                </button>
            </div>
            <div v-else class="text-center p-1">
                <div class="text-xs text-slate-400">Your answer:</div>
                <div v-html="evaluatedText" class="text-lg border-2 border-slate-200 px-2 py-1 rounded"></div>
                <div v-if="verifyTimes==0" class="my-1 text-xs">
                    You have  <strong :class="verifyClass">{{ verifyTimes }} </strong> <strong class="text-success">VERIFY</strong> <iconify-icon icon="solar:chat-round-check-bold-duotone" class="text-success  text-lg"></iconify-icon> attempt<template v-if="verifyTimes!==1">s left</template>.
                </div>
            </div>
        </div> 
    </template>
    <div class="bg-info text-sm text-white text-center rounded" v-if="errorVerification">{{ errorVerification }}</div>
    
</div>
</template>
<script setup>
import WaveSurfer from 'wavesurfer.js'

import { useOda } from "../../store/oda.js"
import ShapesAnimation from '../all/ShapesAnimation';
import axios from 'axios';
//import FNS from './audiorecordFN.js'
import {useFN} from './audiorecordFN.js'

import {useBlocks} from './blocks.js'


const FNS = useFN()
const blocks = useBlocks()


const oda = useOda()
const playing = ref(false)
const block = ref()
const blockAnimationContainer = ref()
const blockwave = ref()
//WAVE
const wavesurfer = ref(null)
const isRecording = ref(false)

//TIMER
const recordingTimelimit = ref(5)
const recordingProgress = ref(0)
const recordingTimer = ref()

// RECORD
const audiorecordedBlob = ref(null)
const audiorecordedB64 = ref(null)
const audiorecordedWav = ref(null)

//Verify vars 
const evaluatedText = ref(null)
const errorVerification = ref()

const loading = ref(false)


const verifyTimes = ref(3)

const verifyClass = computed(()=>{
    let classy = 'bg-secondary'
    let commons = ' text-white px-1 rounded'
    switch(verifyTimes.value){
        case 2:
            classy = 'bg-accent'
            break;
        case 1:
            classy = 'bg-primary'
            break;
    }
    return classy+commons
})

//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})

recordingTimelimit.value = props.data.timelimit || 5








const init = async () => {
        const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)

        wavesurfer.value = WaveSurfer.create({
            container: blockwave.value,
            waveColor: '#00a8e1',
            progressColor: '#e7004c',
            barWidth: 8,
            barGap: 1,
            barRadius: 4,
            cursorWidth: 10,
            fillParent: true,
            splitChannels: false,
            normalize: true,
            barHeight: 0.5
        })

        wavesurfer.value.on('interaction', () => {
        })
        wavesurfer.value.on('play', () => {
           playing.value = true
        })
        wavesurfer.value.on('pause', () => {
            playing.value = false
        })
        wavesurfer.value.on('load', () => {
        })
        wavesurfer.value.on('ready', () => {

        })

}






const startRecord = () => {
    evaluatedText.value = null
    errorVerification.value = null
    audiorecordedB64.value = null
    playing.value = false
    recordingProgress.value = 0
    wavesurfer.value.stop()
    ShapesAnimation.working(blockAnimationContainer.value)
    FNS.startRecord()
    recordingTimer.value = setInterval(()=>{
        recordingProgress.value+=0.25
        if(!audiorecordedB64.value && (recordingProgress.value >= recordingTimelimit.value)){
            stopRecord()
            clearInterval(recordingTimer.value)
        }
    },250)
}

const stopRecord = async () => {
    FNS.stopRecord().then(thedata => {
        audiorecordedBlob.value = thedata.blob
        audioPlayerStart()
    }).catch(error => {
        console.log('Error:', error);
    });
    blockAnimationContainer.value.querySelectorAll('[data-name="mojs-shape"]').forEach((item)=>{
        item.remove()
    })
}


const audioPlayerStart = () => {
    wavesurfer.value.loadBlob(audiorecordedBlob.value)
    audioto64(audiorecordedBlob.value)
}

const audioto64 = async (blob) => {
    audiorecordedB64.value = await FNS.tob64(blob)
    audiorecordedWav.value = await FNS.toWAV(blob)
    blocks.evaluateFN({blob:audiorecordedB64.value, text: evaluatedText.value, verifyTimes: verifyTimes.value})
}




const clicked = async () => {
    if(playing.value){
        wavesurfer.value.stop()
    } else {
        wavesurfer.value.play()
    }
    
}


const verify = async () => {
    if(loading.value){return false}
    if(verifyTimes.value<=0){ return false }
    loading.value = true
    errorVerification.value = null
    try{
        const res = await axios.post('https://bluetest.mx/reCreaIngles/gateway/api/Audio', {
            "text": props.data.positive,
            "recording": audiorecordedWav.value
        }, {
            headers: {"X-API-KEYA": "UikgoDyBKWrhsWF7y2qa4wLSbDFLPeSqYBYX0rTPTEzjCGZWUy17BHLI7956HLASOGAEVPEQWEWesI3tEshNcbyB4pyCPgZU0dC9UWhwwANF2h0NIwdmKei5L6RHqTM4HXPfK3MI"}
        })
        const data = res.data

        if(data?.data){
            loading.value = false
            blocks.result.value = data.data.score > 90
            evaluatedText.value = data.data.evaluatedtext
            verifyTimes.value -= 1
            blocks.evaluateFN({blob:audiorecordedB64.value, text: evaluatedText.value, verifyTimes: verifyTimes.value})
        } else {
            audiorecordedB64.value = null
            loading.value = false
            errorVerification.value = "There's been an error. Record your audio it again."
        }
        } catch(err) {
        console.log(err)
        loading.value = false
    }
}


const reloadAudio = async (b64) => {
    FNS.b64toBlob(b64).then((theblob)=>{
        audiorecordedBlob.value = theblob
        audioPlayerStart()
    })
}


onMounted(() => {
    init()
    FNS.checkPermission()

    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    if(blockdata && blockdata?.v!=null){

        //input.value = blockdata.v
        audiorecordedB64.value = blockdata.v.blob
        evaluatedText.value = blockdata.v.text
        verifyTimes.value = blockdata.v.verifyTimes
        reloadAudio(audiorecordedB64.value)

    } else {
        blocks.evaluateFN(null)
    }
})

</script>