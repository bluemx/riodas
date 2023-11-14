<template>
    <div v-for="(item, index) in items" :key="index">
        <ElashqItem :information="item.information" :question="item.question" :options="item.options" :answer="item.answer" :counter="index+1" />
    </div>
</template>
<script setup>
import { useOda } from '../../store/oda';
import deepdash from 'deepdash-es';
import ElashqItem from './elashqItem.vue';
deepdash(_)



const props = defineProps({
    data: Object,
    blockindex: String,
    name: String
})

const oda = useOda()

const fullobject = ref({})
const ready = ref(false)

const dropcounter = ref(0)
const items = ref([])
const texts = ref([])
const itemsobj = ref([])
const textsobj = ref()

watch(()=>props.data, ()=>{ init() }, {deep:true})



const getRandomCharacters=_=>"xxxx".replace(/x/g,_=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.random()*62|0]);

const MGK = "-"+getRandomCharacters()+"-"


const genItems = () => {
    items.value.forEach((item)=>{
        const itemarr = item.split(',')
        const arraobjs = itemarr.map((i)=>{
            return {
                text: i,
                block: "text",
                class: ""+ (props.data.classitem || '')
            }
        })
        itemsobj.value.push(arraobjs)
    })
}


const groupCounter = {
    "block": "text", "text": "1.", "class": "mr-3 text-xl bg-slate-400/10 px-2 rounded text-slate-400 " + (props.data.classcounter || '')
}
const groupText = {
    "block": "text", "class": "", "text": "texto"
}
const groupOptions = {
    "block": "group", "class": "flex gap-3 my-4 [&>*:nth-child(odd)]:bg-white [&>*:nth-child(even)]:bg-slate-200 [&>*]:p-2 [&>*]:rounded",
    "content": [],
}

const groupJson = { "marker": "▶️", "class": "my-5 "+ (props.data.classtexts || ''), "content": [], "block": "group" };









const genTexts = () => {
    let groups = []      
    texts.value.forEach((item, index)=>{
        let content = JSON.parse(JSON.stringify(groupJson))
        content.name = content.id = "groupJson-"+index

        if(props.data.counter){
            content.content.push({
                ...groupCounter,
                text: (index+1)+'.',
                name: 'enum'+index,
                id: 'enum'+index,
            })
        }
        //TEXT
        item.forEach((element, eIndex) => {
            if(typeof element === 'string'){
                content.content.push({
                    ...groupText,
                    text: element,
                    name: 'groupText'+index+eIndex,
                    id: 'groupText'+index+eIndex,
                })

            } else if(typeof element === 'boolean'){
                
                let thecontent = JSON.parse(JSON.stringify(groupOptions.content[0]))
                //thecontent.positive = 'worddrop'+dropcounter.value
                thecontent.name = thecontent.id = 'groupOptionsContent'+index+eIndex
                thecontent.options = itemsobj.value[dropcounter.value]
                let groupOptionsObj = JSON.parse(JSON.stringify(groupOptions))
                groupOptionsObj.name = groupOptionsObj.id = 'groupOptions'+index+eIndex
                groupOptionsObj.content = [thecontent]

                content.content.push(groupOptionsObj)

                dropcounter.value++
            }
        });


        groups.push(content)
    })
   

  fullobject.value.content.push(...groups)


}








const splitStringWithUnderscore = (str) => {
  const parts = str.split('_');
  const result = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (i < parts.length - 1) {result.push(true);}
  }
  return result;
}




const replaceobjectinoda = () => {
    _.eachDeep(oda.oda.activity, (valueD, keyD, parentD, ctxD) => {
        if(keyD=='name' && valueD==props.name){
            _.set(oda.oda.activity, ctxD._item.parent.path, fullobject.value);
        }
    })

}

/*
function textToJSON(text) {
  // Split the input into groups
  const groups = text.trim().split(/\n\s*\n/);
  const items = [];

  // Process each group
  groups.forEach(group => {
    const lines = group.split('\n');
    const item = {};
    item.question = lines[0];
    item.options = lines.slice(1, -1); // get all lines except first and last
    item.answer = lines[lines.length - 1]; // get the last line
    items.push(item);
  });
  return items;
}
*/
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

const createJSONS = () => {
    fullobject.value.content = []
    
    items.value.forEach((item,index)=>{
        let mainGroup = JSON.parse(JSON.stringify(groupJson))
        mainGroup.name = mainGroup.id = "mainGroup"+MGK+index
        mainGroup.class = 'p-2 rounded shadow-xl my-2 border-2 border-white/50'
        
        // #### introGroup
        let introGroup = JSON.parse(JSON.stringify(groupJson))
        introGroup.name = introGroup.id = "mainIntroGroup"+MGK+index
        
        // INFORMATION
        if(item.information){
            var iteminfo = item.information
            iteminfo = iteminfo.replace(/\\n/g, '<br>');
            console.log(iteminfo)
            introGroup.content.push({
                ...groupText,
                text: iteminfo,
                name: 'int'+MGK+index,
                id: 'int'+MGK+index,
                class: "block whitespace-pre-wrap rounded bg-sky-100 w-full p-2",
            })
        }

        // Add intro to mainGroup
        mainGroup.content.push(introGroup)
        

        // #### contentGroup
        let contentGroup = JSON.parse(JSON.stringify(groupJson))
        contentGroup.name = contentGroup.id = "mainContentGroup"+MGK+index
        
        

        //COUNTER
        if(props.data.counter>0){
            contentGroup.content.push({
                ...groupCounter,
                text: (index+props.data.counter)+'.',
                name: 'counter'+MGK+index,
                id: 'counter'+MGK+index,
            })
        }
        //QUESTION
        contentGroup.content.push({
            ...groupText,
            text: item.question,
            name: 'q'+MGK+index,
            id: 'q'+MGK+index,
            class: "text-xl"
        })
        //OPTIONS
        contentGroup.content.push({
            ...groupOptions,
            content: item.options.map((op,index)=>{
                return {
                    ...groupText,
                    text: "<b>"+indexToABC(index)+")</b> "+ op,
                    name: 'oi'+MGK+index,
                    id: 'oi'+MGK+index,
                }
            }),
            name: 'ops'+MGK+index,
            id: 'ops'+MGK+index,
        })

        // Add content to mainGroup
        mainGroup.content.push(contentGroup)

        //Add to fullobject
        fullobject.value.content.push(mainGroup)
    })

    //replaceobjectinoda()
}


const init = () => {
    ready.value = false
    fullobject.value = { block: "group", content:[], class: props.data.class || '' }
    itemsobj.value = []
    dropcounter.value = 0

    // ITEMS

    items.value = textToJSON(props.data.textual)

    createJSONS()

    
}





onMounted(() => {
    init()
})

</script>