<template>
    <div class="filter">
        <label for="genreSelect">Odabir žanra:</label>
        <MultiSelect v-model="selectedGenres" display="chip" :showToggleAll="false" :options="zanrovi"
            :optionLabel="zanr => zanr.naziv" :maxSelectedLabels="3" :placeholder="'Svi žanrovi'" />
        <label for="platformSelect">Odabir platforme:</label>
        <MultiSelect v-model="selectedPlatforms" display="chip" :showToggleAll="false" :options="platforme" filter
            :optionLabel="platforma => platforma.naziv" :placeholder="'Sve platforme'" />
        <label for="search">Pretraživanje:</label>
        <input v-model="searchText" id="search">
        <VueDatePicker v-model="minSelectedDate" class="date-picker-container" :enable-time-picker="false" locale="hr"
            format="d.M.yyyy" select-text="Odaberi" cancel-text="Odustani" :clearable="false" />
        <VueDatePicker v-model="maxSelectedDate" class="date-picker-container" :enable-time-picker="false" locale="hr"
            format="d.M.yyyy" select-text="Odaberi" cancel-text="Odustani" :clearable="false" :min-date=minSelectedDate />
        <label for="pageSizeSelect">Broj igara na stranici:</label>
        <select v-model.number="pageSize" @change="getGames" id="pageSizeSelect">
            <option value="10" selected>10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
        </select>
        <button @click="currentPage = 1, onRouteChange()">Spremi filter</button>
        <button @click="selectedGenres = [], selectedPlatforms = [], searchText = undefined,
            minSelectedDate = undefined, maxSelectedDate = new Date(),
            currentPage = 1, onRouteChange()">Resetiraj
            filter</button>
    </div>
    {{ error }}
    <Igre :igre="igre" />
    <vue-awesome-paginate :total-items="count" :items-per-page="pageSize" :max-pages-shown="5" v-model="currentPage"
        :on-click="onRouteChange" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import type { ZanrI } from '@/types/ZanrI';
import type { PlatformaI } from '@/types/PlatformaI';
import axiosClient from '@/services/axiosClient';
import { useRoute, useRouter } from 'vue-router'
import MultiSelect from 'primevue/multiselect';
import Igre from '@/components/Igre.vue'
import type { IgraI } from '@/types/IgraI';

const route = useRoute()
const router = useRouter();

let igre = ref<IgraI[]>([]);
let zanrovi = ref<ZanrI[]>([]);
let platforme = ref<PlatformaI[]>([]);

let currentPage = ref<number>();
let pageSize = ref<number>();
let count = ref<number>(0);

let selectedGenres = ref<ZanrI[]>([]);
let selectedPlatforms = ref<PlatformaI[]>([]);
let searchText = ref<string>();

let minSelectedDate = ref<Date>();
let maxSelectedDate = ref<Date>(new Date());

let error = ref<string>();

const routeQuery = () => {
    const { stranica, brojIgara, pretrazivanje } = route.query;

    currentPage.value = stranica ? parseInt(stranica.toString()) : 1;
    pageSize.value = brojIgara ? parseInt(brojIgara.toString()) : 10;
    searchText.value = pretrazivanje ? pretrazivanje.toString() : '';
}

const onRouteChange = () => {
    const newQuery = {
        stranica: currentPage.value,
        brojIgara: pageSize.value,
        ...(searchText.value != '' ? { pretrazivanje: searchText.value } : {}),
    };

    router.push({ query: newQuery });
    getGames();
};

var getGames = () => {
    let genres = selectedGenres.value.map((zanr) => zanr.id).join(',');
    let platforms = selectedPlatforms.value.map((platforma) => platforma.id).join(',');

    axiosClient
        .get('rawg/igre',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    genres: genres,
                    platforms: platforms,
                    search: searchText.value,
                    ...(minSelectedDate.value != undefined ? { minDate: minSelectedDate.value.toISOString().split('T')[0] } : {}),
                    maxDate: maxSelectedDate.value.toISOString().split('T')[0],
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
            error.value = "Greška prilikom dohvaćanja igara";
        });
}

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanrovi.value = response.data;
        })
        .catch((err) => {
            error.value = "Greška prilikom dohvaćanja žanrova";
        });
};

var getAllPlatforms = () => {
    axiosClient
        .get('platforme')
        .then((response) => {
            platforme.value = response.data;
        })
        .catch((err) => {
            error.value = "Greška prilikom dohvaćanja platforma";
        });
};

onBeforeMount(() => {
    routeQuery();
});

onMounted(() => {
    getAllGenres();
    getAllPlatforms();
    getGames();
});
</script>

<style scoped>
.date-picker-container {
    width: 20%;
    margin-bottom: 2%;
}

.date-picker-container {
    width: 20%;
    margin-bottom: 2%;
}

.game-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.game-item {
    width: 40%;
    margin-bottom: 20px;
    text-align: center;
}

.game-picture {
    width: 70%;
    max-height: 200px;
    object-fit: cover;
}

.game-name {
    font-size: 16px;
}
</style>