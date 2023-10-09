<template>
<div class=" flex justify-center items-center px-2">
    <div :class="['radial-progress bg-white border-2 border-opacity-10 border-white', percentagecolor]" :style="'--value:'+percentagedown+'; --size:24px; --thickness: 6px;'"></div>
    <div class="ml-1 text-md">
        {{ elapseddown }}
    </div>
</div>
</template>
<script setup>

import { useOda }  from '../../store/oda.js'
const oda = useOda()
const router = useRouter()
const timestamp = useTimestamp()
const percentagedown = ref(0)
const percentagecolor = ref('text-neutral')
const props = defineProps({
    timecount: Number,
    storeAs:String
})



// SET TIME
const time = ref(0)
time.value = props.timecount



let initialTimestamp = timestamp.value;

if(oda.user[props.storeAs]){
    initialTimestamp -= (oda.user[props.storeAs]*1000)
} else {
    oda.user[props.storeAs] = 0
}



const setPercentagecolor = (percent) => {

    if(percent>75){
        percentagecolor.value = 'text-primary'
    } else if(percent<=75 && percent>50){
        percentagecolor.value = 'text-warning'
    } else if(percent<=50 && percent>25){
        percentagecolor.value = 'text-success'
    } else if(percent<=25 && percent>10){
        percentagecolor.value = 'text-secondary'
    } else if(percent<=10){
        percentagecolor.value = 'text-neutral'
    }

}



const elapseddown = computed(()=>{
    const elapsedtime = Math.floor((timestamp.value - initialTimestamp) / 1000);
    if(elapsedtime >= time.value){
        router.push('/end')
    }
    oda.user[props.storeAs] = elapsedtime
    percentagedown.value = (100/time.value) * elapsedtime
    setPercentagecolor(percentagedown.value)
    return secondsToTime(time.value - elapsedtime)
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