import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import CryptoJS from 'crypto-js';
import deepdash from 'deepdash-es';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';

deepdash(_)

export const useOda = defineStore({
    id: 'oda',
    state: ()=> ({
        odaID: useStorage('rioda_ID', null),
        oda: null,
        user: null,
        odaloaded: false,
        freeze: false,
        userWaiting: null,
        teacher: null,
        teacherFreeze: null,
        odaAttempts: 0,
        odaAttemptsLimit: 3,
        dynamicOdaData: null,
        leveltemp:null
    }),
    getters: {
        getOda(){
            return this.oda
        },
        getInput(){
            return (blockindex) => {
                if(this.user?.inputs){
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
                    if(this.user?.inputs){
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
                if(this.user?.inputs){
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
        getTeacherInputs () {
            let res = this.teacher?.inputs
            let positive = 0
            let total = 0
            let comments = 0
            if(this.teacher?.inputs){
            Object.keys(this.teacher.inputs).forEach(key=>{
                total++
                if(this.teacher.inputs[key].r == true){
                    positive++
                }
                if(this.teacher.inputs[key].v != ""){
                    comments++
                }
            })
        }
            const fullres = {
                inputs: res,
                positive: positive,
                comments: comments,
                total: total
            }
            return fullres
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
        setUserData (data){
            const decodeData = JSON.parse(window.atob(data))
            this.user = decodeData
            this.userWaiting = decodeData
        },
        setTeacherData (data){
            document.body.classList.add('teacher')
            const decodeData = JSON.parse(window.atob(data))
            this.teacher = decodeData
        },
        setFreeze(){
            this.freeze = true
            document.body.classList.add('freeze')

            if(this.user?.location){
                this.user.location = '/freeze'
            }
        },

        setUserLocation(path){
            this.user.location = path
        },
        async init(){
            let responder = true
            if(!this.odaID){
                // ERROR
                responder = false
                return false
            }
            try {
                console.log('%cODA:%c'+this.odaID, 'color:#aaa;padding:2px;','font-weight:bold;background:#ffaa00;padding:2px;')
                const response = await fetch('ODAS/'+this.odaID+'/oda.json')
                let odaDocument = await response.json()
                
                /* remove hidden */
                const odaDoc = ref(odaDocument)
                odaDoc.value = _.cloneDeepWith(odaDoc.value, (value) => {
                    if (_.isObject(value) && value.hidden === true) {
                        return {}
                    }
                });


                this.loaded = true
                
                this.oda = useStorage('rioda_'+this.odaID+'_ODA', odaDoc.value)
                
                if(odaDoc.value){
                    this.oda = odaDoc.value
                }
                //ATTEMPTS
                if(this.oda?.attempts && this.oda?.attempts>0){ this.odaAttemptsLimit = this.oda.attempts }
                
                let userData = {}
                if(this.userWaiting!=null && this.user == this.userWaiting){
                    userData = this.userWaiting
                }


                //Disable localstorage when not in localhost
                if(window.location.href.includes('localhost') || window.location.href.includes('odas.win') ){
                //if(false){
                    this.user = useStorage('rioda_'+this.odaID+'_USER', userData)
                } else {
                    this.user = userData
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
            if(!this.user.inputsNC){
                this.user.inputsNC = {}
            }
            this.user.inputs[blockindex] = CryptoJS.AES.encrypt(JSON.stringify(
                {
                    r: result,
                    v: value,
                    data: data
                }
            ),'blue').toString()


            this.user.inputsNC[blockindex] = {
                r: result,
                v: value,
                data: data
            }

        },
        setTeacherInput(blockindex, result, value){
            if(!this.teacher.inputs){
                this.teacher.inputs = {}
            }
            this.teacher.inputs[blockindex] = {
                r: result,
                v: value
            }
        },
        dynamicOda (data) {

            if(data){
                this.dynamicOdaData = data.oda
            }
            const odadocument = ref(this.dynamicOdaData)

            odadocument.value = _.cloneDeepWith(odadocument.value, (value) => {
                if (_.isObject(value) && value.hidden === true) {
                    return {}
                }
            });

            const tout = window.location.href.includes('localhost') ? 0 : 500
            setTimeout(()=>{
                    this.oda = odadocument.value
                    if(this.oda?.attempts){ this.odaAttemptsLimit = this.oda.attempts }
            }, 200)
        },
        restartUser(){
            this.user = {}
            setTimeout(()=>{
                if(this.dynamicOdaData){this.dynamicOda()}
            }, 100)
        }
    }
})
