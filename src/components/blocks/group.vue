<template>
<div ref="block" :class="[data.class||'']" :data-blockindex="blockindex">
    <Content :data="item" v-for="(item, index) in data.content" :key="index" :blockindex="blockindex+'-'+index"></Content>
</div>
</template>
<script setup>
import { useOda } from '../../store/oda';

const oda = useOda()
const props = defineProps({
    data: Object,
    blockindex: String
})

const block = ref()

const cssbackground = ref('')
watch(()=>props, ()=>{
    cssbackgroundFN()
}, {deep:true})

const cssbackgroundFN = () => {
    const bg = props?.data?.background
    let stylerule = ''
    if(bg ){
        if(bg.includes('http')){
            //External?
            var image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = function() {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);
                var base64 = canvas.toDataURL("image/webp");
                block.value.style.backgroundImage = "url(" + base64 + ")";
            };
            image.src = bg;
        } else {
            //Local
            
            const localimage = '/ODAS/'+oda.odaID+'/'+bg
            block.value.style.backgroundImage = "url(" + localimage + ")";
        }
    }

}
onMounted(() => {
    cssbackgroundFN()
})





</script>