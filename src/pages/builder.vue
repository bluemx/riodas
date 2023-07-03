<template>
<div class="overflow-y-auto text-neutral">
    <div class="font-bold text-white mb-2 text-2xl">ACTIVITY BUILDER</div>
    <template v-if="!currentbuild">
        <div class="text-slate-100">What type of activity would you like to build?</div>
        <div class="grid grid-cols-4 gap-2 max-w-2xl my-4">
            <div @click="currentbuild = item" class="aspect-square bg-slate-100 rounded flex flex-col justify-center items-center cursor-pointer hover:bg-slate-100 hover:shadow-xl p-2 text-center" v-for="(item, index) in types" :key="index">
                <iconify-icon :icon="item.icon" class="text-6xl"></iconify-icon>
                {{ item.name }}
            </div>
        </div>
    </template>

    <template v-else>
        <div class="bg-white w-full max-w-5xl rounded">
            <div class="bg-slate-100 rounded flex flex-col justify-center items-center p-2 text-center">
                <iconify-icon :icon="currentbuild.icon" class="text-6xl"></iconify-icon>
                {{ currentbuild.name }}
            </div>
            
            <div v-if="currentbuild.id=='choice'" class="p-5">
                <Choices @cancel="currentbuild = null" />
            </div>
            <div v-if="currentbuild.id=='words'" class="p-5">
                <Words @cancel="currentbuild = null" />
            </div>

            
            
        </div>
    </template>
</div>
</template>
<script setup>

import { useOda } from "../store/oda.js"
import Intro from './intro.vue'
import Activity from "./activity.vue";
import End from './end.vue'
const oda = useOda()

const types = [
    {id:'choice', name: 'Multiple choice', icon:'solar:menu-dots-line-duotone'},
    {id:'words', name: 'Fill in the words', icon:'solar:text-field-line-duotone'},
    {id:'rearrange', name: 'Rearrange words', icon:'solar:list-arrow-up-bold-duotone'},
    {id:'column', name: 'Column matching', icon: 'solar:slider-vertical-minimalistic-line-duotone'}
]

document.body.classList.add('builder')


const currentbuild = ref(null)

</script>