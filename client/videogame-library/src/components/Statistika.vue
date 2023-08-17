<template>
    <ProgressSpinner v-if="isLoading" class="spinner" />
    <span v-if="error">Greška prilikom dohvaćanja statistike. Molimo pokušajte kasnije.</span>
    <div v-if="chartDataFavorites && chartDataReviews" class="chart-container">
        <div class="chart-wrapper">
            <h2>Broj favorita po žanrovima</h2>
            <Chart type="bar" :data="chartDataFavorites" class="charts" />
        </div>
        <div class="chart-wrapper">
            <h2>Broj recenzija u posljednjoj godini</h2>
            <Chart type="line" :data="chartDataReviews" class="charts" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import Chart from 'primevue/chart';

const chartDataFavorites = ref();
const chartDataReviews = ref();
const isLoading = ref(true);
const error = ref<boolean>();

var getFavoritesStatistic = () => {
    axiosClient
        .get('statistika/favoriti')
        .then((response) => {
            chartDataFavorites.value = setChartDataFavorites(response.data);
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = true;
        });
};

var getReviewsStatistic = () => {
    axiosClient
        .get('statistika/recenzije')
        .then((response) => {
            isLoading.value = false;
            chartDataReviews.value = setChartDataReviews(response.data);
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = true;
        });
};

const setChartDataFavorites = (response: any) => {

    return {
        labels: Object.keys(response),
        datasets: [
            {
                label: 'Favoriti',
                data: Object.values(response)
            },
        ]
    };
};

const setChartDataReviews = (response: any) => {

    return {
        labels: Object.keys(response),
        datasets: [
            {
                label: 'Recenzija',
                data: Object.values(response)
            },
        ]
    };
};

onMounted(() => {
    getFavoritesStatistic();
    getReviewsStatistic();
});
</script>

<style scoped>
.charts {
    width: 85%;
}

.chart-container {
    display: flex;
    justify-content: space-between;
}

.chart-wrapper {
    width: 50%;
}

.spinner {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 50%;
}
</style>