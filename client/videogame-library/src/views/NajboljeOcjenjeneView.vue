<template>
    <label for="genreSelect">Odabir žanra:</label>
    <MultiSelect v-model="selectedGenres" display="chip" :showToggleAll="false" :options="zanrovi"
        :optionLabel="zanr => zanr.naziv" :maxSelectedLabels="3" :placeholder="'Svi žanrovi'" />
    <label for="platformSelect">Odabir platforme:</label>
    <MultiSelect v-model="selectedPlatforms" display="chip" :showToggleAll="false" :options="platforme" filter
        :optionLabel="platforma => platforma.naziv" :placeholder="'Sve platforme'" />
    <button @click="currentPage = 1, onRouteChange()">Spremi filter</button>
    <button @click="selectedGenres = [], selectedPlatforms = [], currentPage = 1, onRouteChange()">Resetiraj filter</button>
    <Igre :igre="igre" :stranica="'igreRAWG'" />
    <Paginator v-model:rows="pageSize" v-model:totalRecords="count" :rowsPerPageOptions="[10, 20, 30, 40]"
        @page="onPageChange" />
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

const igre = ref<IgraI[]>([]);
const zanrovi = ref<ZanrI[]>([]);
const platforme = ref<PlatformaI[]>([]);
const selectedGenres = ref<ZanrI[]>([]);
const selectedPlatforms = ref<PlatformaI[]>([]);

const currentPage = ref<number>();
const pageSize = ref<number>();
const count = ref<number>(0);

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
        })
        .catch((err) => {
            // error.value = "Greška prilikom dohvaćanja igara";
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