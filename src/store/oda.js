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
        odaAttemptsLimit: 3
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
                const oda = await response.json()
                this.loaded = true
                this.oda = useStorage('rioda_'+this.odaID+'_ODA', oda)
                if(oda){
                    this.oda = oda
                }

                let userData = {}
                if(this.userWaiting!=null && this.user == this.userWaiting){
                    userData = this.userWaiting
                }


                //Disable localstorage when not in localhost
                if(window.location.href.includes('localhost')){
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
            this.user.inputs[blockindex] = CryptoJS.AES.encrypt(JSON.stringify(
                {
                    r: result,
                    v: value,
                    data: data
                }
            ),'blue').toString()
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
        restartUser(){
            this.user = {}
        }
    }
})


/*
window.addEventListener('message', function(event) {

    const oda = useOda()
    let data = null
    try{
        data = JSON.parse(event.data)
    } catch {
        data = null
    }
    if(!data){
        return false
    }
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
        oda.odaAttempts = data.time
    }

    if(data.type == 'oda'){
        oda.oda = data.oda
    }

    if(data.type=='restartoda'){
        oda.restartUser()
        console.log(oda.user)
    }

  });


*/
