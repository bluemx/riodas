import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import CryptoJS from 'crypto-js';



export const useOda = defineStore({
    id: 'oda',
    state: ()=> ({
        odaID: useStorage('rioda_ID', null),
        oda: null,
        user: null,
        odaloaded: false
    }),
    getters: {
        getOda(){
            return this.oda
        },
        getInput(){
            return (blockindex) => {
                if(this.user.inputs){
                    if(this.user.inputs[blockindex]){
                        const bytes = CryptoJS.AES.decrypt(this.user.inputs[blockindex], 'blue')
                        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                    }
                } else {
                    return false
                }
            }
        },
        getSceneInputs(){
            return (scenenum) => {
                if(this.user.inputs){
                    let res = {}
                    let responded = 0
                    let positive = 0
                    let total = 0
                    
                        Object.keys(this.user.inputs).forEach(key=>{
                            if(key.split('-')[0]==scenenum){
                                const bytes = CryptoJS.AES.decrypt(this.user.inputs[key], 'blue')
                                const item = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                                res[key] = item
                                if(item.r != null){
                                    responded++
                                }
                                if(item.r){
                                    positive++
                                }
                                total++
                            }
                        })
                        return {
                            inputs: res,
                            responded: responded,
                            positive: positive,
                            total: total
                        }
                    }
            }
        },
        getAllInputs(){

            if(this.user.inputs){
                let res = {}
                let responded = 0
                let positive = 0
                let total = 0
                
                    Object.keys(this.user.inputs).forEach(key=>{
                            const bytes = CryptoJS.AES.decrypt(this.user.inputs[key], 'blue')
                            const item = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                            res[key] = item
                            if(item.r != null){
                                responded++
                            }
                            if(item.r){
                                positive++
                            }
                            total++
                    })
                    return {
                        inputs: res,
                        responded: responded,
                        positive: positive,
                        total: total
                    }
                }
                
        }
    },
    actions: {
        setOdaID (id){
            this.odaID = id
        },
        setUserLocation(path){
            this.user.location = path
            console.log(this.user)
        },
        async init(){
            let responder = true
            if(!this.odaID){
                // ERROR
                console.log('isErrro')
                responder = false
                return false
            }
            try {
                console.log('%cODA:%c'+this.odaID, 'color:#aaa;padding:2px;','font-weight:bold;background:#ffaa00;padding:2px;')
                const response = await fetch('ODAS/'+this.odaID+'/oda.json')
                const oda = await response.json()
                this.loaded = true
                this.oda = useStorage('rioda_'+this.odaID+'_ODA', oda)
                if(oda){
                    this.oda = oda
                }
                this.user = useStorage('rioda_'+this.odaID+'_USER', {})
                
                responder = true
            } catch (err){
                console.log(err)
                responder = false
            }
            return responder
        },
        setInput(blockindex, result, value, data){
            if(!this.user.inputs){
                this.user.inputs = {}
            }

            this.user.inputs[blockindex] = CryptoJS.AES.encrypt(JSON.stringify(
                {
                    r: result,
                    v: value,
                    data: data
                }
            ),'blue').toString()
        }
    }
})