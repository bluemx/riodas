<template>
    <span :class="data.class || ''" v-html="data.content || data.text"></span>

</template>
<script setup>
/*
import { useOda } from "../../store/oda.js"
import {useBlocks} from './blocks.js'
const blocks = useBlocks()
const oda = useOda()
*/
const block = ref()
const props = defineProps({
    data: Object, //file, text, hidetext
    blockindex: String,
})
</script>