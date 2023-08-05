<template>
    <button @click="currentPage=1, changeSelection('UserFavorites')">Moji Favoriti</button>
    <button @click="currentPage=1, changeSelection('AllFavorites')">Svi favoriti</button>
    <select v-model.number="pageSize" @change="changeSelection(curentlySelected)" id="pageSizeSelect">
        <option value="10" selected>10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
    </select>
    <select v-model="sort" @change="changeSelection(curentlySelected)" id="sortSelect">
        <option value="desc" selected>Novije prema starijem</option>
        <option value="asc">Starije prema novijem</option>
    </select>
    <Igre :igre="igre" />
    <vue-awesome-paginate :total-items="count" :items-per-page="pageSize" :max-pages-shown="5" v-model="currentPage"
        :on-click="onRouteChange" />
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue';
import Igre from '@/components/Igre.vue'
import axiosClient from '@/services/axiosClient';
import type { IgraI } from '@/types/IgraI';
import { useRoute, useRouter } from 'vue-router'

let igre = ref<IgraI[]>([]);
let currentPage = ref<number>();
let pageSize = ref<number>();
let count = ref<number>(0);
let curentlySelected = ref<string>('UserFavorites');
let sort = ref<string>('desc');

const route = useRoute()
const router = useRouter();

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
    changeSelection(curentlySelected.value);
};

const changeSelection = (selection: string) => {
    if (selection == 'UserFavorites') {
        getFavoritedGamesForUser();
        curentlySelected.value = 'UserFavorites';
    }
    if (selection == 'AllFavorites') {
        getAllFavoritedGames();
        curentlySelected.value = 'AllFavorites';
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