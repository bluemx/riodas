<template>
<ScreenTransition></ScreenTransition>
<div class="oda-screen">
    
    <Content  v-for="(item, index) in oda.oda.end.content" :key="index" :data="item"></Content>

    <!--
        <button class="button" @click="restart()">Reiniciar</button>
    -->

</div>
</template>
<script setup>
import { useOda } from "../store/oda.js"
const router = useRouter()
const oda = useOda()
const restart = () => {
    oda.user = {}
    router.push('/'+oda.odaID)
}
</script>