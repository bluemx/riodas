<template>

    <img :src="filepath" :class="[data.class || '']" alt="Image">


</template>
<script setup>
import { useOda } from "../../store/oda.js"
const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const filepath = '/ODAS/'+oda.odaID+'/'+props.data.file

/*
const dialog = ref()
onMounted(() => {
  dialog.value.show()  
})
*/

</script>