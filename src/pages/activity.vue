<template>

    

    
        <div class="flex flex-col h-full w-full ">

        <ScreenTransition></ScreenTransition>
        <ActivityBar></ActivityBar>
        <div class="oda-screen ">
            <div data-scroll="activity" ref="activity" class="relative min-h-fit m-auto overflow-auto max-h-full py-2 w-full max-w-6xl mx-auto">
                <div class="py-20 max-w-[82%] mx-auto">
                    <Content v-for="(item, index) in oda.oda.activity.scenes[scenenum].content" :key="index" :data="item" :blockindex="scenenum+'-'+index"></Content>
                    <Teacherbar v-if="oda.teacher !=null && oda.teacher!={} && oda.teacherFreeze==null"></Teacherbar>
                </div>
                
            </div>
        </div>

    </div>

</template>

<script setup>
import { useOda } from "../store/oda.js"
import Teacherbar from "../components/all/teacherbar.vue";

const oda = useOda()
const router = useRouter()
const route = useRoute()
const scenenum = route.params.scene || 0

const activity = ref(null);


</script>