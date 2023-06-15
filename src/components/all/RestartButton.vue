<template>
<button class="button" @click="restart()">{{data || 'Restart'}}</button>
</template>
<script setup>
import { useOda } from "../../store/oda.js"
const props = defineProps({
    data: [Object, Boolean]
})

const router = useRouter()
const oda = useOda()
const restart = () => {
    oda.restartUser()
    router.push('/'+oda.odaID)
}
</script>