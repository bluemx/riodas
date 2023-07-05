<template>

<svg class="z-50 pointer-events-none" :id="blockindex+'-line'" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
    <defs>
        <linearGradient :id="blockindex+'-line-gradient'" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :style="'stop-color:'+linecolor+';stop-opacity:0.5'" />
            <stop offset="10%" :style="'stop-color:'+linecolor+';stop-opacity:1'" />
            <stop offset="90%" :style="'stop-color:'+linecolor+';stop-opacity:1'" />
            <stop offset="100%" :style="'stop-color:'+linecolor+';stop-opacity:0.5'" />
        </linearGradient>
    </defs>
    <path ref="line" id="line" :stroke="'url(#'+blockindex+'-line-gradient)'" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>

</template>
<script setup>
import mojs from '@mojs/core'
//PROPS
const props = defineProps({
    data: Object,
    blockindex:String
})
//posTo: lrtbm
//posFrom: lrtbm
//color


const line = ref()
const linecolor = ref()

watch(()=>props, (nv)=>{
    init()
}, {deep:true})

const selectorFrom = ref()
const selectorTo = ref()
const init = () => {
    selectorFrom.value = '[name="'+props.data.from+'"]'
    selectorTo.value = '[name="'+props.data.to+'"]'
    linecolor.value = props.data.color
    updateLine();
}

function updateLine() {
    var elementFrom = document.querySelector(selectorFrom.value);
    var elementTo = document.querySelector(selectorTo.value);

    if (!elementFrom || !elementTo) {
        return;
    }

    var rectFrom = elementFrom.getBoundingClientRect();
    var rectTo = elementTo.getBoundingClientRect();

    var midpointY = (rectTo.top + rectFrom.top) / 2;

    
    let posFrom = `${rectTo.left + rectTo.width / 2} ${rectTo.top + rectTo.height / 2}`
    let posTo = `${rectFrom.left + rectFrom.width / 2} ${rectFrom.top + rectFrom.height / 2}`

    if(props.data.posFrom == 'b'){ posFrom = `${rectTo.left + rectTo.width / 2} ${rectTo.top + rectTo.height}` }
    if(props.data.posTo == 'b'){ posTo = `${rectFrom.left + rectFrom.width / 2} ${rectFrom.top + rectFrom.height}`}
    if(props.data.posFrom == 't'){ posFrom = `${rectTo.left + rectTo.width / 2} ${rectTo.top}` }
    if(props.data.posTo == 't'){ posTo = `${rectFrom.left + rectFrom.width / 2} ${rectFrom.top}`}
    if(props.data.posFrom == 'l'){ posFrom = `${rectTo.left} ${rectTo.top + rectTo.height / 2}` }
    if(props.data.posTo == 'l'){ posTo = `${rectFrom.left} ${rectFrom.top + rectFrom.height / 2}`}
    if(props.data.posFrom == 'r'){ posFrom = `${rectTo.left + rectTo.width} ${rectTo.top + rectTo.height / 2}` }
    if(props.data.posTo == 'r'){ posTo = `${rectFrom.left + rectFrom.width} ${rectFrom.top + rectFrom.height / 2}`}

    var pathData = `M  ${posFrom} 
                    Q ${rectTo.left + rectTo.width / 2} ${midpointY}, ${posTo}`;

    line.value.setAttribute('d', pathData);

    requestAnimationFrame(updateLine);
}



onMounted(() => {
    init();

})
</script>
