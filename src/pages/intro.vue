<template>



<ScreenTransition></ScreenTransition>
<div class="oda-screen">
        <h1 class="text-xl md:text-3xl">{{ oda.oda.title }}</h1>

        <Content  v-for="(item, index) in intro.content" :key="index" :data="item"></Content>

        <router-link class="button text-3xl" to="/activity" tag="button" v-if="intro.buttons.start">{{ intro.buttons.start }}</router-link>
        
        

</div>

</template>
<script setup>
import { useOda } from "../store/oda.js"
const oda = useOda()
const intro = oda.oda.intro
</script>