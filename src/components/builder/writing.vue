<template>
    <div v-show="!previewing">

        <builder-configs :data="initialConfiguration" @updated="configReady"></builder-configs>


        <Transition>
            <div  v-if="configurationData">
                <div class="border-4 my-2 border-secondary/50 shadow-xl rounded p-4">
                    <label class="block w-fit py-1 px-5 rounded-t bg-slate-200 mx-auto">Information</label>
                    <div class="bg-slate-200 p-1 rounded bg-secondary">
                        <textarea v-model="odablocks.information" class="block border-2 text-base bg-white p-2  border-secondary rounded w-full min-h-[120px]" placeholder=""></textarea>
                    </div>
                    <div class="">
                        <label class="block w-fit py-1 px-5 rounded-t bg-slate-200 mx-auto mt-2">Max. number of characters</label>
                        <input v-model="odablocks.maxlength" class="block border-2 border-info bg-white rounded w-full min-h-[32px] resize-none " placeholder="Option" />

                    </div>
                </div>
                <!--
                <div v-for="(item, index) in questions" :key="index" class="border-4 my-2 border-secondary/50 shadow-xl rounded p-4">
                    <label class="block w-fit py-1 px-5 rounded-t bg-slate-200 mx-auto">Question</label>
                    <div class="bg-slate-200 p-1 rounded bg-secondary">
                        <input v-model="item.question" class="block border-2 text-xl bg-white p-2 font-bold border-secondary rounded w-full min-h-[32px] resize-none  max-h-40" placeholder="Write your question" />
                    </div>
                    <label class="block w-fit py-1 px-5 rounded-t bg-slate-200 mx-auto mt-2">Choices</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2" :class="item.question.length>3 ? '': 'opacity-30'">
                        <template v-for="(option, optionIndex) in item.options" :key="optionIndex">
                            <div class=" p-1 rounded" :class="optionIndex==0?'bg-success':'bg-slate-200'">
                                <input v-model="item.options[optionIndex]" class="block border-2 border-info bg-white rounded w-full min-h-[32px] resize-none " placeholder="Option" />
                                <div v-if="optionIndex == 0" class="text-xs text-white">Write here the right answer</div>
                            </div>
                        </template>
                    </div>
                    <div class="text-center" v-if="questions.length>1">
                        <button @click="removeItem(index)" class="p-1 rounded bg-slate-100 text-rose-400 text-xs mt-2">Remove question</button>
                    </div>    
                </div> 
                -->
                <!-- activity -->

                <div class="text-center">
                    <!--<button @click="addNew" class="p-1 rounded bg-info text-white">Add question</button>-->
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
        <div class="text-center mt-4"><button @click="FNCancel" class="p-1 rounded bg-slate-200">Close</button></div>
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


const odablocks = ref({
    information: 'Write 240 characters about...',
    maxlength: 240
})





const initialConfiguration = ref(
    {instructions:'Read the information and write.'}
)
const configurationData = ref(null)


const base = {
    question: '',
    options: ['','','']
}

const configReady = ($event) => {
    if($event.ready){
        configurationData.value = $event.data
    } else {
        configurationData.value = null
    }
}


/*
const addNew = () => {
    questions.value.push(JSON.parse(JSON.stringify(base)))
}
const removeItem = (index) => {
    questions.value.splice(index, 1)
}
*/


const isready = computed(()=>{
    let empties = 0
    
    /*
    _.eachDeep(questions.value, (valueD, keyD, parentD, ctxD) => {
        if(valueD == ''){
            empties++
        }
    })
    */
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
        //questions: questions.value,
        odablocks: odablocks.value

    }
    message['inputs'] = inps
    const publishData = JSON.stringify(message)
    console.log(JSON.stringify(inps))
    window.parent.postMessage(publishData, "*");

    setTimeout(()=>{
        status.value = 'save'
    },500)
}






const questionObject = {
    "block": "group",
    "class": "bg-slate-100 rounded p-3 my-2 max-w-3xl mx-auto",
    "content": [
        {
        "block": "text",
        "class": "text-lg",
        "text": "Write about...",
        "name": "3Ovd",
        "hidden": false,
        "id": ""
        },
        {
        "case": false,
        "evaluation": "manual",
        "class": "m-5",
        "positive": "",
        "multiline": true,
        "placeholder": "",
        "showResult": false,
        "id": "133HwjGU",
        "block": "textarea",
        "name": "YkRt",
        "maxlength": 0,
        "attempts": 0
        }
    ],
    "background": "",
    "name": "4Cs6",
    "hidden": false
}



const odaObject = ref()
const buildODA = () => {
    const defdoc = JSON.parse(JSON.stringify(defaultdoc.json))
    defdoc.title = configurationData.value.title
    defdoc.attempts = configurationData.value.attempts
    defdoc.activity.scenes[0].instructions.content[0].content[0].text = configurationData.value.instructions
    
    //odablocks.value

    let qo = JSON.parse(JSON.stringify(questionObject))
    qo.content[0].text = odablocks.value.information
    qo.content[1].maxlength = odablocks.value.maxlength
    defdoc.activity.scenes[0].content[0].content.push(qo)

    /*
    for(var q of questions.value){
        let qo = JSON.parse(JSON.stringify(questionObject))
        qo.content[0].text = q.question
        qo.content[1].options[0].text = q.options[0]
        qo.content[1].options[1].text = q.options[1]
        qo.content[1].options[2].text = q.options[2]

        defdoc.activity.scenes[0].content[0].content.push(qo)
    }
    */

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
    //questions.value = JSON.parse(JSON.stringify(props.data.questions))
    odablocks.value = JSON.parse(JSON.stringify(props.data.odablocks))

}

onMounted(() => {


    if(!props.data) {
        // Is new
        //addNew()  
        
    }


})

</script>