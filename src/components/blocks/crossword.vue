<template>
    <div ref="block" :class="data.class || ''">
        <div v-for="(rows, indexY) in grid" :key="indexY" class="flex">
            <template v-for="(word, indexX) in rows" :key="indexX">
                <cword @result="resultFN" :word="word" :theid="getId(indexX, indexY)" :blockindex="blockindex+'-'+indexX+'-'+indexY"></cword>
            </template>
        </div>
        
    </div>
</template>
<script setup>


import { objectEntries } from "@vueuse/core";
import { useOda } from "../../store/oda.js"
import { useBlocks } from './blocks.js'
const blocks = useBlocks()
const oda = useOda()
const block = ref()

//PROPS
const props = defineProps({
    data: Object,
    blockindex: String
})

const words = ref()
const grid = ref([])
const ids = ref({})
const loadinputs = ref(false)
const inputs = ref({})

//const grid = ref([8,8])

watch(()=>props.data, ()=>{ init() }, {deep:true})



const resultFN = ($ev) => {
    if($ev === null){ return false }
    inputs.value[$ev.pos.x+'-'+$ev.pos.y] = $ev
    //Find falses
    //console.log(countResults())

    const cr = countResults()

    blocks.result.value = (cr.false == 0)
    blocks.evaluateFN(inputs.value)
}


function countResults() {
    // Get an array of all the cell objects
    var cellArray = Object.values(inputs.value);

    // Use reduce to count the number of true and false results
    var counts = cellArray.reduce((count, cell) => {
        if (cell.result === true) {
            count.true++;
        } else if (cell.result === false) {
            count.false++;
        }
        return count;
    }, { true: 0, false: 0 });

    return counts;
}

const getId = (x,y) => {
    const theid = ids.value[x+'-'+y]
    if(theid){
        return theid
    } else {
        return false
    }
}
const init = () => {
    words.value = JSON.parse(JSON.stringify(props.data.content))
    ids.value = {}

    words.value.forEach(word => {
        ids.value[word.x+'-'+word.y] = [word.id, word.direction]
    });

    var gridSize = calculateGridSize(words.value);
    grid.value = createGrid(gridSize);
    for (let i = 0; i < words.value.length; i++) {
        addWordToGrid(grid.value, words.value[i].word.toUpperCase(), words.value[i].x, words.value[i].y, words.value[i].direction);
    }
}

function addWordToGrid(grid, word, startX, startY, direction) {
    for (let i = 0; i < word.length; i++) {
        if (direction === 'h') { // Horizontal direction
            grid[startY][startX + i] = [word[i], [startX + i, startY], false];
        } else if (direction === 'v') { // Vertical direction
            grid[startY + i][startX] = [word[i], [startX, startY+ i], false];
        }
    }
}

function calculateGridSize(words) {
    let maxX = 0, maxY = 0;
    for (let i = 0; i < words.length; i++) {
        let endX, endY;
        if (words[i].direction === 'h') { // Horizontal direction
            endX = words[i].x + words[i].word.length - 1;
            endY = words[i].y;
        } else if (words[i].direction === 'v') { // Vertical direction
            endX = words[i].x;
            endY = words[i].y + words[i].word.length - 1;
        }
        maxX = Math.max(maxX, endX);
        maxY = Math.max(maxY, endY);
    }
    return Math.max(maxX, maxY) + 1;
}
function createGrid(size) {
    var grid = Array(size).fill().map(() => Array(size).fill(null));
    return grid;
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
    init()

    const blockdata = blocks.initFN(oda, props.data, props.blockindex, block.value)
    setTimeout(()=>{
        if (blockdata && blockdata?.v != null) {        
            Object.keys(blockdata.v).forEach(element => {
                const data = blockdata.v[element]
                if(data.answer){
                    grid.value[data.pos.y][data.pos.x][2] = data.answer 
                    //console.log(data.answer)
                }
            });
            //inputs.value = blockdata.v
        }
    }, 500)


})






</script>