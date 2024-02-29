<template>
<div>
    <div v-if="!loading">
        <Content v-for="(item, index) in contentBlocks" :data="item"  :key="index" :blockindex="blockindex+'-'+index"></Content>
        <div class="text-center my-2">
            <button @click="gotoNext" class="button !text-white">Continuar</button>
        </div>
    </div>
    <div v-else> Loading questions ... </div>
    <div class="text-center p-10"></div>
</div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useOda } from "../../store/oda.js"

const oda = useOda()
const route = useRoute()
const router = useRouter()
const props = defineProps({
    data: Object, //file, level, startQ, totalQ, minoks, //last
    blockindex: String,
})
const scenenum = route.params.scene || 0
const scenePositives = computed(()=>{
    return oda.getSceneInputs(scenenum).positive
})
const nextScene = '/activity/'+(parseInt(scenenum)+1)

const content = ref()
const contentBlocks = ref([])
const loading = ref(true)

const gotoNext = () => {
    
    if(scenePositives.value < props.data.minoks || props.data.last){
        const routecall = {name:'end', params: { gotlevel: props.data.level }}
        router.push(routecall)
        // FINALIZE
    } else {
        // NEXT SCENE
        router.push(nextScene)
    }
}


const buildData = () => {
    content.value.slice(props.data.startQ-1, (props.data.startQ-1)+props.data.totalQ).map((item, i) => {
        contentBlocks.value.push(
            { 
                ...item,
                block: "choose",
                class:props.data.class,
                id: props.data.startQ + i
            }
        );
    });
    loading.value = false
}
const loadFile = async () => {
    const response = await fetch(oda.baseurl+'/ODAS/'+oda.odaID+'/'+props.data.file)
    const file = await response.json()
    content.value = file
    buildData()
}

onMounted(() => {
    oda.leveltemp = props.data.level
    oda.leveldescriptiontemp = props.data.leveldescription
  loadFile()  
})

watch(()=>oda.getSceneInputs(scenenum), (res)=>{
    if(res.positive>=10){
        oda.nextscene = nextScene
    } else {
        oda.nextscene = null
    }
})

</script>
