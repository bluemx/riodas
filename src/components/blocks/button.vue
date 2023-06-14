<template>


<template v-if="!replaced">
    <button :class="['button', data.class || '']" @click="clicked">{{ data.content }}</button>
</template>
<template v-if="replaced">
    <Content v-for="(item, index) in data.replace" :key="index" :data="item" :blockindex="blockindex"></Content>
</template>

<Content v-if="append.length" v-for="(item, index) in append" :key="index" :data="item" :blockindex="blockindex"></Content>

</template>
<script setup>
import sound1 from '../../assets/uisound/click_004.mp3'
import { useOda } from "../../store/oda.js"
const oda = useOda()
const router = useRouter()
const route = useRoute()

const replaced = ref(false)
const append = ref(false)
//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})

const scene = props.blockindex.split('-')[0]

const hasCondition = () => {
    Object.keys(props.data.condition).forEach((key)=>{
        Object.keys(props.data.condition[key]).forEach((cond)=>{

            if( eval(oda.getSceneInputs(scene)[key]+cond) ){
                router.push(props.data.condition[key][cond])
                //console.log('Cumplido:', props.data.condition[key][cond])
            }
        })
    })
}

const clicked = () => {
    new Howl({ src: [sound1], volume: 0.7, autoplay:true })
    if(props.data.condition){
        hasCondition()
    }
    if(props.data.to){
        router.push(props.data.to)
    }
    if(props.data.replace){
        replaced.value = true
    }
    if(props.data.append){
        append.value = false
        setTimeout(()=>{
            append.value = props.data.append
        },100)
        if(props.data.appendRemoveTime){
            setTimeout(()=>{
                append.value = false
            }, props.data.appendRemoveTime)
        }
    }
}


/*
REPLACE PROPERTY
"replace": [
    {
        "block": "audio",
        "class": "invisible",
        "file": "tryagain.mp3",
        "autoplay": true
    }
]
"append":[

]
*/

</script>