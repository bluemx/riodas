<template>
</template>
<script setup>
import { useOda } from '../../store/oda';
import deepdash from 'deepdash-es';
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
    "block": "group", "class": "inline-block align-middle mx-2 ",
    "content": [
        { "options": [], "dropdown": true, "evaluation": "auto", "showResult": false, "block": "option", "attempts": 0, "class": ""+ (props.data.classitems || '') }
    ],
}

const groupJson = { "marker": "▶️", "class": ""+ (props.data.classtexts || ''), "content": [], "block": "group" };



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


const init = () => {
    ready.value = false
    fullobject.value = { block: "group", content:[], class: props.data.class || '' }
    itemsobj.value = []
    dropcounter.value = 0

    // ITEMS
    items.value = []
    items.value = props.data.items
    /*
    items.value = props.data.items.map((item, index)=>{
        return {
            index: index,
            id: 'worddrop'+index,
            content: item
        }
    })
    */
    genItems()
    // TEXTS
    texts.value = []
    props.data.texts.forEach(element => {
        const structure = splitStringWithUnderscore(element)
        texts.value.push(structure)
    });
    genTexts()
    replaceobjectinoda()
    /*
    setTimeout(()=>{
        ready.value = true
    }, 500)
    */
}




onMounted(() => {
    init()
})
</script>