<script setup>
import { useRoute } from 'vue-router';
import { useOda } from '../../store/oda';
const oda = useOda()
const route = useRoute()
const props = defineProps({
    data: Object,
    blockindex: String
})

const scenenum = route.params.scene || 0
const rules = props.data.rules
//const fullfiled = ref(false)

const compareFN = (val1, compare, val2) => {
    switch(compare){
        case "==":
            return val1 == val2
            break 
        case "!=":
            return val1 != val2
            break 
        case ">=":

            return val1 >= val2
            break 
        case "<=":
            return val1 <= val2
            break 
    }
}
const fullfiled = computed(()=>{
    let rulesResult = []
    rules.forEach((rule)=>{
        if(rule[0] == 'scene'){
            var scenedata = oda.getSceneInputs(scenenum)
            var val1 = scenedata[rule[1]]
            var compare = rule[2]
            var val2 = rule[3]
            rulesResult.push(compareFN(val1, compare, val2))
            console.log(rulesResult)
            console.log()
        }
        if(rule[0] == 'oda'){
            
        }
    })
    return rulesResult.every(element => element === true)

})



</script>
<template>
<div>
    <Content v-if="fullfiled && data['content-true']" v-for="(item, index) in data['content-true']" :key="index" :data="item" :blockindex="blockindex"></Content>
    <Content v-if="!fullfiled && data['content-false']" v-for="(item, index) in data['content-false']" :key="index" :data="item" :blockindex="blockindex"></Content>
    ::{{ oda.getSceneInputs(scenenum) }}
</div>

</template>

