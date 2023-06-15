import success from '../../assets/uisound/notification_decorative-01.mp3'
import nonsuccess from '../../assets/uisound/error_001.mp3'
import ShapesAnimation from '../all/ShapesAnimation'

export function useBlocks () {


const freeze = ref(false)
const attempts = ref(0)
const resultClass = ref('')
const result = ref(null)
// ---- 
const oda = ref();
const data = ref();
const blockindex = ref();
const blockref = ref();

//const myid = Math.random()*1000

const initFN = (BLOCKoda, BLOCKdata, BLOCKblockindex, BLOCKblockref) => {
    oda.value = BLOCKoda;
    data.value = BLOCKdata;
    blockindex.value = BLOCKblockindex;
    blockref.value = BLOCKblockref;
    resultClass.value = ''
    const stored = oda.value.getInput(blockindex.value)
    if(stored) {
        result.value = stored.r
        attemptsFN(stored.data.attempts)
        if(stored.v!=null){
            evaluateFN(stored.v, true)
        }
    } else {
        result.value = null
        attempts.value = 0
        freeze.value = false
        evaluateFN(null, true)
    }

    if(BLOCKoda.freeze){
        freeze.value = true
    }
    
    return stored

}

const evaluateFN = (input, mute) => {
    //ShowResult
    if(data.value.showResult && result.value!=null){
        //Class
        resultClass.value = result.value ? 'border-2 border-success' : 'border-2 border-primary'
        //Sound
        if(!mute){
            if(result.value){
                new Howl({ src: [success], rate: 1, volume: 0.8, autoplay:true })
            } else {
                new Howl({ src: [nonsuccess], rate: 1, volume: 0.6, autoplay:true })
            }
        }
        //Freeze
        if(result.value){
            ShapesAnimation.playkeep(blockref.value, ['positive'])
            freeze.value = true
        }
    }

    //#SAVE
    oda.value.setInput(blockindex.value, result.value, input, {attempts: attempts.value})

}



const attemptsFN = (setAttempts) => {
    attempts.value = setAttempts || attempts.value
    if(freeze.value){
        return false
    }
    if(!setAttempts){
        attempts.value += 1
    }

    if(data.value?.attempts && data.value?.attempts>0){
        if(attempts.value == data.value.attempts){
            freeze.value = true
        }
    }




}

return { freeze, attempts, resultClass, result, evaluateFN, attemptsFN, initFN }
//export default { freeze, attempts, resultClass, result, evaluateFN, attemptsFN, initFN }


}