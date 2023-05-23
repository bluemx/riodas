<template>
    <ScreenTransition></ScreenTransition>
    <div class="flex flex-col h-full w-full">
        <ActivityBar></ActivityBar>
        <div class="oda-screen overflow-auto">
            <div class="min-h-min m-auto overflow-auto max-h-full py-2 w-full">
                <Content v-for="(item, index) in oda.oda.activity.scenes[scenenum].content" :key="index" :data="item" :blockindex="scenenum+'-'+index"></Content>
                <!--
                    <div>{{ oda.getSceneInputs(scenenum) }}</div>
                -->
                <autosolve></autosolve>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useOda } from "../store/oda.js"
const oda = useOda()
const router = useRouter()
const route = useRoute()
const scenenum = route.params.scene || 0
</script>