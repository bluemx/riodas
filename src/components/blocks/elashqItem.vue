<template>
<div>
    <div ref="block" data="elashqitem" class="p-5 my-10 mx-4 rounded-lg shadow-xl border-4   relative transition ease-out duration-200" :class="input!==null?'border-secondary bg-secondary text-white':'border-warning/20 bg-slate-50'">
        <div data="eqi-counter" class="rounded-full shadow-lg flex justify-center items-center aspect-square w-10 absolute -left-5 -top-5  transition-all" :class="input!==null?'bg-neutral':'bg-warning'">
            <div class="font-bold text-white">{{ counter }}</div>
        </div>

        <template v-if="!hidetext">
            <!--information-->
            <div v-if="information" class="w-5/6 mx-auto">
                <div data="eqi-information" class="block whitespace-pre-wrap rounded-xl border-dashed border-4 border-info p-4 text-neutral leading-10 " v-html="information"></div>
                <div class="w-6 mx-auto mt-3 text-center">
                    <svg  viewBox="0 0 88 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88 0L44 44L0 0H88Z" fill="#A6EDE2"/></svg>
                </div>
            </div>
            
            <!-- question -->
            <div data="eqi-question" class="text-2xl py-10 text-center" v-if="question!=='-'" v-html="findSubs(question)"></div>

            <!-- options -->
            <div data="eqi-options" class="border-4 bg-slate-300/40 border-slate-300 p-2 rounded-lg flex flex-wrap flex-col gap-5  justify-center  [&>*]:p-2 [&>*]:rounded">
                <template v-for="(item, index) in options" :key="index">
                    <div class="flex gap-1 items-center bg-white text-base-100">
                        <div class="font-bold opacity-75 text-sm w-6 aspect-square bg-slate-100 flex justify-center items-center rounded">{{indexToABC(index)}})</div>
                        <div v-html="item"></div>
                    </div>
                </template>
            </div>
            <div>
                <div class="w-6 mx-auto">
                    <svg viewBox="0 0 88 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88 0L44 44L0 0H88Z" fill="#CBD5E1"/></svg>
                </div>
            </div>
        </template>
        <!-- 🔔🔔🔔🔔 WITH AUDIO -->
        <template v-if="audiofile!==null">
            <div v-if="audioblock">
                <div class=" border-4 <bg>-slate-100/80 border-slate-300 p-2 rounded-lg">
                    <Content :data="audioblock" :blockindex="blockindex+'-'+counter+'-audio'"></Content>
                </div>
                <div>
                <div class="w-6 mx-auto">
                    <svg viewBox="0 0 88 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88 0L44 44L0 0H88Z" fill="#CBD5E1"/></svg>
                </div>
            </div>

            </div>
        </template>
        <!-- answers-->
        <div data="eqi-answers"  class="flex flex-wrap justify-center items-center gap-5 mt-5">
            <template v-for="(item, index) in options" :key="index">
                <div :class="['w-16 rounded-full aspect-square flex justify-center items-center cursor-pointer  hover:shadow-sm hover:translate-y-0 transition-all border-2 box-content', input===index?'bg-neutral scale-125 ease-out':' border-white -translate-y-0.5 shadow-xl']" @click="onChange($event , index)">
                    <div class="font-bold text-2xl">{{ indexToABC(index) }}</div>
                </div>
            </template>
        </div>


    </div>
    <template v-if="counter%10===0">
        <Divider :class="['max-w-md mx-auto !my-10']"></Divider>
    </template>
</div>
</template>

<script setup>
import { useOda } from '../../store/oda';
import ShapesAnimation from '../all/ShapesAnimation';
import Divider from '../utilities/divider.vue';
import { useBlocks } from './blocks';
import Content from './content.vue';

const props = defineProps({
    blockindex: String,
    information: String,
    counter: Number,
    question: String,
    options: Array,
    answer: String,
    audiofile: String,
    hidetext: Boolean
})

const data = ref({
    attempts: 3,
    showResult: false
})

const oda = useOda()
const block = ref()
const blocks = useBlocks()

const input  = ref(null)

const audioblock = ref(null)

const indexToABC = (index) =>{
    const abc = 
        index==0?'A':'' +
        index==1?'B':'' +
        index==2?'C':'' +
        index==3?'D':'' +
        index==4?'E':'' +
        index==5?'F':'' 
    return abc
}

const findSubs = (text) => {
  // This regex will match any single uppercase letter followed by {some text}
  const regex = /([A-Z])\{([^}]+)\}/g;

  // Replace the matched groups with the corresponding <span> elements
  return text.replace(regex, (match, p1, p2) => {
    return `<span data-sub="${p1}">${p2}</span>`;
  });
}

const onChange = ($event, index) => {
    if(blocks.freeze.value){
        return false
    }

    input.value = index
    ShapesAnimation.playcircle($event.target)

    // RIGHT OR WRONG 
    blocks.result.value = indexToABC(input.value).toLowerCase() == props.answer.toLowerCase()
    blocks.evaluateFN(input.value)
}


const init = () => {
    audioblock.value = 
    {
        "block": "audio",
        "class": "",
        "file": props.audiofile+"a"+props.counter+".mp3",
        "autoplay": false
    }
}

onMounted(() => {
    init()
    const blockdata = blocks.initFN(oda, data.value, props.blockindex, block.value)
    if(blockdata && blockdata?.v!=null){
        input.value = blockdata.v
    } 
})
watch(()=>props, ()=>{ init() }, {deep:true})


</script>


<style>
/* Style for the <span> elements with a data-sub attribute */
span[data-sub] {
opacity:0.8;
  text-decoration: underline;
  position: relative;
  display: inline-block;
}

span[data-sub]::after {
  content: attr(data-sub);
  position: absolute;
  left: 50%;
  bottom: -60%;
  transform: translateX(-50%);
  font-size: 10px;
  text-align: center;
}
</style>