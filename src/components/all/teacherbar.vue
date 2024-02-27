<template>
<div ref="block" class="teacherbar overflow-clip bg-info text-white rounded p-10 text-center flex justify-center flex-col items-center text-xl mt-5 shadow-2xl drop-shadow-2xl">
    <div>
        Out of the 
        <span class="text-white/70 dark:text-white/80">{{getTeacherInputs.total}} questions</span>, you marked 
         <span class="bg-success text-white inline-block p-1 rounded">{{getTeacherInputs.positive}} as correct</span>
         and left <span class="bg-neutral text-white inline-block p-1 rounded">{{getTeacherInputs.comments}} comments</span> 
         for the student.
    </div>
    <div class="button !block cursor-pointer mt-10" @click="saveEv">
        <template v-if="!saving">
            Save evaluation and comments.
        </template>
        <template v-else>
            Saving...
        </template>
    </div>
</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useOda } from '../../store/oda';
import ShapesAnimation from './ShapesAnimation';

const oda = useOda()
const block = ref()
const {getTeacherInputs} = storeToRefs(oda)
const saving= ref(false)
const saveEv = () => {
    if(saving.value)
        return false
    saving.value = true

    const response = JSON.parse(JSON.stringify(getTeacherInputs.value))
    response.inputs = window.btoa(JSON.stringify(response))
    response.datatype = 'teacher';
    response.isExtra = oda.isExtra;
    const message = JSON.stringify(response)
    ShapesAnimation.playsave(block.value)
    window.parent.postMessage(message, "*");
    console.log(message)
    setTimeout(()=>{
        saving.value = false
    }, 1000)
}
</script>