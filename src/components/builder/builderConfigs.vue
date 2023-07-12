<template>
    <!--title-->
    <label class="block w-fit py-1 px-5 rounded-t bg-sky-700 text-white mx-auto">Activity title</label>
    <input v-model="config.title" class="block border-2 text-2xl p-2 bg-white font-bold border-secondary rounded w-full min-h-[32px] resize-none  max-h-40" placeholder="Activity title" />
    <!--instructions-->
    <label class="block w-fit py-1 px-5 rounded-t bg-sky-600 text-white mx-auto mt-5">Activity instructions</label>
    <input v-model="config.instructions" class="block border-2 text-lg p-2 bg-white font-bold border-secondary rounded w-full min-h-[32px] resize-none  max-h-40 mb-5" placeholder="Activity instructions" />
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-2 mt-5">
        <div>
            <!--attempts-->
            <label class="block w-fit py-1 px-5 rounded-t bg-sky-500 text-white mx-auto">Available attempts</label>
            <input v-model="config.attempts" class="block border-2 text-lg p-2 bg-white font-bold border-secondary rounded w-full min-h-[32px] resize-none text-center max-h-40 mb-5" placeholder="Attemps" type="number" min="1" />
        </div>
        <div>
            <!--grade-->
            <label class="block w-fit py-1 px-5 rounded-t bg-sky-500 text-white mx-auto">Minimum grade</label>
            <input v-model="config.grade" class="block border-2 text-lg p-2 bg-white font-bold border-secondary rounded w-full min-h-[32px] resize-none  text-center max-h-40 mb-5" placeholder="Grade" type="number" min="0" />
        </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-2">
        <div>
            <!--start-->
            <label class="block w-fit py-1 px-5 rounded-t bg-sky-400 text-white mx-auto">Start date</label>
            <input v-model="config.startDate" class="block border-2 text-lg p-2 bg-white font-bold border-secondary rounded w-full min-h-[32px] resize-none  max-h-40 mb-5" placeholder="Start date" type="datetime-local" :max="config.endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}" />
        </div>
        <div>
            <!--end-->
            <label class="block w-fit py-1 px-5 rounded-t bg-sky-400 text-white mx-auto">End date</label>
            <input v-model="config.endDate" class="block border-2 text-lg p-2 bg-white font-bold border-secondary rounded w-full min-h-[32px] resize-none  max-h-40 mb-5" placeholder="End date" type="datetime-local" :min="config.startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}" />
        </div>
    </div>

   
</template>

<script setup>
const props = defineProps({
    data: Object
})
const emits = defineEmits(['updated'])
const config = ref(
    {
        title: '',
        instructions: '',
        attempts: 3,
        grade: 6,
        startDate: '',
        endDate: '',
    }
)




const formatDate = (date) => {
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  var hours = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


const startingDates = () => {
    var today = new Date();
    var futureDate = new Date();
    futureDate.setDate(today.getDate() + 7);
    if(config.value.startDate==''){
        config.value.startDate =  formatDate(today);
    }

    if(config.value.endDate==''){
        config.value.endDate =  formatDate(futureDate); 
    }
}

const loadInitdata = () => {

    for(var i of Object.keys(props.data)){
        //console.log(i, props.data[i])
        if(i=='startDate' || i=='endDate'){
            config.value[i] = formatDate(new Date(props.data[i]))
            //console.log( formatDate(new Date(props.data[i]))   )
        } else {
            config.value[i] = props.data[i]
        }
    }
}

const updateconfig = () => {
    let isready = true
    if(config.value.title.length<3){ isready = false }
    if(config.value.instructions.length<3){ isready = false }
    if(config.value.attempts<1){ isready = false }
    if(config.value.grade<1){ isready = false }
    if(!config.value.startDate){ isready = false }
    if(!config.value.endDate){ isready = false }

    const dataObj = JSON.parse(JSON.stringify(config.value))
    dataObj.startDate = dataObj.startDate.replace('T', ' ') + ':00'
    dataObj.endDate = dataObj.endDate.replace('T', ' ') + ':00'
    emits('updated', {ready: isready, data: dataObj})
}

onMounted(() => {
    loadInitdata()
    startingDates()
    watch(()=>config.value, ()=>{
        updateconfig()
    }, {deep:true} )
})


</script>
