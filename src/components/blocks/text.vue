<template>
    <template v-if="!data.tag">
        <span :class="data.class || ''">
            {{ data.content || data.text }}
        </span>
    </template>
    <template v-else-if="data.tag=='div'">
        <div :class="data.class || ''">
            {{ data.content || data.text }}
        </div>

    </template>

</template>
<script setup>
const props = defineProps({
    data: Object,
    blockindex: String
})
</script>