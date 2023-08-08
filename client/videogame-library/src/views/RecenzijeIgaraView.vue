<template>
    <div class="filter">
        <label for="genreSelect">Odabir žanra:</label>
        <MultiSelect v-model="selectedGenres" display="chip" :showToggleAll="false" :options="zanrovi"
            :optionLabel="zanr => zanr.naziv" :maxSelectedLabels="3" :placeholder="'Svi žanrovi'" />
        <label for="platformSelect">Odabir platforme:</label>
        <MultiSelect v-model="selectedPlatforms" display="chip" :showToggleAll="false" :options="platforme" filter
            :optionLabel="platforma => platforma.naziv" :placeholder="'Sve platforme'" />
        <label for="publisherSelect">Odabir izdavača:</label>
        <MultiSelect v-model="selectedPublishers" display="chip" :showToggleAll="false" :options="izdavaci" filter
            :optionLabel="izdavac => izdavac.naziv" :placeholder="'Svi izdavači'" />
        <label for="search">Pretraživanje:</label>
        <input v-model="searchText" id="search">
        <label for="rating">Broj zvjezdica:</label>
        <Rating class="rating" v-model="selectedRating" :cancel="true" id="rating" />
        <label for="calendar">Raspon po godinama izlaska igara:</label>
        <Calendar v-model="years" view="year" dateFormat="yy." selectionMode="range" :manualInput="false" id="calendar" />
        <button @click="currentPage = 1, onRouteChange()">Spremi filter</button>
        <button @click="selectedGenres = [], selectedPlatforms = [], selectedPublishers = [], searchText = undefined,
            currentPage = 1, selectedRating = undefined, years = undefined, onRouteChange()">Resetiraj filter</button>
    </div>
    <select v-model="sort" @change="onRouteChange" id="sortSelect">
        <option value="desc" selected>Novije prema starijem</option>
        <option value="asc">Starije prema novijem</option>
    </select>
    <select v-model.number="pageSize" @change="getReviews" id="pageSizeSelect">
        <option value="10" selected>10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
    </select>
    <ListaRecenzija :reviews="recenzije" />
    <p v-if="!error && recenzije.length == 0">Recenzije ne postoje</p>
    <span>{{ error }}</span>
    <vue-awesome-paginate v-if="recenzije.length != 0" :total-items="count" :items-per-page="pageSize" :max-pages-shown="5"
        v-model="currentPage" :on-click="onRouteChange" />
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import type { RecenzijaI } from '@/types/RecenzijaI';
import type { ZanrI } from '@/types/ZanrI';
import type { PlatformaI } from '@/types/PlatformaI';
import type { IzdavaciI } from '@/types/IzdavaciI';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Rating from 'primevue/rating';
import moment from 'moment';
import ListaRecenzija from '@/components/ListaRecenzija.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter();

const recenzije = ref<RecenzijaI[]>([]);
const zanrovi = ref<ZanrI[]>([]);
const platforme = ref<PlatformaI[]>([]);
const izdavaci = ref<IzdavaciI[]>([]);
const error = ref<string>('');

let selectedGenres = ref<ZanrI[]>([]);
let selectedPlatforms = ref<PlatformaI[]>([]);
let selectedPublishers = ref<IzdavaciI[]>([]);
let sort = ref<string>('desc');

let currentPage = ref<number>();
let pageSize = ref<number>();
let count = ref<number>(0);

let searchText = ref<string>();
let years = ref<Date[]>();
let selectedRating = ref<number>();

const routeQuery = () => {
    const { stranica, brojIgara, pretrazivanje, sortiranje, ocjena } = route.query;

    currentPage.value = stranica ? Number(stranica) : 1;
    pageSize.value = brojIgara ? Number(brojIgara) : 10;
    searchText.value = pretrazivanje ? pretrazivanje.toString() : '';
    sort.value = sortiranje ? sortiranje.toString() : 'desc';
    selectedRating.value = ocjena ? Number(ocjena) : undefined;
}

const onRouteChange = () => {
    const newQuery = {
        stranica: currentPage.value,
        brojIgara: pageSize.value,
        ...(searchText.value != '' ? { pretrazivanje: searchText.value } : {}),
        sortiranje: sort.value,
        ...(selectedRating.value != undefined ? { ocjena: selectedRating.value } : {}),
    };

    router.push({ query: newQuery });
    getReviews();
};

var getReviews = () => {
    let yearMin;
    let yearMax;
    if (years.value && years.value[0] && years.value[1]) {
        yearMin = moment(years.value[0]).format('yyyy');
        yearMax = moment(years.value[1]).format('yyyy');
    }
    let genres = selectedGenres.value.map((zanr) => zanr.id).join(',');
    let platforms = selectedPlatforms.value.map((platforma) => platforma.id).join(',');
    let publishers = selectedPublishers.value.map((izdavac) => izdavac.id).join(',');

    axiosClient
        .get('recenzije',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    zanrovi: genres,
                    platforme: platforms,
                    izdavaci: publishers,
                    search: searchText.value,
                    yearMin: yearMin,
                    yearMax: yearMax,
                    sort: sort.value,
                    rating: selectedRating.value
                }
            })
        .then((response) => {
            recenzije.value = response.data.recenzije;
            count.value = response.data.count;
        })
        .catch((err) => {
            error.value += "Greška prilikom dohvaćanja igara";
        });
}

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanrovi.value = response.data;
        })
        .catch((err) => {
            error.value += "Greška prilikom dohvaćanja žanrova";
        });
};

var getAllPlatforms = () => {
    axiosClient
        .get('platforme')
        .then((response) => {
            platforme.value = response.data;
        })
        .catch((err) => {
            error.value += "Greška prilikom dohvaćanja platforma";
        });
};

var getAllPublishers = () => {
    axiosClient
        .get('izdavaci')
        .then((response) => {
            izdavaci.value = response.data;
        })
        .catch((err) => {
            error.value += "Greška prilikom dohvaćanja platforma";
        });
};

onBeforeMount(() => {
    routeQuery();
});

onMounted(() => {
    getReviews();
    getAllGenres();
    getAllPlatforms();
    getAllPublishers();
});
</script>

<style scoped></style>