import success from '../../assets/uisound/notification_decorative-01.mp3'
import nonsuccess from '../../assets/uisound/error_001.mp3'




const freeze = ref(false)
const attempts = ref(0)
const resultClass = ref('')

const evaluateFN = (oda, data, blockindex, input, result, mute) => {
    // Freeze block if attempts limit
    /*
    if(props.data.attempts>0 && (attempts.value >= props.data.attempts)){
        freeze.value = true
    }
    */
    /*

    //ShowResult
    if(props.data.showResult && result.value!=null){
        //Class
        showResultClass.value = result.value ? 'border-2 border-success' : 'border-2 border-primary'
        //Sound
        if(!mute){
            if(result.value){
                new Howl({ src: [sound3], rate: 1, volume: 0.8, autoplay:true })
            } else {
                new Howl({ src: [sound4], rate: 1, volume: 0.6, autoplay:true })
            }
        }
        //Freeze
        if(result.value){
            ShapesAnimation.playkeep(block.value.targetDomElement, ['positive'])
            freeze.value = true
        }
    }
    */


    //#SAVE
    //oda.setInput(props.blockindex, result.value, input.value, props.data)
}

const attemptsFN = (data) => {
    
    if(data?.attempts){
        if(data.attempts>0 && (attempts.value >= data.attempts)){
            freeze.value = true
        } else {
            attempts.value += 1
        }
    } else {
        attempts.value += 1
    }
}

export default { freeze, attempts, resultClass, evaluateFN, attemptsFN }