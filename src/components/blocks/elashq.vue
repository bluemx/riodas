<template>
</template>
<script setup>
import { useOda } from "../../store/oda.js"
import {useBlocks} from './blocks.js'
const blocks = useBlocks()
const oda = useOda()
const block = ref()
</script>