<template>
<div ref="block" :class="[' bg-slate-50 p-0.5 rounded relative']">
    <div class="flex flex-wrap gap-0.5 items-center justify-center">
        <button ref="blockRecordBtn" :class="['btn relative  text-3xl p-0.5 flex-grow-0 m-2', (isRecording?'btn-primary':'btn-secondary'), data.class || '']" @click="startRecord" :disabled="!wavesurfer" >
            <iconify-icon icon="solar:record-bold-duotone"></iconify-icon>
            <div v-if="isRecording" class="text-xs">
                Now Recording
            </div>
            <div v-if="!isRecording && firstclick">Click to record</div>
        </button>
        <progress v-if="isRecording" class="progress progress-primary w-full" :value="recordingProgress" :max="recordingTimelimit"></progress>
        <div v-show="audiorecordedB64" class="flex-grow flex gap-0.5 items-center bg-slate-50 p-0.5 rounded">

            <div v-if="!readyToPlay" class="absolute left-0 top-0 bottom-0 right-0 flex justify-center items-center text-center bg-info/70 z-40 rounded text-white">PROCESSING</div>


            <div ref="blockwave" class=" bg-white rounded p-2 flex-grow ml-2"></div>
            <button :class="['btn relative aspect-square text-3xl p-0.5 flex-grow-0 m-2', (playing?'btn-primary':'btn-secondary'), data.class || '']" @click="clicked" :disabled="!readyToPlay" >
                <template v-if="readyToPlay">
                    <iconify-icon icon="solar:headphones-square-sound-bold" :class="['absolute', !playing?'animate-in zoom-in':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
                    <iconify-icon icon="solar:soundwave-broken" :class="['absolute', playing?'repeat-infinite animate-pulse duration-500 ease-in-out':'animate-out fade-out fill-mode-forwards']"></iconify-icon>
                </template>
                <template v-else>
                    <iconify-icon icon="solar:upload-track-2-linear" class="absolute animate-spin text-neutral"></iconify-icon>
                </template>
            </button>
        </div>
    </div>
    <template v-if="audiorecordedB64 && readyToPlay">
        <div class="flex justify-center items-center mt-2 animate-in slide-in-from-top">
            <div class="flex p-1" v-if="!evaluatedText">
                <div class="text-sm">
                    Listen to your recording <iconify-icon icon="solar:headphones-square-sound-bold"></iconify-icon> . You can record it many times as you need. When ready, click on <span class="text-success">Verify</span>.
                </div>
                <button class="btn btn-success" @click="verify" :class="loading?'!btn-neutral':''">
                    <template v-if="!loading">
                        <iconify-icon icon="solar:user-speak-bold-duotone"></iconify-icon>
                        Verify
                        <iconify-icon icon="solar:chat-round-check-bold-duotone"></iconify-icon>
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

import {useBlocks} from './blocks.js'
const blocks = useBlocks()


const oda = useOda()
const playing = ref(false)
const block = ref()
const blockRecordBtn = ref()
const blockwave = ref()

const readyToPlay = ref(false)
const wavesurfer = ref(null)
const isRecording = ref(false)
const recordingTimelimit = ref(5)
const recordingProgress = ref(0)
const recordingTimer = ref()
const audiorecordedB64 = ref(null)
//Record vars
const recorder = ref()
const recorderStream = ref()
const loading = ref(false)
const firstclick = ref(true)

const evaluatedText = ref(null)
const errorVerification = ref()


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
            wavesurfer.value.stop()
            playing.value = false
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
            setTimeout(()=>{readyToPlay.value=true},3000)
        })

}

const startRecord = async () => {
    evaluatedText.value = null
    errorVerification.value = null
    if(blocks.freeze.value){
        return false
    }
    firstclick.value = false
    if(!isRecording.value){
        //::START RECORDING
        playing.value = false
        wavesurfer.value.stop()
        readyToPlay.value=false
        audiorecordedB64.value = null
        isRecording.value = true
        ShapesAnimation.working(blockRecordBtn.value)
        recordingProgress.value = 0
        recordingTimer.value = setInterval(()=>{
            recordingProgress.value+=0.25
            if(recordingProgress.value >= recordingTimelimit.value){
                stopRecord()
                clearInterval(recordingTimer.value)
            }
        },250)
    
        const URL = window.URL || window.webkitURL;
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext //audio context to help us record
        var constraints = { audio: true, video:false }
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            audioContext = new AudioContext();
            recorderStream.value = stream;
            var input = audioContext.createMediaStreamSource(stream);
            recorder.value = new Recorder(input,{numChannels:1})
            recorder.value.record()
        }).catch(function(err) {
            //if getUserMedia() fails
            isRecording.value = false
            blockRecordBtn.value.querySelectorAll('[data-name="mojs-shape"]').forEach((item)=>{
                item.remove()
            })
        });
    } else {
        stopRecord()
    }
}
const stopRecord = async () => {
    //:: STOP RECORDING
    isRecording.value = false
    blockRecordBtn.value.querySelectorAll('[data-name="mojs-shape"]').forEach((item)=>{
        item.remove()
    })
    recorder.value.stop()
    recorderStream.value.getAudioTracks()[0].stop();
    recorder.value.exportWAV(audioRecorded)
}
const audioRecorded = async (blob) => {
    var url = URL.createObjectURL(blob);
    wavesurfer.value.load(url)
    // TO BASE 64
    audiorecordedB64.value = await new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    })
    
}


onMounted(() => {
    init()
})

const clicked = async () => {
    wavesurfer.value.play()
    
}


const verify = async () => {
    if(loading.value){return false}
    loading.value = true
    errorVerification.value = null
    try{
        const res = await axios.post('https://recreaingles.org/gateway/api/Audio', {
            "text": props.data.positive,
            "recording": audiorecordedB64.value
        }, {
            headers: {"X-API-KEYA": "UikgoDyBKWrhsWF7y2qa4wLSbDFLPeSqYBYX0rTPTEzjCGZWUy17BHLI7956HLASOGAEVPEQWEWesI3tEshNcbyB4pyCPgZU0dC9UWhwwANF2h0NIwdmKei5L6RHqTM4HXPfK3MI"}
        })
        const data = res.data

        if(data?.data){
            loading.value = false
            blocks.result.value = data.data.score > 90
            evaluatedText.value = data.data.evaluatedtext
            blocks.evaluateFN(evaluatedText.value)
        } else {
            audiorecordedB64.value = null
            readyToPlay.value = false

            loading.value = false
            errorVerification.value = "There's been an error. Record your audio it again."
        }
        } catch(err) {
        console.log(err)
        loading.value = false
    }
}



</script>