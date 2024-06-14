<template>
    <div>
        <h1>Recenzije igara</h1>
        <div class="container">
            <div class="filter">
                <h3>Soritranje</h3>
                <Dropdown v-model="selectedSort" :options="sortOptions" optionLabel="name" optionValue="value"
                    @change="onRouteChange" id="sortSelect" class="filter-item" />
                <h3>Filter</h3>
                <div class="search">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="searchText" class="filter-item" placeholder="Pretraživanje" />
                    </span>
                </div>
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
                <div class="publisher-select">
                    <label for="publisherSelect">Odabir izdavača:</label>
                    <MultiSelect v-model="selectedPublishers" display="chip" :showToggleAll="false" :options="izdavaci"
                        filter :optionLabel="izdavac => izdavac.naziv" :placeholder="'Svi izdavači'" class="filter-item" />
                </div>
                <div class="rating">
                    <label for="rating">Broj zvjezdica:</label>
                    <Rating class="rating" v-model="selectedRating" :cancel="true" id="rating" />
                </div>
                <div class="dateRange">
                    <label for="calendar">Raspon godina izlaska igara:</label>
                    <Calendar v-model="years" view="year" dateFormat="yy." selectionMode="range" :manualInput="false"
                        id="calendar" class="filter-item" />
                </div>
                <div class="buttons">
                    <Transition>
                        <div v-if="showReset">
                            <Button
                                @click="selectedGenres = [], selectedPlatforms = [], selectedPublishers = [], searchText = undefined,
                                    currentPage = 1, selectedRating = undefined, years = undefined, onRouteChange(), showReset = false"
                                class="reset-button" label="Resetiraj filter" size="small" severity="secondary" />
                        </div>
                    </Transition>
                    <Button @click="currentPage = 1, onRouteChange(), showReset = true" class="save-button"
                        label="Spremi filter" size="small" />
                </div>
            </div>
            {{ error }}
            <ListaRecenzija v-if="recenzije" :reviews="recenzije" />
            <ProgressSpinner v-if="isLoading" class="spinner" />
        </div>
        <Paginator v-if="!error && recenzije" v-model:rows="pageSize" v-model:totalRecords="count"
            :rowsPerPageOptions="[5, 10, 15, 20, 30, 40]" @page="onPageChange" />
    </div>
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

const recenzije = ref<RecenzijaI[]>();
const zanrovi = ref<ZanrI[]>([]);
const platforme = ref<PlatformaI[]>([]);
const izdavaci = ref<IzdavaciI[]>([]);
const showReset = ref(false);
const isLoading = ref(false);
const error = ref<string>('');

const selectedGenres = ref<ZanrI[]>([]);
const selectedPlatforms = ref<PlatformaI[]>([]);
const selectedPublishers = ref<IzdavaciI[]>([]);
const selectedSort = ref();
const sortOptions = [
    { name: 'Novije prema starijem', value: 'desc' },
    { name: 'Starije prema novijem', value: 'asc' },
];

const currentPage = ref<number>();
const pageSize = ref<number>();
const count = ref<number>(0);

const searchText = ref<string>();
const years = ref<Date[]>();
const selectedRating = ref<number>();

const onPageChange = async (event: any) => {
    currentPage.value = event.page + 1;
    onRouteChange();
};

const routeQuery = () => {
    const { stranica, brojIgara, pretrazivanje, sortiranje, ocjena } = route.query;

    currentPage.value = stranica ? Number(stranica) : 1;
    pageSize.value = brojIgara ? Number(brojIgara) : 5;
    searchText.value = pretrazivanje ? pretrazivanje.toString() : '';
    selectedSort.value = sortiranje ? sortiranje.toString() : 'desc';
    selectedRating.value = ocjena ? Number(ocjena) : undefined;
}

const onRouteChange = () => {
    const newQuery = {
        stranica: currentPage.value,
        brojIgara: pageSize.value,
        ...(searchText.value != '' ? { pretrazivanje: searchText.value } : {}),
        sortiranje: selectedSort.value,
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
    error.value = '';
    isLoading.value = true;

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
                    sort: selectedSort.value,
                    rating: selectedRating.value
                }
            })
        .then((response) => {
            recenzije.value = response.data.recenzije;
            count.value = response.data.count;
            if (response.data.count == 0) {
                error.value = "Ne postoje recenzije koje zadovoljavaju odabrane filtere";
            }
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvaćanja recenzija. Molimo pokušajte kasnije.";
        });
}

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanrovi.value = response.data;
        })
        .catch((err) => {
            console.log("Greška prilikom dohvaćanja žanrova");
        });
};

var getAllPlatforms = () => {
    axiosClient
        .get('platforme')
        .then((response) => {
            platforme.value = response.data;
        })
        .catch((err) => {
            console.log("Greška prilikom dohvaćanja platforma");
        });
};

var getAllPublishers = () => {
    axiosClient
        .get('izdavaci')
        .then((response) => {
            izdavaci.value = response.data;
        })
        .catch((err) => {
            console.log("Greška prilikom dohvaćanja platforma");
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

<style scoped>
.spinner {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 50%;
}

.filter {
    max-height: 690px;
    position: relative;
    top: 20px;
}
</style>