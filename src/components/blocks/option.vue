<template>
    <div :class="data.class || ''">
        <div class="w-full text-center">

            <div v-if="!data?.dropdown" ref="block"
                :class="['relative flex justify-center items-center gap-2 flex-wrap rounded', blocks.resultClass.value]">
                <template v-for="(item, index) in options" :key="'op'+index">
                    <button :class="['btn', item.index == input ? 'btn-accent ' : 'btn-neutral']" @click="onChange(item.index)">
                        <Content :data="item"></Content>
                    </button>
                </template>
            </div>
            
            <details v-else ref="block" :class="['dropdown', dropdownpos()] ">
                <summary tabindex="0" :class="input===null? 'btn':'btn btn-accent'  ">
                    <template v-if="input == null">
                        Select
                    </template>
                    <template v-else>
                        <Content v-if="initOptions[input]" :data="initOptions[input]"></Content>
                    </template>                    
                </summary>
                <ul tabindex="0" class="dropdown-content z-[1] menu   shadow bg-base-content rounded">
                    <template v-for="(item, index) in options" :key="'opm'+index">
                        <li class="hover:bg-neutral rounded " @click="onChange(item.index)"><Content :data="item" ></Content></li>
                        <hr class="my-0.5">
                    </template>
                </ul>
            </details>

        </div>
    </div>
</template>
<script setup>


import { useOda } from "../../store/oda.js"
import { useBlocks } from './blocks.js'
const blocks = useBlocks()
const oda = useOda()
const block = ref()

const initOptions = ref([])
const options = ref([]);

//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})
//INPUT
const input = ref(null)

const dropdownpos = () => {
    let pos = 'dropdown-top'
    if(props.data?.dropdownpos){
        if(props.data?.dropdownpos == 'bottom'){ pos = 'dropdown-bottom' }
        if(props.data?.dropdownpos == 'left'){ pos = 'dropdown-left' }
        if(props.data?.dropdownpos == 'right'){ pos = 'dropdown-right' }
        if(props.data?.dropdownpos == 'top'){ pos = 'dropdown-top' }
    }
    return pos
}


const init = () => {
    //OPTIONS sort
    
    initOptions.value = []
    options.value = []
    if (props.data.options) {

        props.data.options.forEach((element, index) => {
            initOptions.value.push({ ...element, index: index })
        });
        options.value = [...initOptions.value].sort(() => Math.random() - 0.5)
    }
}






//ACTION
const onChange = (itemindex) => {
    if (blocks.freeze.value) {
        return false
    }

    if(props.data?.dropdown){
        block.value.removeAttribute('open')
    }

    blocks.attemptsFN()
    evaluate(itemindex)
}


const evaluate = (itemindex) => {
    input.value = itemindex
    blocks.result.value = input.value == 0
    blocks.evaluateFN(input.value)
}


onMounted(() => {

    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    if (blockdata && blockdata?.v != null) {
        input.value = blockdata.v
    }
    init()
})

watch(()=>props.data, ()=>{ init() }, {deep: true})
// INIT


/*
//AUTORESOLVE
const currentInstance = getCurrentInstance()
currentInstance.appContext.config.globalProperties.emitter.on('autosolve', e => {
    console.log('autosolve')
    //onChange(initOptions.value[0])
} )
*/





</script>