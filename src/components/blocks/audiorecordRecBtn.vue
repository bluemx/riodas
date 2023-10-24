<template>

<button @click="clicked" class="btn relative  p-0.5 flex-grow-0 m-2 !text-xs" :class="isrecording?'btn-primary':'btn-secondary'">
    <iconify-icon :class="isrecording?'animate-pulse !text-2xl':''" icon="solar:record-bold-duotone"></iconify-icon>
    <template v-if="!isrecording">
        <div>Click to record</div>
    </template>
    <template v-else>
        <div>Now recording</div>
    </template>
</button>
</template>
<script setup>

const props = defineProps({
    isrecording: [Object, Boolean]
})
const emit = defineEmits(['start','stop'])

const clicked = () => {
    if(!props.isrecording){
        emit('start')
    } else {
        emit('stop')
    }
}

onMounted(() => {

})
</script>