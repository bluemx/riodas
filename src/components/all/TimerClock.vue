<template>
<div class="bg-neutral/50 px-1 py-0.5 rounded flex justify-center items-center">
    <iconify-icon icon="solar:clock-square-outline"></iconify-icon>
    <div class="ml-1 text-xs">
        {{ elapsed }}
    </div>
</div>
</template>
<script setup>
import { useOda }  from '../../store/oda.js'
const oda = useOda()

const timestamp = useTimestamp()
let initialTimestamp = timestamp.value;

if(oda.user.time){
    initialTimestamp -= (oda.user.time*1000)
} else {
    oda.user.time = 0
}

const elapsed = computed(()=>{
    const elapsedtime = Math.floor((timestamp.value - initialTimestamp) / 1000);

    oda.user.time = elapsedtime;
    //return elapsedtime
    return secondsToTime(elapsedtime)
})


const secondsToTime = (seconds) => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;

    var timeString =  "";

    if(hours){ timeString+= padZero(hours) + ':' };
    if(minutes>0){ timeString+=padZero(minutes) + ':' };
    timeString += padZero(remainingSeconds);
    
    return timeString;
}

const padZero = (value) => {
  //return value
    return (value < 10) ? '0' + value : value;
}


//const current = new Date(useTimestamp())
//console.log(current.value)
</script>