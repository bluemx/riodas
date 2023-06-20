<template>
<button class="button" @click="endattempts()">Save my results</button>
</template>
<script setup>
import { useOda } from "../../store/oda.js"
const props = defineProps({
    data: [String, Object, Boolean]
})

const router = useRouter()
const oda = useOda()
const endattempts = () => {
    oda.restartUser()
    router.push('/'+oda.odaID)
}
</script>