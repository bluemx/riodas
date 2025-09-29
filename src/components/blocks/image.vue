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

const filepath = computed(() => {
  const f = props?.data?.file || ''
  if (!f) return false
  return /^(https?:|data:|blob:|\/\/)/i.test(f)
    ? f
    : `${oda.baseurl}/ODAS/${oda.odaID}/${f}`
})
</script>