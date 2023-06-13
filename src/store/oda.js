import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import CryptoJS from 'crypto-js';
import deepdash from 'deepdash-es';
deepdash(_)

export const useOda = defineStore({
    id: 'oda',
    state: ()=> ({
        odaID: useStorage('rioda_ID', null),
        oda: null,
        user: null,
        odaloaded: false,
        //FIXME: create a function to getfiles
        //FIXME: call this baseurl on webhistory
        //baseurl: '/riodas'
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

                let res = {}
                let responded = 0
                let positive = 0
                let total = 0
                    if(this.user.inputs){
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
                    }

                    return {
                        inputs: res,
                        responded: responded,
                        positive: positive,
                        total: total
                    }

            }
        },
        getAllInputs(){
            let res = {}
            let responded = 0
            let positive = 0
            let total = 0
                if(this.user.inputs){
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
                }
                return {
                    inputs: res,
                    responded: responded,
                    positive: positive,
                    total: total
                }

                
        },
        getEvaluations(){
            const evaluations = {
                auto: 0,
                manual: 0
            }
            _.eachDeep(this.oda, (valueD, keyD, parentD, ctxD) => {
                if(keyD=='evaluation'){
                    if(ctxD._item.path.includes('symbols')){
                        
                        _.eachDeep(this.oda, (valueD2, keyD2, parentD2, ctxD2) => {

                            if(keyD2=='symbol' && valueD2 == ctxD._item.path[1]){
                                if(valueD == 'auto'){
                                    evaluations.auto += 1;
                                }
                                if(valueD == 'manual'){
                                    evaluations.manual += 1;
                                }
                            }
                        })
                        
                    } else {
                        if(valueD == 'auto'){
                            evaluations.auto += 1;
                        }
                        if(valueD == 'manual'){
                            evaluations.manual += 1;
                        }
                    }



                   
                }
            })

            return evaluations
        }
    },
    actions: {
        setOdaID (id){
            this.odaID = id
        },
        setUserLocation(path){
            this.user.location = path
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
                //Disable localstorage when not in localhost
                if(window.location.href.includes('localhost')){
                    this.user = useStorage('rioda_'+this.odaID+'_USER', {})
                } else {
                    this.user = {}
                }
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
        },
        restartUser(){
            this.user = {}
        }
    }
})