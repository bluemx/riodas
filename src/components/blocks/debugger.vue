<template>
<div class="flex text-xs gap-5 flex-wrap">
    <div>Positive: {{scenedebs.positive}}</div>
    <div>Responded: {{scenedebs.responded}}</div>
    <div>Total: {{scenedebs.total}}</div>
</div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { useOda } from "../../store/oda.js"
const oda = useOda()
const route = useRoute()
const scenenum = route.params.scene || 0

const scenedebs = computed(()=>{
    return oda.getSceneInputs(scenenum)
})
</script>