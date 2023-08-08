<template>
    <Igra :igra="igra" />
    {{ error }}
    <RecenzijaKartica v-if="igra && !error" :igra="igra" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import axiosClient from '@/services/axiosClient';
import Igra from '@/components/Igra.vue'
import RecenzijaKartica from '@/components/RecenzijaKartica.vue';
import type { IgraI } from '@/types/IgraI';

const route = useRoute();
const igra = ref<IgraI>();
const error = ref<string>();

const getGame = () => {
    axiosClient
        .get('/igre/' + route.params.id)
        .then((response) => {
            igra.value = response.data;
        })
        .catch((err) => {
            error.value = "Greška prilikom dohvaćanja igre";
            console.log(err);
        });
};

onMounted(() => {
    getGame();
});
</script>