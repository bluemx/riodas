<template>
    <div ref="block" :class="[data.class || '', classColumns]" class="grid gap-4">
        <template v-for="(item, index) in cards" :key="index">
            <div @click="flip(item, index)" class="aspect-square justify-center items-center cursor-pointer">
                <template v-if="item.status=='idle'">
                    <div class="animate__animated animate__flipInY w-full h-full border-stone-800/10 border-4 bg-slate-200 rounded flex justify-center items-center relative">
                        <iconify-icon icon="solar:sticker-square-line-duotone" class="absolute text-7xl text-neutral"></iconify-icon>
                    </div>
                </template>
                <template v-else-if="item.status=='flip' || item.status=='found' ">
                    <div class="animate__animated animate__flipInY  w-full h-full bg-slate-100 border-4 rounded flex justify-center items-center relative" :class="item.status=='found'?'!border-success':' border-stone-800/10'">
                        <Content :data="item"></Content>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script setup>
import sound_flip from '../../assets/uisound/cardSlide5.mp3'
import sound_ok from '../../assets/uisound/alert_high-intensity.mp3'
import sound_no from '../../assets/uisound/switch30.mp3'


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


const one = ref(null)
const two = ref(null)

//const positives = ref(0)


const flip = (item, index) => {
    if(item.status=='found'){ return false }
    if(one.value && two.value){ return false }
    
    new Howl({ src: [sound_flip], rate: 1, volume: 0.7, autoplay:true })
    item.status = 'flip'
    
    // ONE not null and TWO is null
    if(one.value!= null && two.value == null){
        two.value = item
    }

    //ONE and TWO are null
    if(one.value== null && two.value == null){
        one.value = item
    }

    // ONE and TWO are not null
    if(one.value!= null && two.value != null) {
        setTimeout(()=>{  
            if(one.value.tag == two.value.tag){
                one.value.status = 'found'
                two.value.status = 'found'
                //positives.value += 1
                new Howl({ src: [sound_ok], rate: 1, volume: 0.7, autoplay:true })
                evaluate()
            } else {
                one.value.status = 'idle'
                two.value.status = 'idle'
                new Howl({ src: [sound_no], rate: 1, volume: 0.7, autoplay:true })
            }
            one.value = null
            two.value = null
        }, 1000)
    }
    
    

}

const evaluate = () => {
    const positives = (cards.value.filter(object => object.status === 'found').length);
    const totalpositives = props.data.content.length
    if(props.data.duplicatecards){
        blocks.result.value = (positives/2) == totalpositives
    } else {
        blocks.result.value = positives == totalpositives
    }
    blocks.evaluateFN(cards.value)
}


const createcards = () => {
    let fullcards = []
    /* Card settings */
    if(props.data.duplicatecards){
        /* Duplicate cards */
        props.data.content.forEach((element, index) => {
            fullcards.push({...element, tag:'tag_'+index, status: 'idle'})
            fullcards.push({...element, tag:'tag_'+index, status: 'idle'})
        });
    } else {
        /* Normal */

        let countertag = 0
        props.data.content.forEach((element, index) => {
            let offset = 0
            if(index%2==0){
                countertag++
            }
            fullcards.push({...element, tag:'tag_'+(countertag), status: 'idle'})
        });
    }
    cards.value = shuffle(fullcards)
    let columns = calculateColumns(fullcards.length)
    if(columns>12){
        columns = Math.round(columns/2)
    }
    classColumns.value = 'grid-cols-'+columns
}

const init = () => {
    createcards()

    const blockdata = blocks.initFN(oda, props.data, props.blockindex, cards.value)
    if(blockdata?.v){
        cards.value = blockdata.v
    }


    
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