<template>
<div ref="block" :class="['flex flex-wrap gap-0.5 items-center justify-center bg-slate-50 p-0.5 rounded relative']">
    <button ref="blockRecordBtn" :class="['btn relative  text-3xl p-0.5 flex-grow-0 m-2', (isRecording?'btn-primary':'aspect-square btn-secondary'), data.class || '']" @click="startRecord" :disabled="!wavesurfer" >
        <iconify-icon icon="solar:record-bold-duotone"></iconify-icon>
        <div v-if="isRecording" class="text-xs">
            Now Recording
        </div>
    </button>
    <progress v-if="isRecording" class="progress progress-primary w-full" :value="recordingProgress" :max="recordingTimelimit"></progress>
    <div v-show="audiorecordedB64" class="flex-grow flex gap-0.5 items-center bg-slate-50 p-0.5 rounded">
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
</template>
<script setup>
import WaveSurfer from 'wavesurfer.js'

import { useOda } from "../../store/oda.js"
import ShapesAnimation from '../all/ShapesAnimation';
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

//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})

recordingTimelimit.value = props.data.timelimit || 5

const init = async () => {
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

</script>