<template>
<div class="text-white  hidden">

    <div>Cargando...</div>

</div>
</template>
<script setup>
import { useOda } from "../store/oda.js"
import{ useRoute, useRouter } from 'vue-router'
import {useMaker} from '../components/utilities/maker'

const route = useRoute()
const router = useRouter()
const oda = useOda()
const maker = useMaker()
onMounted(() => {
  maker.listener()
})
const init = async () => {
    try{
        const odaloaded = await oda.init()
        if(!odaloaded){
            router.push('/error')
        } else {

            if(oda.user == null || Object.keys(oda.user)==0){
                router.push('/intro')
            } else if(oda.user?.location) {
                router.push(oda.user.location)
            } else {
                router.push('/intro')
            }
        }
    } catch(err) {
        console.error(err)
    }
}
init()

</script>