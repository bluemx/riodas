<template></template>
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
const itemsobj = ref()
const textsobj = ref()

watch(()=>props.data, ()=>{ init() }, {deep:true})



const getRandomCharacters=_=>"xxxx".replace(/x/g,_=>"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.random()*62|0]);



//const itemsobj = computed(()=>{
const genItems = () => {
  const group = {
    order: false,
    class: "gap-5 p-5 max-w-3xl mx-auto flex-wrap",
    group: "worddrop",
    content: [], positive: "", evaluation: "",
    showResult: false,
    id: getRandomCharacters(), name: getRandomCharacters(),
    block: "dragdrop",
    attempts: 0
  };
  group.content = items.value.map((item)=>{
    return {
        text:item.content,
        class: "normal-case " + (props.data.classitem || ''),
        id: item.id,
        block: "text",
        name: item.id
    }
  })
  //return group
  //itemsobj.value = group
  const itemsgroup = {
    block: "group",
    class: "bg-slate-300/20  rounded mx-auto max-w-3xl my-1  p-5 "+ (props.data.classitems || ''),
    content: [group]
  }
  fullobject.value.content.push(itemsgroup)
//})
}


const groupCounter = {
    "block": "text", "text": "1.", "class": "mr-3 text-xl bg-slate-400/10 px-2 rounded text-slate-400 " + (props.data.classcounter || '')
}
const groupText = {
    "block": "text", "class": "", "text": "texto"
}
const groupDrop = {
    "block": "group", "class": "inline-block align-middle mx-2 ",
    "content": [
        { "order": false, "group": "worddrop", "content": [], "positive": "---", "evaluation": "auto", "showResult": false, "block": "dragdrop" }
    ],
}

const groupJson = { "marker": "▶️", "class": ""+ (props.data.classtexts || ''), "content": [], "block": "group" };


//const textsobj = computed(()=>{
const genTexts = () => {
    let groups = []      
    texts.value.forEach((item, index)=>{
        let content = JSON.parse(JSON.stringify(groupJson))
        content.name = content.id = "groupJson-"+index
        //TODO: ENUMERATE
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
                let thecontent = JSON.parse(JSON.stringify(groupDrop.content[0]))
                
                thecontent.positive = 'worddrop'+dropcounter.value
                thecontent.name = thecontent.id = 'groupDropContent'+index+eIndex
                let groupDropObj = JSON.parse(JSON.stringify(groupDrop))
                groupDropObj.name = groupDropObj.id = 'groupDrop'+index+eIndex
                groupDropObj.content = [thecontent]

                content.content.push(groupDropObj)

                dropcounter.value++
            }
        });


        groups.push(content)
    })
   

  //return groups
  //textsobj.value = groups
  fullobject.value.content.push(...groups)

//})
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

    dropcounter.value = 0

    // ITEMS
    items.value = []
    items.value = props.data.items.map((item, index)=>{
        return {
            index: index,
            id: 'worddrop'+index,
            content: item
        }
    })
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