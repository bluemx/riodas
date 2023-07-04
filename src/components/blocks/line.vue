<template>

<svg class="z-50 pointer-events-none" id="connector-line" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
    <defs>
        <linearGradient id="fade-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :style="'stop-color:rgb(225, 29, 72);stop-opacity:0'" />
            <stop offset="25%" :style="'stop-color:rgb(225, 29, 72);stop-opacity:1'" />
            <stop offset="75%" :style="'stop-color:rgb(225, 29, 72);stop-opacity:1'" />
            <stop offset="100%" :style="'stop-color:rgb(225, 29, 72);stop-opacity:0'" />
        </linearGradient>
    </defs>
    <path ref="line" id="line" stroke="url(#fade-gradient)" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>


</template>
<script setup>
import mojs from '@mojs/core'
//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})

const line = ref()
const selector1 = '[name="'+props.data.from+'"]'
const selector2 = '[name="'+props.data.to+'"]'

function updateLine() {
    var element1 = document.querySelector(selector1);
    var element2 = document.querySelector(selector2);

    if (!element1 || !element2) {
        return;
    }

    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    var midpointY = (rect1.top + rect2.top) / 2;

    var pathData = `M ${rect1.left + rect1.width / 2} ${rect1.top + rect1.height / 2} 
                    Q ${rect1.left + rect1.width / 2} ${midpointY}, ${rect2.left + rect2.width / 2} ${rect2.top + rect2.height / 2}`;

    line.value.setAttribute('d', pathData);

    requestAnimationFrame(updateLine);
}









onMounted(() => {
    updateLine();

})
</script>
