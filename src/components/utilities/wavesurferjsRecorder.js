/**
 * Record audio from the microphone, render a waveform and download the audio.
 */

import BasePlugin from 'wavesurfer.js/dist/base-plugin.js'
import { createFFmpeg } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });
await ffmpeg.load();
class RecordPlugin extends BasePlugin {
    constructor() {
        super(...arguments);
        this.mediaRecorder = null;
        this.recordedUrl = '';
    }
    static create(options) {
        return new RecordPlugin(options || {});
    }
    blobToBase64 = async (blob) => {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
    }
    convertWebmToMp3 = async (webmData) => {
        ffmpeg.FS('writeFile', 'input.webm', new Uint8Array(webmData));
        await ffmpeg.run('-i', 'input.webm', 'output.mp3');
        const mp3Data = ffmpeg.FS('readFile', 'output.mp3');
        const mp3Base64 = btoa(String.fromCharCode(...new Uint8Array(mp3Data.buffer)));
        return mp3Base64;
      }
    _arrayBufferToBase64 = ( buffer ) => {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }
    convertBase64Mp3ToWav = async (base64Mp3) => {        
        const mp3Data = atob(base64Mp3);
        ffmpeg.FS('writeFile', 'input.mp3', new Uint8Array([...mp3Data].map((c) => c.charCodeAt(0))));
        await ffmpeg.run('-i', 'input.mp3', 'output.wav');
        const wavData = ffmpeg.FS('readFile', 'output.wav');
        // Convert the WAV binary data to Base64 in smaller segments
        const wavArray = new Uint8Array(wavData.buffer);
        const chunkSize = 8192; // Set the desired chunk size
        let base64Wav = '';
        let offset = 0;
        while (offset < wavArray.length) {
            const chunk = wavArray.subarray(offset, offset + chunkSize);
            const base64Chunk = btoa(String.fromCharCode(...chunk));
            base64Wav += base64Chunk;
            offset += chunkSize;
        }
        return base64Wav;
    }
      
      loadBlob = async (data) => {
        const blob = new Blob(data, { type: 'audio/webm' });

        const blobArray = await blob.arrayBuffer();
        const mp3Base64 = await this.convertWebmToMp3(blobArray);
        const wavBase64 = await this.convertBase64Mp3ToWav(mp3Base64)
        const opusBase64 = await this.blobToBase64(blob)

        this.recordedUrl = `data:audio/mp3;base64,${mp3Base64}`;

        this.wavesurfer?.load(this.recordedUrl);
      

        console.log(
            {
                text: "Grandfather",
                recording: opusBase64

            }
        )

        this.wavesurfer?.on('ready', () => {

/*
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = this.recordedUrl;
            a.download = "Audio.mp3";
            document.body.appendChild(a);
            a.click();
            */
    });


      }
    render(stream) {
        if (!this.wavesurfer)
            return () => undefined;
        const container = this.wavesurfer.getWrapper();
        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        canvas.style.zIndex = '10';
        container.appendChild(canvas);
        const canvasCtx = canvas.getContext('2d');
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        let animationId;
        const drawWaveform = () => {
            if (!canvasCtx)
                return;
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
            canvasCtx.lineWidth = this.options.lineWidth || 2;
            const color = this.options.realtimeWaveColor || this.wavesurfer?.options.waveColor || '';
            canvasCtx.strokeStyle = Array.isArray(color) ? color[0] : color;
            canvasCtx.beginPath();
            const sliceWidth = (canvas.width * 1.0) / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;
                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                }
                else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
            animationId = requestAnimationFrame(drawWaveform);
        };
        drawWaveform();
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (source) {
                source.disconnect();
                source.mediaStream.getTracks().forEach((track) => track.stop());
            }
            if (audioContext) {
                audioContext.close();
            }
            canvas?.remove();
        };
    }
    cleanUp() {
        this.stopRecording();
        this.wavesurfer?.empty();
        if (this.recordedUrl) {
            URL.revokeObjectURL(this.recordedUrl);
            this.recordedUrl = '';
        }
    }
    async startRecording() {
        this.cleanUp();
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        catch (err) {
            throw new Error('Error accessing the microphone: ' + err.message);
        }
        const onStop = this.render(stream);
        const mediaRecorder = new MediaRecorder(stream);
        const recordedChunks = [];
        mediaRecorder.addEventListener('dataavailable', (event) => {
            //if (event.data.size > 0) {
                recordedChunks.push(event.data);
            //}
        });
        mediaRecorder.addEventListener('stop', () => {
            onStop();
            this.loadBlob(recordedChunks);
            this.emit('stopRecording');
        });
        mediaRecorder.start();
        this.emit('startRecording');
        this.mediaRecorder = mediaRecorder;
    }
    isRecording() {
        return this.mediaRecorder?.state === 'recording';
    }
    stopRecording() {
        if (this.isRecording()) {
            this.mediaRecorder?.stop();
        }
    }
    getRecordedUrl() {
        return this.recordedUrl;
    }
    destroy() {
        super.destroy();
        this.cleanUp();
    }
}
export default RecordPlugin;
