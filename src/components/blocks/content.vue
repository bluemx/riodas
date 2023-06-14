<template>

<Text v-if="data.block=='text'" :data="data" :data-blockindex="blockindex"></Text>
<Group v-else-if="data.block=='group'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"></Group>

<Option v-else-if="data.block=='option'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"></Option>
<Repeater v-else-if="data.block=='repeater'" :data="data" :blockindex="blockindex"></Repeater>
<Button v-else-if="data.block=='button'" :data="data" :blockindex="blockindex"></Button>
<Diagnostico v-else-if="data.block=='diagnostico'" :data="data" :blockindex="blockindex"></Diagnostico>
<Finished v-else-if="data.block=='finished'" :data="data" :blockindex="blockindex"></Finished>
<Slides v-else-if="data.block=='slides'" :data="data" :blockindex="blockindex"></Slides>
<Audio v-else-if="data.block=='audio'" :data="data" :blockindex="blockindex"></Audio>
<Image v-else-if="data.block=='image'" :data="data" :blockindex="blockindex"></Image>
<Video v-else-if="data.block=='video'" :data="data" :blockindex="blockindex"></Video>
<Audiorecord v-else-if="data.block=='audiorecord'" :data="data" :blockindex="blockindex"></Audiorecord>
<Draggable v-else-if="data.block=='draggable'" :data="data" :blockindex="blockindex"></Draggable>
<Textarea v-else-if="data.block=='textarea'" :data="data" :blockindex="blockindex"></Textarea>
<Switch v-else-if="data.block=='switch'" :data="data" :blockindex="blockindex"></Switch>
<Condition v-else-if="data.block=='condition'" :data="data" :blockindex="blockindex"></Condition>

<!-- Diagnostico only-->
<Choose v-else-if="data.block=='choose'" :data="data" :blockindex="blockindex" :data-blockindex="blockindex"></Choose>
<!-- Symbol -->
<Symbol v-if="data.symbol" :data="data" :blockindex="blockindex"></Symbol>


</template>
<script setup>
const props = defineProps({
    data: Object,
    blockindex: String
})
</script>