<template>
<ScreenTransition></ScreenTransition>
<div class="oda-screen">
    
    
    <Content  v-for="(item, index) in oda.oda.end.content" :key="index" :data="item"></Content>


    <RestartButton v-if="oda.oda?.end?.buttons?.restart || isLocalhost" :data="oda.oda.end.buttons.restart"></RestartButton>


</div>
</template>
<script setup>
import { useOda } from "../store/oda.js"
const oda = useOda()
const isLocalhost = window.location.href.includes('localhost')
</script>