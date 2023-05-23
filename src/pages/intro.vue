<template>



<ScreenTransition></ScreenTransition>
<div class="oda-screen">
        <h1 class="text-4xl">{{ oda.oda.title }}</h1>

        <Content  v-for="(item, index) in oda.oda.intro.content" :key="index" :data="item"></Content>

        <router-link class="button text-3xl" to="/activity" tag="button">Comenzar</router-link>
        
        

</div>

</template>
<script setup>
import { useOda } from "../store/oda.js"
const oda = useOda()

</script>