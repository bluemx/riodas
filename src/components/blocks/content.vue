<template>
<template v-if="!data.hidden">
<Text v-if="data.block=='text'" :data="data" :data-blockindex="blockindex"  :data-eval="evaltype(data)"></Text>
<Group v-else-if="data.block=='group'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"  :data-eval="evaltype(data)"></Group>
<Option v-else-if="data.block=='option'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"  :data-eval="evaltype(data)"></Option>
<Repeater v-else-if="data.block=='repeater'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Repeater>
<Button v-else-if="data.block=='button'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Button>
<Diagnostico v-else-if="data.block=='diagnostico'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Diagnostico>
<Finished v-else-if="data.block=='finished'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Finished>
<Slides v-else-if="data.block=='slides'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Slides>
<Audio v-else-if="data.block=='audio'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Audio>
<Image v-else-if="data.block=='image'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Image>
<Video v-else-if="data.block=='video'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Video>
<Audiorecord v-else-if="data.block=='audiorecord'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Audiorecord>
<Draggable v-else-if="data.block=='draggable'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Draggable>
<Textarea v-else-if="data.block=='textarea'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Textarea>
<Switch v-else-if="data.block=='switch'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Switch>
<Condition v-else-if="data.block=='condition'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Condition>

<!-- Diagnostico only-->
<Choose v-else-if="data.block=='choose'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"></Choose>
<!-- Symbol -->
<Symbol v-if="data.symbol" :data="data" :blockindex="blockindex"></Symbol>

</template>

<div v-if="evaltype(data)=='manual'">
    <Teachereval :data="data" :blockindex="blockindex"></Teachereval>
</div>


</template>
<script setup>
import { useOda } from '../../store/oda';
import Teachereval from './teachereval.vue';

const props = defineProps({
    data: Object,
    blockindex: String
})

const oda = useOda()
const evaltype = (data) => {
    let res = ''
    if(data?.evaluation == 'manual'){
        if(oda.teacher){
            res = "manual"
        }
    }
   return res
}

</script>