<template>
<div>
<div ref="block" data="dragitem" :blockindex="blockindex" class="dragitem dragzone relative min-w-[20px] min-h-[20px]" :class="[ /*data.dropzones.replace('.',''),*/ data.class || '' ]">
    <div :name="dragitemname" ref="dragitem" :class="[data.classitem||'btn btn-accent !transition-none text-neutral shadow-md shadow-slate-500/50 cursor-grab active:cursor-grabbing border-double border-b-4 border-neutral/50 relative flex justify-center items-center', dragging?'!fixed z-10':'', ' ring-white/80 ring-1']" >
        <iconify-icon v-if="!data.classitem" icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
        <Content :data="item" v-for="(item, index) in datacontent" :key="index" :blockindex="blockindex+'-'+index"></Content>
    </div>

    
  </div>
  <template v-if="lineattrs">
    <Line :data="lineattrs" :blockindex="blockindex+'-dragdropline'"></Line>
  </template>
</div>
<!--<div class="itemable w-fit h-fit p-2 bg-primary text-white">Moveme</div>-->
</template>
<script setup>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";  
import interact from 'interactjs'

gsap.registerPlugin(Draggable);

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
const datacontent = ref()
const dragitemname = ref()
const hasline = ref(false)
const lineattrs = ref(null)
const blocks = useBlocks()
const dragging = ref(false)
const autoscrolled = ref(false)
const currentcontainerscroll = ref(0)
const getRandomCharacters=_=>"xxxx".replace(/x/g,_=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.random()*62|0]);
const position = ref({ x: 0, y: 0 })

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

  lineattrs.value = {...datacontent.value[hasline.value]}
  lineattrs.value.from = props.data.name
  lineattrs.value.to = dragitemname.value
  datacontent.value.splice(hasline, 1)
}

watch(()=>props.data,(nuv)=>{
    init()
}, {deep:true})



const init = () => {
  if(!dragitem.value){
    return false
  }

  //FIX CONTAINER SIZE
  const blockrect = block.value.getBoundingClientRect()
  block.value.style.height = blockrect.height+"px"


  //
  datacontent.value = JSON.parse(JSON.stringify(props.data.content))
  dragitemname.value = getRandomCharacters()
  lineFN(dragitemname.value)
  
  if(blocks.freeze.value){
    return false
  }

  Draggable.create(dragitem.value, {
    autoScroll: 1,
    onDragStart: (e)=>{
      document.querySelectorAll('.dragzone').forEach((itm)=>{
        itm.classList.add('border-accent', 'animate-pulse')
      })

    },
    onDragEnd: (e) => {
      let dropped = false
      document.querySelectorAll('.dragzone').forEach((itm)=>{
        itm.classList.remove('border-accent', 'animate-pulse')
        const droparea = itm.getBoundingClientRect()
          if(Draggable.hitTest(dragitem.value,itm)){
            itm.appendChild(dragitem.value)
            dropped = true
          }
      })
      if(dropped){
        onChange()
      }
      gsap.to(dragitem.value, {duration: dropped?0:0.5, x:0, y:0})

    }
  })


    


    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    if(blockdata){
      if(blockdata.v != props.data.id){
        const newParent = document.getElementById(blockdata.v)
        if(newParent){
          newParent.appendChild(dragitem.value)
        }
      }
    }


}






onMounted(() => {
    init()
    

});

</script>