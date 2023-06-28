<template>

<label :class="data.class || '' " ref="block" class="border-4 bg-secondary/10 hover:bg-secondary/20 text-secondary border-dashed border-secondary rounded  cursor-pointer flex justify-center items-center relative">
  <input accept="image/*" type="file" @change="onChange" class="opacity-0 absolute w-full h-full cursor-pointer" />
  
  <div v-if="input" class="p-1 cursor-pointer">
    <img :src="input" alt="Uploaded File" w-full />
    <div class="text-xs">Click to upload a new image</div>
  </div>
  <div v-else class="p-10 cursor-pointer">
    <div>Upload an image</div>
    <div class="text-xs">.jpg or .png</div>
  </div>
</label>

  
</template>

<script setup>
import Compressor from 'compressorjs'

import {useBlocks} from './blocks.js'
const blocks = useBlocks()
import { useOda } from "../../store/oda.js"
const oda = useOda()

const block = ref()


const props = defineProps({
    data: Object,
    blockindex: String
})

const input = ref(null);


const onChange = (event) => {
  const file = event.target.files[0];
  
  if(!file){
    return false
  }
  new Compressor(file, {
    quality: 0.5,
    convertSize: 1000,
    convertTypes: ['image/png'],
    mimeType: 'image/jpeg',
    maxWidth: 600,
    maxHeight: 600,
    success(result) {
      const reader = new FileReader();
      reader.onload = () => {
        input.value = reader.result;
        blocks.result.value = true
        blocks.evaluateFN(input.value)
      };
      reader.readAsDataURL(result);
    },
    error(err) {
      console.log(err.message);
    },
  })
  
}

onMounted(() => {
  const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
  console.log(blockdata)
  if(blockdata && blockdata?.v!=null){
        input.value = blockdata.v
    }
})

</script>
