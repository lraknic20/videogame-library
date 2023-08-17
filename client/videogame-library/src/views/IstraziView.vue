<template>
    <div>
        <h1>Istraži igre</h1>
        <div class="container">
            <div class="filter">
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
                <div class="dateRange">
                    <label for="dateRange">Odabir raspona datuma:</label>
                    <VueDatePicker v-model="selectedDateRange" :enable-time-picker="false" locale="hr" format="d.M.yyyy."
                        select-text="Odaberi" cancel-text="Odustani" :clearable="true" range id="dateRange" />
                </div>
                <div class="buttons">
                    <button @click="selectedGenres = [], selectedPlatforms = [], searchText = undefined, selectedDateRange = undefined,
                        currentPage = 1, onRouteChange()">Resetiraj filter</button>
                    <button @click="currentPage = 1, onRouteChange()">Spremi filter</button>
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
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import type { ZanrI } from '@/types/ZanrI';
import type { PlatformaI } from '@/types/PlatformaI';
import axiosClient from '@/services/axiosClient';
import { useRoute, useRouter } from 'vue-router'
import Igre from '@/components/Igre.vue'
import type { IgraI } from '@/types/IgraI';
import { useToast } from "vue-toastification";

const route = useRoute()
const router = useRouter();
const toast = useToast();

const igre = ref<IgraI[]>();
const zanrovi = ref<ZanrI[]>([]);
const platforme = ref<PlatformaI[]>([]);

const currentPage = ref<number>();
const pageSize = ref<number>();
const count = ref<number>(0);

const selectedGenres = ref<ZanrI[]>([]);
const selectedPlatforms = ref<PlatformaI[]>([]);
const searchText = ref<string>();

const selectedDateRange = ref();

const isLoading = ref(false);
const error = ref<string>();

const onPageChange = async (event: any) => {
    currentPage.value = event.page + 1;
    onRouteChange();
};

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
    const genres = selectedGenres.value.map((zanr) => zanr.id).join(',');
    const platforms = selectedPlatforms.value.map((platforma) => platforma.id).join(',');

    if (selectedDateRange.value) {
        if (selectedDateRange.value[0] && selectedDateRange.value[1]) {
            var minDate = selectedDateRange.value[0].toISOString().split('T')[0];
            var maxDate = selectedDateRange.value[1].toISOString().split('T')[0];
        } else {
            toast.info("Molimo odaberite početni i završni datum");
            return;
        }
    }

    isLoading.value = true;

    axiosClient
        .get('rawg/igre',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    genres: genres,
                    platforms: platforms,
                    search: searchText.value,
                    minDate: minDate,
                    maxDate: maxDate,
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
.spinner {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 50%;
}

.filter {
    max-height: 435px;
}
</style>