<template>
    <div>
        <h1>Najbolje ocijenjene igre</h1>
        <div class="container">
            <div class="filter">
                <h3>Filter</h3>
                <div class="genre-select">
                    <label for="genreSelect">Odabir žanra:</label>
                    <MultiSelect v-model="selectedGenres" display="chip" :showToggleAll="false" :options="zanrovi"
                        :optionLabel="zanr => zanr.naziv" :maxSelectedLabels="3" :placeholder="'Svi žanrovi'"
                        class="filter-item" />
                </div>
                <div class="platform-select">
                    <label for="platformSelect">Odabir platforme:</label>
                    <MultiSelect v-model="selectedPlatforms" display="chip" :showToggleAll="false" :options="platforme"
                        filter :optionLabel="platforma => platforma.naziv" :placeholder="'Sve platforme'"
                        class="filter-item" />
                </div>
                <div class="buttons">
                    <button @click="currentPage = 1, onRouteChange()">Spremi filter</button>
                    <button @click="selectedGenres = [], selectedPlatforms = [], currentPage = 1, onRouteChange()">Resetiraj
                        filter</button>
                </div>
            </div>
            {{ error }}
            <ProgressSpinner v-if="isLoading" class="spinner" />
            <Igre v-if="igre" :igre="igre" :stranica="'igreRAWG'" />
        </div>
        <Paginator v-if="!error && igre" v-model:rows="pageSize" v-model:totalRecords="count"
            :rowsPerPageOptions="[10, 20, 30, 40]" @page="onPageChange" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import MultiSelect from 'primevue/multiselect';
import axiosClient from '@/services/axiosClient';
import Igre from '@/components/Igre.vue'
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import type { IgraI } from '@/types/IgraI';
import type { ZanrI } from '@/types/ZanrI';
import type { PlatformaI } from '@/types/PlatformaI';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter();

const igre = ref<IgraI[]>();
const zanrovi = ref<ZanrI[]>([]);
const platforme = ref<PlatformaI[]>([]);
const selectedGenres = ref<ZanrI[]>([]);
const selectedPlatforms = ref<PlatformaI[]>([]);

const currentPage = ref<number>();
const pageSize = ref<number>();
const count = ref<number>(0);

const isLoading = ref(false);
const error = ref<string>();

const onPageChange = (event: any) => {
    currentPage.value = event.page + 1;
    onRouteChange();
};

const routeQuery = () => {
    const { stranica, brojIgara } = route.query;

    currentPage.value = stranica ? parseInt(stranica.toString()) : 1;
    pageSize.value = brojIgara ? parseInt(brojIgara.toString()) : 10;
}

const onRouteChange = () => {
    const newQuery = {
        stranica: currentPage.value,
        brojIgara: pageSize.value,
    };

    router.push({ query: newQuery });
    getHighRatedGames();
};

var getHighRatedGames = () => {
    let genres = selectedGenres.value.map((zanr) => zanr.id).join(',');
    let platforms = selectedPlatforms.value.map((platforma) => platforma.id).join(',');
    isLoading.value = true;

    axiosClient
        .get('rawg/najbolje_igre',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    genres: genres,
                    platforms: platforms,
                }
            })
        .then((response) => {
            const igreRAWGI: IgraRAWGI[] = response.data.results;
            igre.value = igreRAWGI.map((game) => {
                const { id, name, slug, background_image } = game;

                return { id, naziv: name, kratki_naziv: slug, slika: background_image };
            });
            count.value = response.data.count;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvaćanja igara. Molimo pokušajte kasnije.";
        });
}

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanrovi.value = response.data;
        })
        .catch((err) => {
            // error.value = "Greška prilikom dohvaćanja žanrova";
        });
};

var getAllPlatforms = () => {
    axiosClient
        .get('platforme')
        .then((response) => {
            platforme.value = response.data;
        })
        .catch((err) => {
            // error.value = "Greška prilikom dohvaćanja platforma";
        });
};

onBeforeMount(() => {
    routeQuery();
});

onMounted(() => {
    getAllGenres();
    getAllPlatforms();
    getHighRatedGames();
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

.filter {
    max-height: 290px;
}
</style>