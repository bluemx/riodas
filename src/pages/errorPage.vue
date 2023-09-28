<script setup>
import { useOda } from '../store/oda';
const oda = useOda()
</script>
<template>
<div class="oda-screen">
    <ScreenTransition></ScreenTransition>
    <div class="text-center text-rose-600">
        Ocurrió un error al cargar la oda <strong v-if="oda.odaID">{{ oda.odaID }}</strong>
    </div>
    <div class="text-center">
        Verifica tus datos y conexión a internet.
    </div>
</div>
</template>