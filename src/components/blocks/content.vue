<template>

<Worddrop v-if="data.block=='worddrop'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Worddrop>
<Wordoptions v-if="data.block=='wordoptions'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Wordoptions>


<!--<template v-if="!data.hidden">-->

<Text v-if="data.block=='text'" :data="data" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Text>
<Icon v-if="data.block=='icon'" :data="data" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Icon>

<Group v-else-if="data.block=='group'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Group>
<Option v-else-if="data.block=='option'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Option>
<Repeater v-else-if="data.block=='repeater'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Repeater>
<Button v-else-if="data.block=='button'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Button>
<Diagnostico v-else-if="data.block=='diagnostico'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Diagnostico>
<Finished v-else-if="data.block=='finished'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Finished>
<Slides v-else-if="data.block=='slides'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Slides>
<Audio v-else-if="data.block=='audio'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Audio>
<Image v-else-if="data.block=='image'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Image>
<Video v-else-if="data.block=='video'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Video>
<Audiorecord v-else-if="data.block=='audiorecord'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Audiorecord>
<Record v-else-if="data.block=='record'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Record>
<Draggable v-else-if="data.block=='draggable'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Draggable>
<Dragdrop v-else-if="data.block=='dragdrop'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Dragdrop>
<Line v-else-if="data.block=='line'" :data="data" :blockindex="blockindex" :name="data.name" :id="data.id || ''"></Line>
<Dragitem v-else-if="data.block=='dragitem'" :data="data" :blockindex="blockindex" :name="data.name" :id="data.id || ''"></Dragitem>
<Dragzone v-else-if="data.block=='dragzone'" :data="data" :blockindex="blockindex" :name="data.name" :id="data.id || ''"></Dragzone>
<Memory v-else-if="data.block=='memory'" :data="data" :blockindex="blockindex" :name="data.name" :id="data.id || ''"></Memory>
<Crossword v-else-if="data.block=='crossword'" :data="data" :blockindex="blockindex" :name="data.name" :id="data.id || ''"></Crossword>
<Downloadfile v-else-if="data.block=='downloadfile'" :data="data" :blockindex="blockindex" :name="data.name" :id="data.id || ''"></Downloadfile>
<Embedyt v-else-if="data.block=='embedyt'" :data="data" :blockindex="blockindex" :name="data.name" :id="data.id || ''"></Embedyt>

<Textarea v-else-if="data.block=='textarea'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Textarea>
<Switch v-else-if="data.block=='switch'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Switch>
<Changer v-else-if="data.block=='changer'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Changer>
<Condition v-else-if="data.block=='condition'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)"></Condition>
<Show v-else-if="data.block=='show'" :data="data" :blockindex="blockindex"></Show>
<Imageupload v-else-if="data.block=='imageupload'" :data="data" :blockindex="blockindex"  :data-eval="evaltype(data)" :name="data.name" :id="data.id || ''"></Imageupload>
<Debugger v-else-if="data.block=='debugger'" :name="data.name" :id="data.id || ''"></Debugger>



<!-- Diagnostico only-->
<Choose v-else-if="data.block=='choose'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex" :id="data.id || ''"></Choose>
<!-- Symbol -->
<Symbol v-if="data.symbol" :data="data" :blockindex="blockindex" ></Symbol>

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