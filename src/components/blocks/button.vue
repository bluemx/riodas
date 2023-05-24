<template>
<button :class="['button', data.class || '']" @click="clicked">{{ data.content }}</button>
<div>

</div>
</template>
<script setup>
import { useOda } from "../../store/oda.js"
const oda = useOda()
const router = useRouter()
const route = useRoute()
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
    if(props.data.condition){
        hasCondition()
    }
    if(props.data.to){
        router.push(props.data.to)
    }
}

</script>