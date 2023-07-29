import { onMounted } from "vue"
import { useOda } from "../..//store/oda.js"
import { useRouter, useRoute } from "vue-router"
import { useThrottleFn } from '@vueuse/core'


export function useMaker () {
    const router = useRouter()
    const route = useRoute()
    const oda = useOda()
    const builderdata = ref()


    const listenerActions = useThrottleFn((event) => {
        let data = null
        try{ data = JSON.parse(event.data) } catch { data = null }
        if(!data){ return false }
        //if(data?.type){ console.count('PM: '+ data?.type) }
        if(data.type == 'student-inputs'){
            const inputs = JSON.parse(atob(data.inputs))
            const decodeData = JSON.parse(window.atob(data.inputs))
            oda.user = decodeData
            oda.userWaiting = decodeData
        }
        if(data.type == 'teacher-inputs'){
            const inputs = JSON.parse(atob(data.inputs))
            const decodeData = JSON.parse(window.atob(data.inputs))
            oda.teacher = decodeData
        }
        if(data.type == 'attempts'){
            oda.odaAttempts = data?.time || data?.times
        }

        if(data.type == 'oda'){
            /* remove hidden */
            const odaDoc = ref(data.oda)
            odaDoc.value = _.cloneDeepWith(odaDoc.value, (value) => {
                if (_.isObject(value) && value.hidden === true) {
                    return {}
                }
            });
            const tout = window.location.href.includes('localhost') ? 0 : 500
            setTimeout(()=>{
                oda.oda = odaDoc
                if(oda.oda?.attempts){ oda.odaAttemptsLimit = oda.oda.attempts }
            }, tout)
        }

        if(data.type=='restartoda'){
            oda.restartUser()
            router.push('/'+oda.odaID)
        }
        //Builder
        if(data.type == 'builder'){
            if(route.path == '/builder'){
                //data.inputs
                builderdata.value = data.inputs
            }
        }
        //Highlight on hover
        if(data.type == 'hover'){
            const item = document.getElementsByName(data.name)[0]
            if(item){

                item.classList.add('ring-4', 'ring-amber-500')
                item.scrollIntoView({ behavior: "smooth", block: "nearest" });
                setTimeout(()=>{
                    item.classList.remove('ring-4', 'ring-amber-500')
                }, 200)
            }
        }
    }, 50)


    const listener = () => {
        window.addEventListener('message', function(event) {
                listenerActions(event)
        })
    }
    
return { listener, builderdata }

}