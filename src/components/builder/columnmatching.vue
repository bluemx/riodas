<template>
    <div v-show="!previewing">
        <builder-configs :data="initialConfiguration" @updated="configReady"></builder-configs>

       
        <Transition>
            <div  v-if="configurationData">

                <div v-for="(item, index) in questions" :key="index" class="border-4 my-2 border-secondary/50 shadow-xl rounded p-4">
                    
                    <label class="block w-fit py-1 px-5 rounded-t bg-slate-200 mx-auto">Row</label>
                    <div class="bg-slate-200 p-1 rounded bg-secondary grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div class=" p-1 rounded bg-slate-200">
                            <input v-model="item.definition" class="block border-2 border-info bg-white rounded w-full min-h-[32px] resize-none " placeholder="Definition" />
                            <div class="text-xs text-neutral">Definition</div>
                        </div>
                        <div class=" p-1 rounded bg-success">
                            <input v-model="item.matching" class="block border-2 border-info bg-white rounded w-full min-h-[32px] resize-none " placeholder="Text" />
                            <div class="text-xs text-white">Matching text</div>
                        </div>
                    </div>
                    <Transition>
                        <div v-if="item.start && item.word && item.end">
                            <div class="text-center my-2 text-3xl"><iconify-icon icon="solar:arrow-down-bold-duotone"></iconify-icon></div>
                            <div class="bg-slate-300 mt-2 text-slate-500 text-center text-xl p-2 rounded">{{ item.start }} <strong class="underline underline-offset-4 text-primary">{{ item.word }}</strong> {{ item.end }}</div>
                        </div>
                        </Transition>
                    <div class="text-center" v-if="questions.length>1">
                        <button @click="removeItem(index)" class="p-1 rounded bg-slate-100 text-rose-400 text-xs mt-2">Remove row</button>
                    </div>    
                </div>

                <div class="text-center">
                    <button @click="addNew" class="p-1 rounded bg-info text-white">Add row</button>
                    <div v-if="isready>0" class="text-xs mt-3 text-primary">{{isready}} field(s) remaining to be filled.</div>
                </div>
                <div class="grid grid-cols-2 text-center py-6 bg-slate-100 mt-10 rounded">
                    <div><button :disabled="isready>0" @click="FNPreview" class="p-1 rounded bg-secondary text-white disabled:opacity-20">Preview</button></div>
                    <div>
                        <button :disabled="isready>0"  @click="FNSave" class="p-1 rounded bg-success text-white disabled:opacity-20">
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

const initialConfiguration = ref(
    {instructions:'Match the text with the definition.'}
)
const configurationData = ref(null)


const questions = ref([])




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
    let empties = 0
    _.eachDeep(questions.value, (valueD, keyD, parentD, ctxD) => {
        if(valueD == ''){
            empties++
        }
    })
    return empties
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
    console.log(props.data)
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
    console.log(JSON.stringify(inps))
    window.parent.postMessage(publishData, "*");
    setTimeout(()=>{
        status.value = 'save'
    },500)
}



const definitionObject = {
    "block": "text",
    "class": "p-4 bg-slate-200 flex items-center",
    "text": "Definition text..."
}
const matchObject = {
    "text": "Matching text...",
    "class": "normal-case",
    "block": "text",
    "name": ""
}


const questionObject = {
    "block": "group",
    "class": "bg-slate-100 rounded p-3 my-2 max-w-3xl mx-auto grid grid-cols-2 gap-1",
    "content": [
        {
            "class": "grid gap-3",
            "content": [
                
            ],
            "block": "group",
        },
        {
            "order": true,
            "class": "grid h-full gap-3 flex-col !justify-between",
            "group": "uno",
            "content": [
                
            ],
            "positive": "",
            "evaluation": "auto",
            "showResult": false,
            "id": "p8AI",
            "block": "dragdrop",
            "attempts": 0
        }
    ]
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
    for(var q of questions.value){
        let deObj = JSON.parse(JSON.stringify(definitionObject))
        let maObj = JSON.parse(JSON.stringify(matchObject))

        deObj.text = q.definition
        maObj.text = q.matching
        maObj.name = getRandomCharacters()


        qo.content[0].content.push(deObj)

        qo.content[1].content.push(maObj)
        qo.content[1].positive +=maObj.name+','
    }
    
    // FIXME:
    qo.content[1].content = shuffle(JSON.parse(JSON.stringify(qo.content[1].content)))
    qo.content[1].positive = qo.content[1].positive.replace(/,\s*$/, '')
    console.log(qo.content[1].positive)
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