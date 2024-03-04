<template>
    <div v-show="!previewing">
        <builder-configs :data="initialConfiguration" @updated="configReady"></builder-configs>

       
        <Transition>
            <div  v-if="configurationData">
                <label class="block w-fit py-1 px-5 rounded-t bg-slate-200 mx-auto">Write a sentence</label>
                
                <div class="border-4 border-slate-200 shadow-xl rounded p-4" v-for="(sItem, sIndex) in sentences" :key="sIndex">
                    <input v-model="sItem.text" class="block border-2 border-info bg-white rounded w-full min-h-[32px] resize-none font-bold" placeholder="Write a sentence." />
                    <div class="flex mt-1 flex-wrap gap-1 justify-center items-center max-w-full  bg-slate-200 p-4 rounded">
                        <template v-for="(item, index) in sSplit(sItem.text)" :key="index">
                            <div class="bg-amber-300 px-4 py-1 rounded border-2 border-white shadow">{{ item }}</div>
                        </template>
                    </div>
                    <label class="block w-fit py-1 px-5 rounded-b bg-slate-200 mx-auto text-xs">{{sSplit(sItem.text).length}} words.</label>
                    
                    <button v-if="sentences.length>1" class="text-bold p-1 mt-1 text-red-400 text-warning text-sm" @click="deleteSentence(sIndex)">Delete sentence</button>
                </div>


                <div class="my-5">
                    <button class="text-bold p-2 bg-info rounded hover:bg-warning" @click="addSentence">Add sentence</button>
                </div>

                
                <div class="grid grid-cols-2 text-center py-6 bg-slate-100 mt-10 rounded">
                    <div><button :disabled="!isready" @click="FNPreview" class="p-1 rounded bg-secondary text-white disabled:opacity-20">Preview</button></div>
                    <div>
                        <button :disabled="!isready"  @click="FNSave" class="p-1 rounded bg-success text-white disabled:opacity-20">
                            <span v-if="status=='new'">Publish</span>
                            <span v-if="status=='publishing'">Saving and publishing...</span>
                            <span v-if="status=='save'">Save changes</span>
                        </button>    
                    </div>
                    
                </div>
            </div>
        </Transition>
        <div class="text-center mt-4"><button @click="FNCancel" class="p-1 rounded bg-slate-200">Cancel</button></div>
    </div>
    <div v-if="previewing">
        <iframe @load="FNUpdateOda()" ref="iframe" src="/#MAKER" class="w-[320px] md:w-[600px] lg:w-[800px] h-[600px]" frameborder="0"></iframe>
        <div class="text-center mt-4"><button @click="previewing = false" class="p-1 rounded bg-slate-200">Return</button></div>
    </div>

</template>

<script setup>
import defaultdoc from './builderobj.js'

import deepdash from 'deepdash-es';
deepdash(_)

const props = defineProps({
    data: Object,
    name: String
})

const emits = defineEmits(['cancel', 'preview', 'save'])
const status = ref('new')
const previewing = ref(false)
const iframe = ref()
const sentences = ref([{text:''}])
const sentence = ref('')
const sentenceSplit = computed(() => {
    if (sentence.value && sentence.value.trim() !== '') {
        return sentence.value.trim().split(' ');
    } else {
        return [];
    }
});

const sSplit = (text) => {
    if (text && text.trim() !== '') {
        return text.trim().split(' ');
    } else {
        return [];
    }
}


const initialConfiguration = ref(
    {instructions:'Rearrange the words.'}
)
const configurationData = ref(null)


const questions = ref([])

const addSentence = () =>{ sentences.value.push({text:''}) }
const deleteSentence = (index) =>{ sentences.value.splice(index, 1) }


const base = {
    definition: '',
    matching: '',
}



const configReady = ($event) => {
    if($event.ready){
        configurationData.value = $event.data
    } else {
        configurationData.value = null
    }
}



const addNew = () => {
    questions.value.push(JSON.parse(JSON.stringify(base)))
}
const removeItem = (index) => {
    questions.value.splice(index, 1)
}


const isready = computed(()=>{
    let nonempty = true
    for(var s in sentences.value){
        if(sentences.value[s].text==""){
            nonempty = false
        }
    }
    return nonempty
})

