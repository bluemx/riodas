<template>

<ScreenTransition></ScreenTransition>
<div class="oda-screen  intro-oda-screen">
        <!--
                <div class="max-w-[10rem] mb-10"><img :src="recreaingles" class="w-full"></div>
        -->

        <div class="text-center  text-white">{{odapath()}}</div>
        <!--
        <div class="text-xs opacity-40">{{ oda.odaID }}</div>
        -->
        <h1 class="text-xl md:text-3xl my-5 ri-title">{{ oda.oda.title }}</h1>
        

        <Content  v-for="(item, index) in oda?.oda?.intro?.content" :key="index" :data="item"></Content>
        

        <template v-if="!oda.oda.hideattempts">
                <template v-if="oda.odaAttemptsLimit===99 || ((oda.odaAttempts+1) <= oda.odaAttemptsLimit)">
                        <router-link class="button text-3xl" to="/activity" tag="button" v-if="oda.oda.intro.buttons.start">
                                <template v-if="oda.freeze">
                                        View activity
                                </template>
                                <template v-else>
                                        {{ oda.oda.intro?.buttons.start }}
                                </template>
                        </router-link>


                        <div v-if="oda.odaAttemptsLimit<99 && !oda.freeze" class="text-md text-white mt-5 text-center">This is your attempt <strong>{{ oda.odaAttempts+1 }} of {{ oda.odaAttemptsLimit }}</strong> to complete the activity.</div>
                </template>
                <template v-else>
                        <div  v-if="!oda.freeze" class="text-md mt-5 rounded text-center">Completed activity</div>
                </template>
        </template>


</div>

</template>
<script setup>
import { useRouter } from "vue-router";
import { useOda } from "../store/oda.js"
const oda = useOda()
const router = useRouter()

import recreaingles from '../assets/recreaingles.svg'

window.parent.postMessage(JSON.stringify({datatype: 'intro'}), '*')


const odapath = () => {
        const id = oda.odaID
        if(id !== null){
                const nivel = id.slice(0,4).replace('-','.')
        
                if(nivel=='A1.1' || nivel=='A1.2' || nivel=='A2.1' || nivel=='A2.2' || nivel=='B1.1' || nivel=='B1.2' || nivel=='B2.1'  || nivel=='B2.2'){
                        const unidad = id.slice(5,6)
                        const leccion = id.slice(7,8)
                        const ejercicio = id.slice(9,10)
                        return 'Course ' + nivel + ' - Unit ' + unidad + ' - Lesson ' + leccion + ' - Exercise ' + ejercicio
                }
        } else {
                return ""
        }
}

</script>