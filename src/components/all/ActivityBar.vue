<template>
<div class="text-white w-full rounded px-2 py-1 bg-neutral/20 mb-1 flex justify-between items-center">
    {{ oda.oda.title }}
    <TimerClock v-if="oda.oda.time == 0"></TimerClock>
    <TimerCountdown v-if="oda.oda.time > 0"></TimerCountdown>
</div>    
</template>
<script setup>
import { useOda }  from '../../store/oda.js'
const oda = useOda()

</script>