<template>
    <div v-if="izdavac" class="publisher-details">
        <div class="publisher-card">
            <div class="publisher-details">
                <h2 class="publisher-name">{{ izdavac.name }}</h2>
                <div v-html="izdavac.description" class="publisher-description"></div>
                <p class="publisher-games-count">Broj igara: {{ izdavac.games_count }}</p>
            </div>
        </div>
    </div>
    {{ error }}
    <Igre :igre="igre" />
    <vue-awesome-paginate v-if="igre" :total-items="count" :items-per-page="pageSize" :max-pages-shown="5"
        v-model="currentPage" :on-click="getGamesForPublisher" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { publishers, IgraRAWGI } from '@/types/IgreRAWGI';
import axiosClient from '@/services/axiosClient';
import { useRoute } from 'vue-router'
import Igre from '@/components/Igre.vue'
import type { IgraI } from '@/types/IgraI';

const route = useRoute();

let izdavac = ref<publishers>();
let igre = ref<IgraI[]>([]);
let error = ref<string>();

let currentPage = ref<number>(1);
let pageSize = ref<number>(10);
let count = ref<number>(0);

var getPublisher = () => {
    axiosClient
        .get('rawg/izdavaci/' + route.params.id)
        .then((response) => {
            izdavac.value = response.data;
        })
        .catch((err) => {
            error.value = "Greška prilikom dohvaćanja izdavača";
        });
}

var getGamesForPublisher = () => {
    axiosClient
        .get('rawg/igre',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                    publishers: route.params.id
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

onMounted(() => {
    getPublisher();
    getGamesForPublisher();
});
</script>

<style scoped>
.publisher-card {
    display: flex;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 16px;
    margin: 10px;
}

.publisher-details {
    flex: 1;
}

.publisher-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
}

.publisher-description {
    font-size: 16px;
    margin-bottom: 8px;
}

.publisher-games-count {
    font-size: 14px;
    color: #888;
}
</style>