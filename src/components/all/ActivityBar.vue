<template>
<div class="text-white w-full rounded px-2 py-1 bg-neutral/20 mb-1 flex justify-between items-center">
    {{ oda.oda.title }}
    <TimerClock></TimerClock>
</div>    
</template>
<script setup>
import { useOda }  from '../../store/oda.js'
const oda = useOda()

</script>