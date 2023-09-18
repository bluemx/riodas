<template>

</template>
<script setup>

import * as jsPlumbBrowserUI from '@jsplumb/browser-ui';


//PROPS
const props = defineProps({
    data: Object,
    blockindex:String
})

const instance = ref()
const object1 = ref(document.querySelector('[name="634t"]'));
const object2 = ref(document.querySelector('[name="ASR1"]'));




watch(()=>props, (nv)=>{
    //init()
    
}, {deep:true})




const init = () => {  
  const container = document.querySelector('[data-blockindex="0-0"]')
  instance.value = jsPlumbBrowserUI.newInstance({
      container: container
  })
  instance.value.setContainer(container);
  const endpointOptions = {
    endpoint: 'Blank',
    anchor: 'AutoDefault',
    isSource: false,
    isTarget: false,
  };

  instance.value.addEndpoint(object1.value, endpointOptions);
  instance.value.addEndpoint(object2.value, endpointOptions);

  instance.value.connect({
    source: object1.value,
    target: object2.value,
    connector: 'Bezier',
    paintStyle: { stroke: 'green', strokeWidth: 2 },
  });
  setInterval (()=>{
    instance.value.repaintEverything();
  })
}


onMounted(() => {
    init();

})
</script>
