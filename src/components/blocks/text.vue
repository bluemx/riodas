<template>
    <span :class="data.class || ''">
        {{ data.content }}
    </span>

</template>
<script setup>
const props = defineProps({
    data: Object
})
</script>