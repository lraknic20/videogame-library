<template>
    <div>
        <h1>Favoriti</h1>
        <div class="container">
            <div class="filter">
                <h3>Soritranje</h3>
                <Dropdown v-model="selectedSort" :options="sortOptions" optionLabel="name" optionValue="value"
                    @change="onRouteChange" id="sortSelect" class="filter-item" />
            </div>
            <ProgressSpinner v-if="isLoading" class="spinner" />
            <TabView :lazy="true" v-model:activeIndex="active" v-on:update:active-index="changeTab">
                <TabPanel header="Moji favoriti">
                    {{ error }}
                    <Igre v-if="igre" :igre="igre" :stranica="'igre'" />
                    {{ message }}
                </TabPanel>
                <TabPanel header="Svi favoriti">
                    {{ error }}
                    <Igre v-if="igre" :igre="igre" :stranica="'igre'" />
                    {{ message }}
                </TabPanel>
            </TabView>
        </div>
        <Paginator v-if="!error && igre" v-model:rows="pageSize" v-model:totalRecords="count"
            :rowsPerPageOptions="[10, 20, 30, 40]" @page="onPageChange" />
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue';
import Igre from '@/components/Igre.vue'
import axiosClient from '@/services/axiosClient';
import type { IgraI } from '@/types/IgraI';
import { useRoute, useRouter } from 'vue-router'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const igre = ref<IgraI[]>();
const currentPage = ref<number>();
const pageSize = ref<number>();
const count = ref<number>(0);
const selectedSort = ref<string>('desc');
const active = ref(0);
const isLoading = ref(false);
const error = ref<string>();
const message = ref<string>();
const sortOptions = [
    { name: 'Novije prema starijem', value: 'desc' },
    { name: 'Starije prema novijem', value: 'asc' },
];

const route = useRoute()
const router = useRouter();

const onPageChange = async (event: any) => {
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
    changeTab();
};

const changeTab = () => {
    if (active.value == 0) {
        getFavoritedGamesForUser();
    }
    if (active.value == 1) {
        getAllFavoritedGames();
    }
};

var getFavoritedGamesForUser = () => {
    error.value = '';
    igre.value = undefined;
    isLoading.value = true;
    axiosClient
        .get('favoriti/' + localStorage.getItem('id'),
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    sort: selectedSort.value
                }
            })
        .then((response) => {
            count.value = response.data.count;
            if (response.data.games.length)
                igre.value = response.data.games;
            else message.value = "Nemate favorizirane igre";
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvaćanja favorita. Molimo pokušajte kasnije.";
        });
}

var getAllFavoritedGames = () => {
    error.value = '';
    isLoading.value = true;
    axiosClient
        .get('favoriti/',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    sort: selectedSort.value
                }
            })
        .then((response) => {
            count.value = response.data.count;
            if (response.data.games.length)
                igre.value = response.data.games;
            else message.value = "Ne postoje favorizirane igre";
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvaćanja favorita. Molimo pokušajte kasnije.";
        });
}

onBeforeMount(() => {
    routeQuery();
});

onMounted(() => {
    getFavoritedGamesForUser();
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
	max-height: 130px;
}
</style>