<template>
    <button class="btn text-xs" @click="autosolve">Autoresolver</button>
</template>
<script setup>
const currentInstance = getCurrentInstance()

const autosolve = () => {

    currentInstance.appContext.config.globalProperties.emitter.emit('autosolve')
    
}

</script>