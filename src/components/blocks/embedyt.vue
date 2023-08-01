<template>

    <div :class="['mockup-window border bg-slate-100 px-2 pb-2', data.class || '']">
        <iframe v-if="videoId"
        width="560" height="315"
        :src=" 'https://www.youtube.com/embed/' + videoId"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

        ID: https://www.youtube.com/embed/{{videoId}}
    </div>
</template>

<script setup>

const props = defineProps({
    data: Object
})

watch (()=>props.data, ()=>{init()}, {deep:true})

const videoId = ref()

const init = () => {
  
    videoId.value = getId(props.data.url);
}

function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? match[2]
      : null;
}
  

</script>