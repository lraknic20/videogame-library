<template>
    <h2>Izdavači</h2>
    {{ error }}
    <ProgressSpinner v-if="isLoading" class="spinner" />
    <div class="publisher-container">
        <div v-for="izdavac in izdavaci" :key="izdavac.id" class="publisher-item">
            <RouterLink :to="`/izdavaci/${izdavac.slug}`">
                <img v-if="izdavac.image_background" :src="izdavac.image_background" :alt="izdavac.name"
                    class="publisher-image" />
                <img v-else src="https://fakeimg.pl/1920x1080?text=Slika+ne+postoji" :alt="izdavac.name"
                    class="publisher-image" />
                <p class="publisher-name">{{ izdavac.name }}</p>
            </RouterLink>
        </div>
    </div>
    <Paginator v-if="!error && izdavaci" v-model:rows="pageSize" v-model:totalRecords="count"
        :rowsPerPageOptions="[10, 20, 30, 40]" @page="onPageChange" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { publishers } from '@/types/IgreRAWGI';
import axiosClient from '@/services/axiosClient';

const izdavaci = ref<publishers[]>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const count = ref<number>(0);
const isLoading = ref(false);
const error = ref<string>();

const onPageChange = (event: any) => {
    currentPage.value = event.page + 1;
    getPublishers();
};

var getPublishers = () => {
    isLoading.value = true;

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
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvaćanja izdavača. Molimo pokušajte kasnije.";
        });
}

onMounted(() => {
    getPublishers();
});
</script>

<style scoped>
h2 {
    font-size: 36px;
    color: rgb(51, 51, 51);
    text-align: center;
}

.spinner {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 50%;
}

.publisher-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 300px;
    gap: 20px;
    padding-left: 15%;
    padding-right: 15%;
}

.publisher-item {
    text-align: center;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
}

.publisher-image {
    margin-top: 16px;
    max-height: 78%;
}

a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    font-size: 20px;
}

.publisher-name {
    margin: 8px;
}
</style>