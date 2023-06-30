<template>
<ScreenTransition></ScreenTransition>
<div class="oda-screen text-neutral">
    
    
    <Content  v-for="(item, index) in oda.oda.end.content" :key="index" :data="item"></Content>

    <router-link  to="/activity"  v-if="oda.freeze">
        <button class="button">Back</button>
    </router-link>
<!--
    <RestartButton v-if="oda.oda?.end?.buttons?.restart || isLocalhost" :data="oda.oda.end.buttons.restart"></RestartButton>
-->
    
</div>
</template>
<script setup>
import { useOda } from "../store/oda.js"
const oda = useOda()
const isLocalhost = window.location.href.includes('localhost')



</script>