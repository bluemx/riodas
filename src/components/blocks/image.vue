<template>
  <img crossorigin="anonymous" :src="filepath" :class="[data.class || '']" alt="Image">
</template>
<script setup>
import { useOda } from "../../store/oda.js"
const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const filepath = ref('/ODAS/'+oda.odaID+'/'+props.data.file)

watch((props), () => {
  if(props.data.file.includes('http')){
    filepath.value = props.data.file
  }
}, {deep:true})

/*
const dialog = ref()
onMounted(() => {
  dialog.value.show()  
})
*/

</script>