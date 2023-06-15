<template>
<div ref="block" class="mt-2 shadow-2xl drop-shadow-2xl">
    <svg class="mx-auto" width="53" height="18" viewBox="0 0 53 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 18C9 18 16.2732 9.75943 21.4729 2.32149C23.6367 -0.773831 29.3633 -0.773831 31.5271 2.32149C36.7268 9.75943 44 18 53 18H0Z" fill="#9779D3"/></svg>
    <div class="flex space-x-4 bg-info rounded p-2"  v-if="!oda.teacherFreeze">
      <textarea
        v-model="text"
        @blur="onChange"
        class="w-2/3 h-24 p-2 border rounded shadow-sm"
        placeholder="Write your comments..."
      ></textarea>
      <div class="flex gap-1 items-center justify-center flex-col w-1/3 p-2 text-white">
            <div class="text-sm">Answer is:</div>
            <input type="checkbox" class="toggle toggle-lg toggle-success !w-16 !h-8" checked v-model="toggle" @change="onChange" />
            <div :class="['text-xs  rounded py-0.5 px-1', toggle?'bg-success':'bg-primary']">
                {{ toggle?'Right':'Wrong' }}
            </div>
      </div>
    </div>

    <div class="flex justify-center items-center bg-info rounded p-2 text-white text-center"  v-if="oda.teacherFreeze">
        <div v-if="text" class="flex gap-2 items-center"><iconify-icon icon="solar:dialog-2-bold-duotone"> </iconify-icon><div>{{ text }}</div></div>
        <div ref="isright" class="relative w-20 h-20"></div>
    </div>

</div>
  </template>
  <script setup>
  import { ref } from 'vue'
  import ShapesAnimation from '../all/ShapesAnimation'
import { useOda } from '../../store/oda';
  const oda = useOda()
  const props = defineProps({
    data: Object,
    blockindex: String
  })
  const text = ref('')
  const toggle = ref(false)
  const block = ref(null)
  const isright = ref()
  const onChange = () => {
    if(toggle.value){
        ShapesAnimation.play(block.value)    
    }
    setInputs()
  }

  const setInputs = () => {
    oda.setTeacherInput(props.blockindex, toggle.value, text.value )
  }


  const initialData = oda.teacher.inputs[props.blockindex]
    if(initialData){
        toggle.value = initialData.r
        text.value = initialData.v
    }

    onMounted(() => {
        setInputs()
        if(oda.teacherFreeze){
            ShapesAnimation.playkeep(isright.value, ['positive'], true)
        }
    })


  </script>