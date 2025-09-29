<template>
<div ref="block" :class="[data.class||'']" :data-blockindex="blockindex">
    <Content :data="item" v-for="(item, index) in data.content" :key="index" :blockindex="blockindex+'-'+index"></Content>
</div>
</template>
<script setup>
import { useOda } from '../../store/oda';

const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const block = ref()

const cssbackground = ref('')
watch(()=>props, ()=>{
    cssbackgroundFN()
}, {deep:true})

const cssbackgroundFN = () => {
  const bg = props?.data?.background || ''
  if (!bg) return

  if (/^(https?:|data:|blob:|\/\/)/i.test(bg)) {
    // externo o data/blob
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      const base64 = canvas.toDataURL('image/webp')
      block.value.style.backgroundImage = `url(${base64})`
    }
    image.src = bg
  } else {
    // relativo local
    const local = `${oda.baseurl}/ODAS/${oda.odaID}/${bg}`
    block.value.style.backgroundImage = `url(${local})`
  }
}
onMounted(() => {
    cssbackgroundFN()
})





</script>