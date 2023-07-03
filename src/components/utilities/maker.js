import { onMounted } from "vue"
import { useOda } from "../..//store/oda.js"
import { useRouter } from "vue-router"


export function useMaker () {
    const router = useRouter()
    const oda = useOda()

    const listener = () => {
        window.addEventListener('message', function(event) {
            let data = null
            try{ data = JSON.parse(event.data) } catch { data = null }
            if(!data){ return false }
            
            if(data.type == 'student-inputs'){
                console.log('PM: student-inputs')
                const inputs = JSON.parse(atob(data.inputs))
                const decodeData = JSON.parse(window.atob(data.inputs))
                oda.user = decodeData
                oda.userWaiting = decodeData
            }
            if(data.type == 'teacher-inputs'){
                console.log('PM: teacher-inputs')
                const inputs = JSON.parse(atob(data.inputs))
                const decodeData = JSON.parse(window.atob(data.inputs))
                oda.teacher = decodeData
            }
            if(data.type == 'attempts'){
                console.log('PM: attempts')
                oda.odaAttempts = data.time
            }

            if(data.type == 'oda'){
                console.log('PM: oda')
                /* remove hidden */
                const odaDoc = ref(data.oda)
                odaDoc.value = _.cloneDeepWith(odaDoc.value, (value) => {
                    if (_.isObject(value) && value.hidden === true) {
                        return {}
                    }
                });
                oda.oda = odaDoc
            }

            if(data.type=='restartoda'){
                console.log('PM: restartoda')
                oda.restartUser()
                router.push('/'+oda.odaID)
            }
        })
    }
    
return { listener }

}