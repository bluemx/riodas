<template>
<div :class="data.class||''" :data-blockindex="blockindex">
    <Content :data="item" v-for="(item, index) in data.content" :key="index" :blockindex="blockindex+'-'+index"></Content>
</div>

</template>
<script setup>
const props = defineProps({
    data: Object,
    blockindex: String
})
</script>