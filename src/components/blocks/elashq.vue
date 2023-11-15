<template>
<div>
    <div v-for="(item, index) in items" :key="index">
        <ElashqItem :hidetext="data.hidetext" :blockindex="blockindex+'-'+'elashqitem'" :audiofile="audiofileclean" :information="item.information" :question="item.question" :options="item.options" :answer="item.answer" :counter="index+data.counter" />
    </div>
</div>
</template>
<script setup>
import { useOda } from '../../store/oda';
import deepdash from 'deepdash-es';
import ElashqItem from './elashqItem.vue';
deepdash(_)



const props = defineProps({
    blockindex: String,
    data: Object,
    blockindex: String,
    name: String
})

const oda = useOda()

const items = ref([])
const audiofileclean = ref(null)


watch(()=>props.data, ()=>{ init() }, {deep:true})





function textToJSON(text) {
  // Split the input into groups
  const groups = text.trim().split(/\n\s*\n/);
  const items = [];

  // Process each group
  groups.forEach(group => {
    const lines = group.split('\n');
    const item = {};

    if (lines[0].startsWith('*')) {
      item.information = lines[0].slice(1).trim().replace(/\\n/g, '<br>'); // remove the * and trim
      item.question = lines[1];
      item.options = lines.slice(2, -1); // get all lines except first, second and last
    } else {
      item.question = lines[0];
      item.options = lines.slice(1, -1); // get all lines except first and last
    }

    item.answer = lines[lines.length - 1]; // get the last line
    items.push(item);
  });

  return items;
}






const init = () => {
    items.value = textToJSON(props.data.textual)

    if(props.data.audiofiles.trim()) {
        audiofileclean.value =  removeFileNameFromURL(props.data.audiofiles)
    }
}


function removeFileNameFromURL(urlString) {
    console.log(urlString)
    if(typeof urlString === 'string'){
        const parts = urlString.split('/');
        const filename = parts.pop();
        const urlWithoutFilename = parts.join('/');
        return urlWithoutFilename.endsWith('/') ? urlWithoutFilename : urlWithoutFilename + '/';
    } else {
        return '/'
    }
}





onMounted(() => {
    init()
})

</script>