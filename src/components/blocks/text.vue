<template>
    <span :class="data.class || ''" v-html="data.content || data.text"></span>

</template>
<script setup>
const props = defineProps({
    data: Object,
    blockindex: String
})
</script>