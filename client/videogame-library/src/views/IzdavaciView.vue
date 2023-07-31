<template>
    <h2>Izdavači</h2>
    {{ error }}
    <div class="publisher-container">
        <div v-for="izdavac in izdavaci" :key="izdavac.id" class="publisher-item">
            <RouterLink :to="`/izdavaci/${izdavac.slug}`">
                <img :src="izdavac.image_background" :alt="izdavac.name" class="publisher-picture" />
                <p class="publisher-name">{{ izdavac.name }}</p>
            </RouterLink>
        </div>
    </div>
    <vue-awesome-paginate :total-items="count" :items-per-page="pageSize" :max-pages-shown="5" v-model="currentPage"
        :on-click="getPublishers" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IzdavacRAWGI } from '@/types/IgreRAWGI';
import axiosClient from '@/services/axiosClient';

let izdavaci = ref<IzdavacRAWGI[]>([]);
let currentPage = ref<number>(1);
let pageSize = ref<number>(10);
let count = ref<number>(0);
let error = ref<string>();


var getPublishers = () => {
    axiosClient
        .get('rawg/izdavaci',
            {
                params: {
                    page: currentPage.value,
                    pageSize: pageSize.value,
                }
            })
        .then((response) => {
            izdavaci.value = response.data.results;
            count.value = response.data.count;
        })
        .catch((err) => {
            //error.value = "Greška prilikom dohvaćanja izdavača";
        });
}

onMounted(() => {
    getPublishers();
});
</script>

<style scoped>
.publisher-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.publisher-item {
    width: 40%;
    margin-bottom: 20px;
    text-align: center;
}

.publisher-picture {
    width: 70%;
    max-height: 200px;
    object-fit: cover;
}

.publisher-name {
    font-size: 16px;
}
</style>