<template>
    <div>
        {{ error }}
        <ProgressSpinner v-if="isLoading" class="spinner" />
        <Igra :igra="igra" />
        <RecenzijaKartica v-if="igra && !error" :igra="igra" />
    </div>
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
const isLoading = ref(false);

const getGame = () => {
    isLoading.value = true;
    axiosClient
        .get('/igre/' + route.params.id)
        .then((response) => {
            igra.value = response.data;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvaćanja igre. Molimo pokušajte kasnije.";
        });
};

onMounted(() => {
    getGame();
});
</script>

<style scoped>
.spinner {
	position: fixed;
	left: 0;
	right: 0;
	top: 50%;
	bottom: 50%;
}
</style>