<template>
<div :class="data.class || ''" >
    <template v-for="(item, index) in data.content" :key="index">
        <div v-show="index==slide">
            <Content :data="item" :blockindex="blockindex+'-'+index"></Content>
        </div>
    </template>
    <div class="flex justify-between items-center mt-5">
        <div>
            <button class="btn btn-xs btn-accent" v-if="slide>0 && btnPrev" @click="slide--">{{ btnPrev }}</button>
        </div>
        <div>
            <button class="btn btn-xs btn-accent" v-if="slide<data.content.length-1 && btnNext"  @click="slide++">{{ btnNext }}</button>
        </div>
    </div>
</div>
</template>

<script setup>
const props = defineProps({
    data: Object,
    blockindex: String
})
const slide = ref(0)

const btnNext = props.data.buttons?.next || props.data.next
const btnPrev = props.data.buttons?.prev || props.data.prev

</script>