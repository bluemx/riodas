<template>
  <div>
  <img crossorigin="anonymous" :src="filepath" :class="[data.class || '']" alt="Image">
</div>
</template>
<script setup>
import { useOda } from "../../store/oda.js"
const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})


const filepath = computed(()=>{
  return props.data.file.includes('http')? props.data.file : '/ODAS/'+oda.odaID+'/'+props.data.file
})


</script>