<template>
<div class="oda-screen">
    <ScreenTransition></ScreenTransition>
    <div>Cargando...</div>

</div>
</template>
<script setup>
import { useOda } from "../store/oda.js"
import{ useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const oda = useOda()
const init = async () => {
    try{
        const odaloaded = await oda.init()

        if(!odaloaded){
            router.push('/error')
        } else {
            if(oda.user == null || Object.keys(oda.user)==0){
                router.push('/start')
            } else if(oda.user.location) {
                    router.push(oda.user.location)
            } else {
                router.push('/start')
            }
        }
    } catch(err) {
        console.error(err)
    }
}
init()

</script>