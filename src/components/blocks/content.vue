<template>

<Text v-if="data.block=='text'" :data="data" :data-blockindex="blockindex"></Text>
<Group v-else-if="data.block=='group'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"></Group>
<Choose v-else-if="data.block=='choose'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"></Choose>
<Repeater v-else-if="data.block=='repeater'" :data="data" :blockindex="blockindex"></Repeater>
<Button v-else-if="data.block=='button'" :data="data" :blockindex="blockindex"></Button>
<Diagnostico v-else-if="data.block=='diagnostico'" :data="data" :blockindex="blockindex"></Diagnostico>

</template>
<script setup>
const props = defineProps({
    data: Object,
    blockindex: String
})
</script>