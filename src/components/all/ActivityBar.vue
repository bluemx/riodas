<template>
<div class="text-sky-800 w-full rounded-lg px-2 py-1 bg-white mb-1 flex items-center gap-2">
    <!--<RestartButton></RestartButton>-->
    <div class="mr-auto">
        {{ oda.oda.title }}
    </div>
    <SceneInstructions v-if="sceneInstructions" :data="oda.oda.activity.scenes[scenenum].instructions"></SceneInstructions>

    <div v-show="oda.oda.clock || oda.oda.countdown || sceneCountdown" class="flex gap-2 bg-red-800 min-w-[4rem] rounded justify-center items-center text-white py-1">
        <TimerClock v-show="oda.oda.clock"></TimerClock>
        
        <TimerCountdown v-if="oda.oda.countdown > 0"  :timecount="oda.oda.countdown" store-as="totaltime" ></TimerCountdown>
        <TimerCountdown v-if="sceneCountdown>0" :timecount="sceneCountdown" :store-as="sceneName"></TimerCountdown>
    </div>
</div>    
</template>
<script setup>
import { useOda }  from '../../store/oda.js'
const oda = useOda()

// ** Per scene
const route = useRoute()
const scenenum = route.params.scene || 0
const sceneName = 'scenetime_'+(scenenum+1)
const sceneCountdown = oda.oda.activity.scenes[scenenum].countdown
const sceneInstructions = oda.oda.activity.scenes[scenenum].instructions && oda.oda.activity.scenes[scenenum].instructions.content.length>0
</script>