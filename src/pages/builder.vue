<template>
<div class="overflow-y-auto text-neutral text-center">
    <div class="font-bold text-white mb-2 text-2xl">ACTIVITY BUILDER</div>
    <template v-if="!currentbuild">
        <div class="text-slate-100">What type of activity would you like to build?</div>
        <div class="grid grid-cols-4 justify-center gap-2 max-w-2xl my-4 ">
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
            
            <div v-if="currentbuild.id=='choices'" class="p-5">
                <Choices @cancel="currentbuild = null" :data="hasdata" :name="currentbuild.name" />
            </div>
            <div v-if="currentbuild.id=='words'" class="p-5">
                <Words @cancel="currentbuild = null" :data="hasdata"  :name="currentbuild.name" />
            </div>
            <div v-if="currentbuild.id=='writing'" class="p-5">
                <Writing @cancel="currentbuild = null" :data="hasdata"  :name="currentbuild.name" />
            </div>
            <div v-if="currentbuild.id=='reading'" class="p-5">
                <Reading @cancel="currentbuild = null" :data="hasdata"  :name="currentbuild.name" />
            </div>
            <div v-if="currentbuild.id=='listening'" class="p-5">
                <Listening @cancel="currentbuild = null" :data="hasdata"  :name="currentbuild.name" />
            </div>
            <div v-if="currentbuild.id=='speaking'" class="p-5">
                <Speaking @cancel="currentbuild = null" :data="hasdata"  :name="currentbuild.name" />
            </div>
            <div v-if="currentbuild.id=='rearrange'" class="p-5">
                <Columnmatching @cancel="currentbuild = null" :data="hasdata"  :name="currentbuild.name" />
            </div>
            <div v-if="currentbuild.id=='columnmatching'" class="p-5">
                <Columnmatching @cancel="currentbuild = null" :data="hasdata"  :name="currentbuild.name" />
            </div>
        </div>
    </template>
</div>
</template>
<script setup>
import {useMaker} from '../components/utilities/maker'
import { useOda } from "../store/oda.js"
import Intro from './intro.vue'
import Activity from "./activity.vue";
import End from './end.vue'
const oda = useOda()
const maker = useMaker()

const types = [
    {id:'choices', name: 'Multiple choices', icon:'solar:menu-dots-line-duotone'},
    {id:'words', name: 'Fill in the words', icon:'solar:text-field-line-duotone'},
    {id:'writing', name: 'Writing', icon:'solar:document-add-line-duotone'},
    {id:'reading', name: 'Reading', icon:'solar:document-text-line-duotone'},
    {id:'listening', name: 'Listening', icon:'solar:headphones-square-sound-linear'},
    {id:'speaking', name: 'Speaking', icon:'solar:dialog-line-duotone'},
    {id:'rearrange', name: 'Rearrange words', icon:'solar:list-arrow-up-bold-duotone'},
    {id:'columnmatching', name: 'Column matching', icon: 'solar:slider-vertical-minimalistic-line-duotone'}
]

document.body.classList.add('builder')


const hasdata = ref(null)
const loadInputs = (data) => {
    hasdata.value = data
    const datatypeslist = ['choices', 'words', 'Writing', 'Reading', 'Listening', 'Speaking', 'Rearrange', 'Column']
    if(data?.config?.datatype){
        datatypeslist.forEach((item, index)=>{
            if(data?.config?.datatype.includes(item)){
                currentbuild.value = types[index]
            }
        })
    }

    /*

    if(data?.config?.datatype && data?.config?.datatype.includes('choices')){
        currentbuild.value = types[0]
    }
    */
}

const currentbuild = ref(null)

onMounted(() => {
  maker.listener()
  watch(()=>maker.builderdata, (nv)=>{
    if(nv.value.config){
        loadInputs(nv.value)
    }
  }, {deep:true})
})



</script>