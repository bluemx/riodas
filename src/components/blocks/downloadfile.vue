<template>
    <button @click="download(filepath)" class="button">{{data.button || 'Download' }} </button>

</template>
<script setup>
import { saveAs } from 'file-saver';
import { useOda } from "../../store/oda.js"

const oda = useOda()

const props = defineProps({
    data: Object, //button //filename, //format, //file
    blockindex: String
})

const filepath = computed(() => {
  const f = props?.data?.file || ''
  if (!f) return false
  return /^(https?:|data:|blob:|\/\/)/i.test(f)
    ? f
    : `${oda.baseurl}/ODAS/${oda.odaID}/${f}`
})

const download = (filep) => {
    //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    saveAs(filep, props.data.filename || 'file.pdf');
}
</script>