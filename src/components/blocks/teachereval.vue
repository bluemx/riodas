<template>

  <div ref="block" class="mt-2  relative">
    
    <!-- TEACHER -->
    <template v-if="!oda.teacherFreeze">
      <VDropdown>
        <button class="animate-pulse w-12 h-12 rounded-full bg-purple-400 text-white" ref="teachericon">
          <iconify-icon icon="solar:user-check-linear" class="text-2xl"></iconify-icon>
        </button>

        <template #popper="{hide}">
          <div class="flex flex-col bg-purple-300 rounded p-1 shadow-2xl drop-shadow-2xl" v-if="!oda.teacherFreeze">
            <textarea v-model="text" @blur="onChange" class="w-full h-20 p-2 border rounded shadow-sm text-xs border-0" placeholder="Write your comments..."></textarea>
            <div class="flex gap-1 items-center justify-center flex-col p-1 ">
              <div class="flex gap-2">
                <div class="text-sm">Answer is:</div>
                <div :class="['text-xs text-white rounded py-0.5 px-1', toggle ? 'bg-success' : 'bg-primary ']">
                  {{ toggle ? 'Right' : 'Wrong' }}
                </div>
              </div>
              <input type="checkbox" class="toggle toggle-lg toggle-success !w-16 !h-8" checked v-model="toggle"
              @change="onChange" />
            </div>
          </div>
        </template>
      </VDropdown>
      
      
    </template>
    
    <!-- STUDENT -->
    <template v-if="oda.teacherFreeze">
      <VDropdown v-if="text!=null">
        <button v-if="text!=null" class="animate-pulse w-12 h-12 rounded-full bg-purple-400 text-white" ref="teachericon">
          <iconify-icon icon="solar:user-check-linear" class="text-2xl"></iconify-icon>
        </button>
        <template #popper="{hide}">
          <div class="flex  justify-center items-center bg-info rounded p-2 text-slate-600 text-center" v-if="oda.teacherFreeze">
            <div v-if="text!==null" class="flex gap-2 items-center">
              <iconify-icon icon="solar:dialog-2-bold-duotone"> </iconify-icon>
              <div>{{ text }}</div>
            </div>
            <!--
            <div v-if="!toggle" class=" text-slate-600">
              <iconify-icon icon="solar:dislike-bold"> </iconify-icon>
            </div>
            -->
          </div>
        </template>

      </VDropdown>
      
      <div v-if="text===null" class="relative w-12 h-12 rounded-full border-2 border-purple-400 text-purple-400 mx-auto flex justify-center items-center" ref="teachericon">
          <iconify-icon icon="solar:user-check-linear" class="text-2xl"></iconify-icon>
        </div>
    </template>

  

  </div>

</template>
<script setup>
import { useOda } from '../../store/oda';

import ShapesAnimation from '../all/ShapesAnimation'
const oda = useOda()
const props = defineProps({
  data: Object,
  blockindex: String
})
const text = ref('')
const toggle = ref(false)
const block = ref()
const isright = ref()
const teachericon = ref()
const viewtextarea = ref(false)

const onChange = () => {
  
  if (toggle.value) {
    ShapesAnimation.play(block.value)
  }
  setInputs()

}
const setInputs = () => {
  oda.setTeacherInput(props.blockindex, toggle.value, text.value)
}



if(oda.teacher?.inputs){
  const initialData =  oda.teacher?.inputs[props.blockindex]
  if (initialData) {
    toggle.value = initialData.r
    text.value = (initialData.v && initialData.v.length>0) ? initialData.v : null
    console.log('iD:::', initialData, text.value)

    if (toggle.value) {

      setTimeout(()=>{
        ShapesAnimation.playkeep(teachericon.value, ['positive'])
      }, 1000)
    }
  }
}

onMounted(() => {
  setInputs()
  
})



</script>