<template>

<div ref="block" data="dragitem" :blockindex="blockindex" class="relative min-w-[20px] min-h-[20px] bg-slate-100 rounded" :class="[ /*data.dropzones.replace('.',''),*/ data.class || '' ]">
    <div :name="dragitemname" ref="dragitem" :class="data.classitem||'btn btn-accent !transition-none text-neutral shadow-md shadow-slate-500/50 cursor-grab active:cursor-grabbing border-double border-b-4 border-neutral/50 relative flex justify-center items-center'" >
        <iconify-icon v-if="!data.classitem" icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
        <Content :data="item" v-for="(item, index) in datacontent" :key="index" :blockindex="blockindex+'-'+index"></Content>
    </div>
    
    <template v-if="lineattrs">
        <Line :data="lineattrs" :blockindex="blockindex+'-dragdropline'"></Line>
    </template>

  </div>

<!--<div class="itemable w-fit h-fit p-2 bg-primary text-white">Moveme</div>-->
</template>
<script setup>
import interact from 'interactjs'

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

const getRandomCharacters=_=>"xxxx".replace(/x/g,_=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.random()*62|0]);


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
  datacontent.value = JSON.parse(JSON.stringify(props.data.content))
  dragitemname.value = getRandomCharacters()
  lineFN(dragitemname.value)
  

    const draginteract = interact(dragitem.value)
    
    draginteract.draggable({
      autoScroll: true,
      listeners: { 
        move: dragMoveListener,
        end: (event) => {
          if(blocks.freeze.value){
            return false
          }
          var target = event.target
          target.style.transform = 'translate(0px, 0px)'
          target.setAttribute('data-x', 0)
          target.setAttribute('data-y', 0)
          onChange()
        }
      }
    })

 

    const dragzone = interact(block.value)
    dragzone.dropzone({
        accept: dragitem.value,
        ondrop: function (event) {
            block.value.appendChild(event.relatedTarget)
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
  


const dragMoveListener = (event) => {
  if(blocks.freeze.value){
      return false
  }
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
  
}

onMounted(() => {
    init()
    

});

</script>