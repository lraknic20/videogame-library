<template>
    <div class="chart-container">
        <div class="chart-wrapper">
            <h2>Broj favorita po žanrovima</h2>
            <Chart type="bar" :data="chartDataFavorites" class="charts" />
        </div>
        <div class="chart-wrapper">
            <h2>Broj recenzija u posljednjoj godini</h2>
            <Chart type="line" :data="chartDataReviews" class="charts" />
        </div>
    </div>
    {{ error }}
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import Chart from 'primevue/chart';

const chartDataFavorites = ref();
const chartDataReviews = ref();
const error = ref<string>();

var getFavoritesStatistic = () => {
    axiosClient
        .get('statistika/favoriti')
        .then((response) => {
            chartDataFavorites.value = setChartDataFavorites(response.data);
        })
        .catch((err) => {
            error.value += 'Greška kod dohvaćanja statistike za favorite';
        });
};

var getReviewsStatistic = () => {
    axiosClient
        .get('statistika/recenzije')
        .then((response) => {
            chartDataReviews.value = setChartDataReviews(response.data);
        })
        .catch((err) => {
            error.value += 'Greška kod dohvaćanja statistike za recenzije';
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
</style>