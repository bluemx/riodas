import MicRecorder from 'mic-recorder-to-mp3'
import {ref} from 'vue'
import toWav from 'audiobuffer-to-wav';
import { decode } from "base64-arraybuffer";

export function useFN() {


const isrecording = ref(false)
const haspermission = ref(false)

const recorder = new MicRecorder({
    bitRate: 128
  });


const checkPermission = () => {
    navigator.permissions.query(
        { name: 'microphone' }
    ).then(function(permissionStatus){
        permissionSet(permissionStatus)
        permissionStatus.onchange = function(){
            permissionSet(permissionStatus)
        }
    })
}
const permissionSet = (permissionStatus) => {
    if(permissionStatus.state == 'granted'){
        haspermission.value = true
    } else {
        haspermission.value = false
    }
}
const startRecord = () => {

    if(!haspermission){
        checkPermission()
        return false
    }
    isrecording.value = true
    recorder.start().then(() => {
        // something else
    }).catch((e) => {
        console.error(e);
    });

}

const stopRecord = () => {
    return new Promise((resolve, reject) => {
        if(!haspermission.value){
            checkPermission()
            reject('No permission')
            return
        }
        isrecording.value = false
        recorder.stop().getMp3().then(([buffer, blob]) => {
            const file = new File(buffer, 'recording.mp3', {
              type: blob.type,
              lastModified: Date.now()
            });
            const fileurl = URL.createObjectURL(file)
            resolve({
                file: fileurl,
                blob: blob
            })
          }).catch((e) => {
            console.error(e);
            reject(e);
          });

    })
}


const tob64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        }
        reader.readAsDataURL(blob);
    }).catch((e)=>{
        console.error(e)
        reject(e)
    })
}




const toWAV = async (mp3Blob) => {
    const arrayBuffer = await mp3Blob.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const wavArrayBuffer = toWav(audioBuffer);
    const wavBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' });
    return tob64(wavBlob);
  }


const b64toBlob = async (b64) => {
    const buffer = await decode(b64)
    //return buffer

    let base64Audio = b64
    let binary = atob(base64Audio.split(',')[1]); // remove the base64 header
    let array = [];
    for(let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    let arrayBuffer = new Uint8Array(array).buffer; // create an ArrayBuffer from the byte array
    let blob = new Blob([arrayBuffer], {type: 'audio/mpeg'}); // create a blob from the ArrayBuffer
    return blob
}

return {
    startRecord, stopRecord, checkPermission, tob64, toWAV, b64toBlob,
    haspermission, isrecording, 
}
}