<template>

<div class="freeze w-full">
    <Intro></Intro>
    <Activity class="my-10"></Activity>
    <End></End>
</div>


</template>
<script setup>

import { useOda } from "../store/oda.js"
import Intro from './intro.vue'
import Activity from "./activity.vue";
import End from './end.vue'
const oda = useOda()


oda.freeze = true


document.body.classList.add('freeze')

if(oda.teacher){
    document.body.classList.add('teacher')
}
document.getElementById('app').classList.remove('overflow-clip')


</script>