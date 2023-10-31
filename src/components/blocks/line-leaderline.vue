<template>

</template>
<script setup>
const props = defineProps({
  data: Object,
  blockindex: String,
});
const elFrom = ref()
const elTo = ref()
const listener = ref()
const line = ref()

const lineFN = () => {
  if(!elFrom.value || !elTo.value){ return false }
  if(line.value){
    line.value.remove()
  }
  line.value = new LeaderLine(
    elFrom.value,
    elTo.value,
    {
      startSocket: 'auto',
      endSocket: 'auto',
      outline: true
    }
  )

  listener.value = AnimEvent.add(()=>{ line.value.position() })
}

onMounted(() => {
  
  elFrom.value = document.getElementsByName(props.data.from)[0]
  elTo.value = document.getElementsByName(props.data.to)[0]
  
  lineFN()


  window.addEventListener('scroll', AnimEvent.add(function() {
  line.value.position();
}), false);

  setInterval(()=>{
    console.log(elFrom.value, elTo.value)
    if(!elFrom.value || !elTo.value){ return false }
    //line.value.position()
    lineFN()
  }, 1000)

})
</script>