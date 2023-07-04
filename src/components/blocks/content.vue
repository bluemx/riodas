<template>
<!--<template v-if="!data.hidden">-->
<Text v-if="data.block=='text'" :data="data" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Text>
<Icon v-if="data.block=='icon'" :data="data" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Icon>
<Group v-else-if="data.block=='group'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Group>
<Option v-else-if="data.block=='option'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Option>
<Repeater v-else-if="data.block=='repeater'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Repeater>
<Button v-else-if="data.block=='button'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Button>
<Diagnostico v-else-if="data.block=='diagnostico'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Diagnostico>
<Finished v-else-if="data.block=='finished'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Finished>
<Slides v-else-if="data.block=='slides'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Slides>
<Audio v-else-if="data.block=='audio'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Audio>
<Image v-else-if="data.block=='image'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Image>
<Video v-else-if="data.block=='video'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Video>
<Audiorecord v-else-if="data.block=='audiorecord'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Audiorecord>
<Record v-else-if="data.block=='record'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Record>
<Draggable v-else-if="data.block=='draggable'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Draggable>
<Dragdrop v-else-if="data.block=='dragdrop'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Dragdrop>
<Line v-else-if="data.block=='line'" :data="data" :name="data.name"></Line>

<Textarea v-else-if="data.block=='textarea'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Textarea>
<Switch v-else-if="data.block=='switch'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Switch>
<Condition v-else-if="data.block=='condition'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Condition>
<Show v-else-if="data.block=='show'" :data="data" :blockindex="blockindex"></Show>
<Imageupload v-else-if="data.block=='imageupload'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name"></Imageupload>
<Debugger v-else-if="data.block=='debugger'" :name="data.name"></Debugger>


<!-- Diagnostico only-->
<Choose v-else-if="data.block=='choose'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"></Choose>
<!-- Symbol -->
<Symbol v-if="data.symbol" :data="data" :blockindex="blockindex"></Symbol>

<!--</template>-->

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