const FNCancel = () => { emits('cancel') }
const FNPreview = () => { 
    buildODA()
    previewing.value = true
 }
 const FNSave = () => {
    status.value = 'publishing'
    emits('save')
    buildODA()

    const message = {
        datatype: 'Builder: '+props.name,
        title: configurationData.value.title,
        instructions: configurationData.value.instructions,
        oda: odaObject.value,
        grade: configurationData.value.grade,
        attempts: configurationData.value.attempts,
        startDate: configurationData.value.startDate,
        endDate: configurationData.value.endDate,
        isExtra: 1
    }
    const inps = {
        config: JSON.parse(JSON.stringify(message)),
        questions: questions.value
    }
    message['inputs'] = inps
    const publishData = JSON.stringify(message)

    window.parent.postMessage(publishData, "*");
    setTimeout(()=>{
        status.value = 'save'
    },500)
}


const wordObject = {
        "text": "Hello",
        "class": "normal-case",
        "block": "text",
        "id": "",
        "name": ""
    }

const sentObject = {
    "order": true,
    "class": "gap-1 justify-center flex w-full mx-auto mt-3",
    "group": "uno",
    "content": [
    
    ],
    "positive": "",
    "evaluation": "auto",
    "showResult": false,
    "id": "rearrbuilder",
    "block": "dragdrop",
    "name": "rearrbuilder",
    "attempts": 0,
    "shuffle": true
}



const questionObject = {
            "block": "group",
            "class": "bg-slate-100 rounded p-3 my-2 max-w-3xl mx-auto",
            "content": [
              
            ],
            "background": "",
            "name": "jzoE",
            "hidden": false,
            "marker": "rearranger",
            "id": ""
          }


const getRandomCharacters=_=>"xxxx".replace(/x/g,_=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.random()*62|0]);

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
}

const odaObject = ref()
const buildODA = () => {
    const defdoc = JSON.parse(JSON.stringify(defaultdoc.json))
    defdoc.title = configurationData.value.title
    defdoc.attempts = configurationData.value.attempts
    defdoc.activity.scenes[0].instructions.content[0].content[0].text = configurationData.value.instructions
    let qo = JSON.parse(JSON.stringify(questionObject))
    
    for(var s in sentences.value){
        let thesentence = sentences.value[s]
        let sentenceObj = JSON.parse(JSON.stringify(sentObject))
        let positivevalue = ""
        let words = sSplit(thesentence.text)

        for(var q in words){

            let wordObj = JSON.parse(JSON.stringify(wordObject))
            wordObj.text = words[q]
            wordObj.name = 's'+s+''+q
            positivevalue += 's'+s+''+q+','
            sentenceObj.content.push(wordObj)
        }
        
        if (positivevalue.endsWith(',')) {
            positivevalue = positivevalue.slice(0, -1); // Remove the last comma
        }
        sentenceObj.positive = positivevalue
        
        qo.content.push(sentenceObj)
    }
   

    defdoc.activity.scenes[0].content[0].content.push(qo)
    odaObject.value = defdoc
}


const FNUpdateOda = () => {
    const datos = {
        type: 'oda',
        oda: odaObject.value
    }
    datos.oda.attempts = 99
    setTimeout(()=>{
        iframe.value.contentWindow.postMessage(JSON.stringify(datos) , '*')
        window.addEventListener('message', function(event) {
            try {
                let parsedData = JSON.parse(event.data);
                if (parsedData.datatype == 'intro') {
                    FNUpdateOda();
                }
            } catch (error) {
                //console.error('Invalid JSON:', event.data);
            }
        })
    }, 500)

}


if(props.data){
    const configobj = JSON.parse(JSON.stringify(props.data.config))
    delete configobj['datatype']
    delete configobj['oda']
    initialConfiguration.value = configobj
    configurationData.value = configobj
    questions.value = JSON.parse(JSON.stringify(props.data.questions))
}

onMounted(() => {
  //DEBUG
  //title.value = "Debug title"
  //questions.value[0]= {start: 'Beginning ', word: 'missing', end: 'End.' }

  if(!props.data) {
        // Is new
        addNew()  
        
    }
})

</script>