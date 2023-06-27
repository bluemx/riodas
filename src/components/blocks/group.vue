<template>
<div ref="block" :class="[data.class||'']" :data-blockindex="blockindex">
    <Content :data="item" v-for="(item, index) in data.content" :key="index" :blockindex="blockindex+'-'+index"></Content>
</div>
</template>
<script setup>
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
    if(bg){
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

                //cssbackground.value = "background-image:url(" + image.src + ")";
                //console.log(block.value, 'external', image)
                //block.value.append(image)
                setTimeout(()=>{
                    //image.style.backgroundImage = "url(" + image.src + ")";
                }, 100)
            };
            image.src = bg;
        } else {
            //Local
            stylerule = 'background-image:url(/ODAS/'+oda.odaID+'/'+bg+');'
        }
    }
}
onMounted(() => {
    cssbackgroundFN()
})





</script>