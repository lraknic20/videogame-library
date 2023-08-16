<template>
    <div>
        <select v-model="sort" @change="changeTab" id="sortSelect">
            <option value="desc" selected>Novije prema starijem</option>
            <option value="asc">Starije prema novijem</option>
        </select>
        <TabView :lazy="true" v-model:activeIndex="active" v-on:update:active-index="changeTab">
            <TabPanel header="Moji favoriti">
                <Igre :igre="igre" :stranica="'igre'" />
            </TabPanel>
            <TabPanel header="Svi favoriti">
                <Igre :igre="igre" :stranica="'igre'" />
            </TabPanel>
        </TabView>
        <Paginator v-model:rows="pageSize" v-model:totalRecords="count" :rowsPerPageOptions="[10, 20, 30, 40]"
            @page="onPageChange" />
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

let igre = ref<IgraI[]>([]);
let currentPage = ref<number>();
let pageSize = ref<number>();
let count = ref<number>(0);
let sort = ref<string>('desc');
const active = ref(0);

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
    axiosClient
        .get('favoriti/' + localStorage.getItem('id'),
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    sort: sort.value
                }
            })
        .then((response) => {
            count.value = response.data.count;
            igre.value = response.data.games;
        })
        .catch((err) => {
            // error.value = "Greška prilikom dohvaćanja igara";
        });
}

var getAllFavoritedGames = () => {
    axiosClient
        .get('favoriti/',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    sort: sort.value
                }
            })
        .then((response) => {
            count.value = response.data.count;
            igre.value = response.data.games;
        })
        .catch((err) => {
            // error.value = "Greška prilikom dohvaćanja igara";
        });
}

onBeforeMount(() => {
    routeQuery();
});

onMounted(() => {
    getFavoritedGamesForUser();
});
</script>