<template>
    <iconify-icon :icon="data.icon" :class="data.class || ''"></iconify-icon>
</template>
<script setup>
const props = defineProps({
    data: Object,
    blockindex: String
})
</script>