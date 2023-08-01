<template>

<ScreenTransition></ScreenTransition>
<div class="oda-screen">
        <div class="text-center opacity-60">{{odapath()}}</div>
        
        <h1 class="text-xl md:text-3xl my-5">{{ oda.oda.title }}</h1>
        

        <Content  v-for="(item, index) in oda?.oda?.intro?.content" :key="index" :data="item"></Content>
        
        <template v-if="!oda.oda.hideattempts">
                <template v-if="((oda.odaAttempts+1) <= oda.odaAttemptsLimit)">
                        
                        <router-link class="button text-3xl" to="/activity" tag="button" v-if="oda.oda.intro.buttons.start">
                                <template v-if="oda.freeze">
                                        View activity
                                </template>
                                <template v-else>
                                        {{ oda.oda.intro.buttons.start }}
                                </template>
                        </router-link>

                        <div v-if="!oda.freeze" class="text-sm mt-5 text-slate-500 dark:text-slate-300 dark:bg-slate-700 bg-slate-100 rounded p-1">This is your attempt {{ oda.odaAttempts+1 }} of {{ oda.odaAttemptsLimit }} to complete the activity.</div>
                </template>
                <template v-else>
                        <div  v-if="!oda.freeze" class="text-sm mt-5 text-slate-500 dark:text-slate-300 dark:bg-slate-700 bg-slate-100 rounded p-1">Completed activity</div>
                </template>
        </template>


</div>

</template>
<script setup>
import { useRouter } from "vue-router";
import { useOda } from "../store/oda.js"
const oda = useOda()
const router = useRouter()

window.parent.postMessage(JSON.stringify({datatype: 'intro'}), '*')


const odapath = () => {
        const id = oda.odaID
        const nivel = id.slice(0,4).replace('-','.')

        if(nivel=='A1.1' || nivel=='A1.2' || nivel=='A2.1' || nivel=='A2.2' || nivel=='B1.1' || nivel=='B1.2' || nivel=='B2.1'  || nivel=='B2.2'){
                const unidad = id.slice(5,6)
                const leccion = id.slice(7,8)
                const ejercicio = id.slice(9,10)
                return 'Course ' + nivel + ' - Unit ' + unidad + ' - Lesson ' + leccion + ' - Exercise ' + ejercicio
        }
}

</script>