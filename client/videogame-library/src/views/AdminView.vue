<template>
    <button @click="selectedComponment = 1">Korisnici</button>
    <button @click="selectedComponment = 2">Žanr i platforme</button>
    <Korisnici v-if="selectedComponment == 1" />
    <Zanr-i-platforme v-if="selectedComponment == 2" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Korisnici from '@/components/Korisnici.vue'
import ZanrIPlatforme from '@/components/ZanrIPlatforme.vue'

let selectedComponment = ref<number>();

</script>