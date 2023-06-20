<template>

<ScreenTransition></ScreenTransition>
<div class="oda-screen">
        <h1 class="text-xl md:text-3xl my-5">{{ oda.oda.title }}</h1>
        <Content  v-for="(item, index) in intro.content" :key="index" :data="item"></Content>
        
        <template v-if="((oda.odaAttempts+1) <= oda.odaAttemptsLimit)">
                <router-link class="button text-3xl" to="/activity" tag="button" v-if="intro.buttons.start">{{ intro.buttons.start }}</router-link>
                
                <div v-if="!oda.freeze" class="text-sm mt-5 text-slate-500 dark:text-slate-300 dark:bg-slate-700 bg-slate-100 rounded p-1">This is your attempt {{ oda.odaAttempts+1 }} of {{ oda.odaAttemptsLimit }} to complete the activity.</div>
        </template>
        <template v-else>
                <div  v-if="!oda.freeze" class="text-sm mt-5 text-slate-500 dark:text-slate-300 dark:bg-slate-700 bg-slate-100 rounded p-1">You have used your {{ oda.odaAttempts }} attempts to complete this activity.</div>
        </template>
</div>

</template>
<script setup>
import { useOda } from "../store/oda.js"
const oda = useOda()
const intro = oda.oda.intro
</script>