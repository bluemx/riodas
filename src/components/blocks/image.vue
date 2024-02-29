<template>

  <img crossorigin="anonymous" v-if="filepath" :src="filepath" :class="[data.class || '']" alt="Image">

</template>
<script setup>
import { useOda } from "../../store/oda.js"

const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const filepath = computed(()=>{
    if(props.data.file){
      return props.data.file.includes('http')? props.data.file :oda.baseurl+'/ODAS/'+oda.odaID+'/'+props.data.file
    } else {
      return false
    }
})
</script>