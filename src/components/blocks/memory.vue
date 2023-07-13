<template>
    <div ref="block" :class="[data.class || '', classColumns]" class="grid gap-4">
    
        <template v-for="(item, index) in cards" :key="index">
            <div class="aspect-square border-slate-300 bg-slate-200 rounded flex justify-center items-center cursor-pointer" @click="click(item, index)">

                    <div v-if="!turned.includes(index)"><iconify-icon icon="solar:sticker-square-line-duotone" class="text-7xl text-neutral"></iconify-icon></div>

                <Transition>
                    <div v-if="turned.includes(index)"><Content :data="item"></Content></div>
                </Transition>
            </div>
        </template>

    </div>
</template>
<script setup>
import {useBlocks} from './blocks.js'
import { useOda } from "../../store/oda.js"
const props = defineProps({
    data: Object,
    blockindex: String
})

const oda = useOda()
const blocks = useBlocks()
const block = ref()

const cards = ref()
const classColumns = ref('')

const turned = ref([])

const click = (item, index) => {
    turned.value.push(index)
}
const createcards = () => {
    let fullcards = []
    props.data.content.forEach((element, index) => {
        fullcards.push({...element, tag:'tag_'+index})
        fullcards.push({...element, tag:'tag_'+index})
    });
    cards.value = shuffle(fullcards)

    classColumns.value = 'grid-cols-'+calculateColumns(fullcards.length)
}

const init = () => {
    createcards()
}


watch(()=>props.data,()=>{
    init()
})
onMounted(() => {
  init()  
})

/* UTILITIES */
const calculateColumns = (itemCount) => {
  const sqrt = Math.sqrt(itemCount);
  return Math.ceil(sqrt) === Math.floor(sqrt) ? Math.round(sqrt) : itemCount % 2 === 0 ? itemCount / 2 : 1;
}
const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
}
</script>