<template>
<div ref="block" :blockindex="blockindex" class=" min-w-[20px] min-h-[20px] bg-slate-100 rounded" :class="[ /*data.dropzones.replace('.',''),*/ data.class || '' ]">
    <div :name="dragitemname" ref="dragitem" draggable="true" class="btn btn-accent text-neutral shadow-md shadow-slate-500/50 cursor-grab active:cursor-grabbing border-double border-b-4 border-neutral/50 relative flex justify-center items-center">
        <iconify-icon icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
        <Content :data="item" v-for="(item, index) in datacontent" :key="index" :blockindex="blockindex+'-'+index"></Content>
    </div>
    
    <template v-if="lineattrs">
        <Line :data="{...lineattrs, to:dragitemname}" :blockindex="blockindex+'-dragdropline'"></Line>
    </template>

</div>
</template>
<script setup>
import {useBlocks} from './blocks.js'
import { useOda } from "../../store/oda.js"
const props = defineProps({
    data: Object,
    blockindex: String
})

const oda = useOda()
const block = ref()
const dragitem = ref()
const dropzones = ref([])
const datacontent = ref(props.data.content)
const dragitemname = ref()
const hasline = ref(false)
const lineattrs = ref(null)
const blocks = useBlocks()





const dragstart = ($event) => {
  if(blocks.freeze.value){
      return false
  }
  dropzones.value.forEach(dropzone => {
        const classes = ['outline-2', 'outline-offset-2', 'outline-dashed', 'outline-slate-500']
        dropzone.classList.add(...classes)
        setTimeout(()=>{
            dropzone.classList.remove(...classes)
        }, 1000)
    })
};


const getRandomCharacters=_=>"xxxx".replace(/x/g,_=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.random()*62|0]);

const dragover = ($event) => {
    $event.preventDefault();
};

const drag = ($event) => {
  $event.dataTransfer.clearData();
  $event.dataTransfer.setData("text/plain", "hola");
};

const drop = ($event) => {
    
    if(blocks.freeze.value){
      return false
    }
    const droppedData = $event.dataTransfer.getData("text");
    console.log(droppedData)
    $event.target.appendChild(dragitem.value)
    onChange()
};

const onChange = () => {
  if(props.data.positiveid){
    const positivesID = props.data.positiveid.split(',')
    const parentID = dragitem.value.parentNode.getAttribute('id')
    blocks.result.value = positivesID.includes(parentID)
    blocks.evaluateFN(parentID)
  }
}




const lineFN = () => {
  hasline.value = datacontent.value.findIndex(i=>i.block=='line')
  if(hasline.value == -1){ return false }
  lineattrs.value = {...datacontent.value[hasline]}
  lineattrs.value.from = props.data.name
  datacontent.value.splice(hasline, 1)
}

const dropzonesFN = () => {
  dragitemname.value = getRandomCharacters()
    dropzones.value = document.querySelectorAll(props.data.dropzones)
    dropzones.value.forEach(dropzone => {
      if(!dropzone.getAttribute('data-drop')){
        dropzone.addEventListener('drop', drop)
        dropzone.addEventListener('dragover', dragover)
        dropzone.setAttribute('data-drop', true)
      }
    });
}

watch(()=>props.data,(nuv)=>{
    init()
}, {deep:true})

const init = () => {
  datacontent.value = props.data.content
  lineFN()
  dropzonesFN()
  // Blocks init
  dragitem.value.addEventListener('dragstart', dragstart);
  
  const blockdata = blocks.initFN(oda, props.data, props.blockindex, dragitem.value)
  if(blockdata){
    if(blockdata.v != props.data.id){
      const newParent = document.getElementById(blockdata.v)
      if(newParent){
        newParent.appendChild(dragitem.value)
      }
    }
  }
  //dragitem.value.addEventListener('dragover', dragover);
  dragitem.value.addEventListener('drag', drag);
}

onMounted(() => {
    init()
});

</script>