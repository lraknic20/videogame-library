<template>
    <div>
        {{ error }}
        <ProgressSpinner v-if="isLoading" class="spinner" />
        <Igra :igra="igra" />
        <RecenzijaKartica v-if="igra && !error && gameReleased()" :igra="igra" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import axiosClient from '@/services/axiosClient';
import { useRoute } from 'vue-router'
import RecenzijaKartica from '@/components/RecenzijaKartica.vue';
import Igra from '@/components/Igra.vue'
import type { IgraI } from '@/types/IgraI';

const route = useRoute();

const igraRAWG = ref<IgraRAWGI>();
const igra = ref<IgraI>();
const error = ref<string>();
const isLoading = ref(false);

const getGame = () => {
    isLoading.value = true;
    axiosClient
        .get('/rawg/igre/' + route.params.id)
        .then((response) => {
            igraRAWG.value = response.data;
            findRequirements();
            if (igraRAWG.value) {
                igra.value = {
                    id: igraRAWG.value.id,
                    naziv: igraRAWG.value.name,
                    kratki_naziv: igraRAWG.value.slug,
                    opis: igraRAWG.value.description,
                    slika: igraRAWG.value.background_image,
                    objavljeno: igraRAWG.value.tba,
                    datum_izlaska: igraRAWG.value.released,
                    stranica: igraRAWG.value.website,
                    metacritic: igraRAWG.value.metacritic,
                    minimalni_zahtjevi: igraRAWG.value.minimum_requirements,
                    preporuceni_zahtjevi: igraRAWG.value.recommended_requirements,
                    zanrovi: igraRAWG.value.genres.map((genre) => ({
                        id: genre.id,
                        naziv: genre.name,
                        broj_igara: genre.games_count
                    })),
                    platforme: igraRAWG.value.platforms.map((platform) => ({
                        id: platform.platform.id,
                        naziv: platform.platform.name,
                        broj_igara: platform.platform.games_count
                    })),
                    izdavaci: igraRAWG.value.publishers.map((publisher) => ({
                        id: publisher.id,
                        naziv: publisher.name,
                        kratki_naziv: publisher.slug,
                        broj_igara: publisher.games_count
                    })),
                };
            }
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvaćanja igre. Molimo pokušajte kasnije.";
        });
}

const gameReleased = () => {
    if (igra.value?.datum_izlaska) {
        return new Date(igra.value.datum_izlaska) < new Date();
    }
}

const findRequirements = () => {
    if (igraRAWG.value?.platforms) {
        const platform = igraRAWG.value.platforms.find((data) => data.platform.name === 'PC');
        if (platform?.requirements) {
            igraRAWG.value.minimum_requirements = platform.requirements.minimum;
            igraRAWG.value.recommended_requirements = platform.requirements.recommended;
        }
    }
};

onMounted(getGame);
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