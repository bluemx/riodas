<template>
<div>
<div ref="block" data="dragitem" :blockindex="blockindex" class="dragitem relative min-w-[20px] min-h-[20px] bg-slate-100 rounded" :class="[ /*data.dropzones.replace('.',''),*/ data.class || '' ]">
    <div :name="dragitemname" ref="dragitem" :class="[data.classitem||'btn btn-accent !transition-none text-neutral shadow-md shadow-slate-500/50 cursor-grab active:cursor-grabbing border-double border-b-4 border-neutral/50 relative flex justify-center items-center', dragging?'!fixed z-10':'']" >
        <iconify-icon v-if="!data.classitem" icon="solar:menu-dots-outline" class="absolute bottom-full text-slate-400"></iconify-icon>
        <Content :data="item" v-for="(item, index) in datacontent" :key="index" :blockindex="blockindex+'-'+index"></Content>
        {{ autoscrolled?'✅':'❌' }}
    </div>

    
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
  datacontent.value = JSON.parse(JSON.stringify(props.data.content))
  dragitemname.value = getRandomCharacters()
  lineFN(dragitemname.value)
  

    const draginteract = interact(dragitem.value)
    
    draginteract.draggable({
      autoScroll: {
      container: document.querySelector('[data=activity-scroll]'),
      margin: 100,
      distance: 100,
      interval: 10,
      speed: 500,
    },
    
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

    draginteract.on('dragstart', ()=>{
      position.value = { x: 0, y: 0 }
      block.value.style.transform = `translate(0px, 0px)`
      autoscrolled.value = false
      dragging.value = true
    })
    draginteract.on('dragend', ()=>{
      position.value = { x: 0, y: 0 }
      block.value.style.transform = `translate(0px, 0px)`
      autoscrolled.value = false
      dragging.value = false
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
  
/*

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
*/



const dragMoveListener = (event) => {
  if(blocks.freeze.value){
      return false
  }
  
  var scrollElement = document.querySelector('[data="activity-scroll"]');
  var actScroll = scrollElement.scrollTop;

  position.value.x += event.dx
  position.value.y += event.dy

  let finalX = position.value.x
  let finalY = position.value.y 




  event.target.style.transform = `translate(${finalX}px, ${finalY}px)`


  console.log(finalY)
  //finalY = event.screenY + actScroll


  /*
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // Get the scroll position of the specific element
  var scrollElement = document.querySelector('[data="activity-scroll"]');
  var actScroll = scrollElement.scrollTop;



  // Subtract the scroll position from the calculated x and y
  //x -= scrollX;
  y = Math.round(y);
  //console.log(y, ' - CCSCROLL:', actScroll , ' = ', y-actScroll)


  target.style.transform = 'translate(' + x + 'px, ' + (y-actScroll) + 'px)';
  console.log(actScroll, currentcontainerscroll.value, y, event.dy)
  
  
  */
  /*
  if(actScroll !== currentcontainerscroll.value){
    target.style.transform = 'translate(' + x + 'px, ' + (y-actScroll+currentcontainerscroll.value) + 'px)';
    autoscrolled.value = true
    //console.log('👇', y, currentcontainerscroll.value, event.dy, 'autoscrolled:',autoscrolled.value?'✅':'❌')
  } else {
    if(autoscrolled.value){
      target.style.transform = 'translate(' + x + 'px, ' + (y) + 'px)';
    } else {
      target.style.transform = 'translate(' + x + 'px, ' + (y-actScroll) + 'px)';
    }
    //console.log('🙅‍♂️', y, currentcontainerscroll.value, event.dy, 'autoscrolled:',autoscrolled.value?'✅':'❌')
  }
*/
/*
  currentcontainerscroll.value = actScroll
  

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
  */
}






onMounted(() => {
    init()
    

});

</script>