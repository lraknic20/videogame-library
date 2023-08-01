<template>
    <div v-if="igra && !error" class="game-card">
        <img :src="igra.background_image" :alt="igra.name" class="game-image" />
        <div class="game-details">
            <h2 class="game-name">{{ igra.name }}</h2>
            <p class="game-description" v-html="igra.description"></p>
            <div class="game-genres">
                <h3 class="game-genres">Žanrovi:</h3>
                <p>{{ formatGenres(igra.genres) }}</p>
            </div>
            <div class="game-platforms">
                <h3>Platforme:</h3>
                <p>{{ formatPlatforms(igra.platforms) }}</p>
            </div>
            <div class="game-publishers">
                <h3>Izdavači:</h3>
                <span v-for="(publisher, index) in igra.publishers" :key="publisher.id">
                    <RouterLink :to="`/izdavaci/${publisher.slug}`">{{ publisher.name }}</RouterLink>
                    <span v-if="index != igra.publishers.length - 1">, </span>
                </span>
            </div>
            <p class="game-release-date">Datum izlaska: {{ formatDate(igra.released) }}</p>
            <p v-if="igra.metacritic" class="game-metacritic">Metacritic ocjena: {{ igra.metacritic }}</p>
            <a :href="igra.website" target="_blank" class="game-website">Posjeti stranicu</a>
            <div v-if="requirements">
                <h2>Zahtjevi</h2>
                <div v-if="requirements?.minimum && requirements?.recommended">
                    <p>{{ requirements.minimum }}</p>
                    <p>{{ requirements.recommended }}</p>
                </div>
                <div v-else>
                    <p>Zahtjevi za ovu igru nisu definirani</p>
                </div>
            </div>
        </div>
    </div>
    {{ error }}
</template>
  

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IgraRAWGI, genres, platforms, publishers, requirements } from '@/types/IgreRAWGI';
import axiosClient from '@/services/axiosClient';
import { useRoute } from 'vue-router'

const route = useRoute();

let igra = ref<IgraRAWGI>();
let requirements = ref<requirements>();
let error = ref<string>();

var getGame = () => {
    axiosClient
        .get('/rawg/igre/' + route.params.id)
        .then((response) => {
            igra.value = response.data;
            findRequirements();
        })
        .catch((err) => {
            error.value = "Greška prilikom dohvaćanja igre";
        });
}

const formatGenres = (genres: genres[]) => {
    return genres.map((genre) => genre.name).join(', ');
};

const formatPlatforms = (platforms: platforms[]) => {
    return platforms.map((platforms) => platforms.platform.name).join(', ');
};


const findRequirements = () => {
    if (igra.value?.platforms) {
        const platform = igra.value.platforms.find((data) => data.platform.name === 'PC');
        if (platform)
            requirements.value = platform.requirements;
    }
};

const formatDate = (date: string) => {
    const newDate = new Date(date);

    return newDate.toLocaleDateString('hr-HR');
};

onMounted(getGame);
</script>

<style scoped>
.game-card {
    display: flex;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 16px;
    margin: 10px;
}

.game-image {
    width: 30%;
    height: 20%;
    border-radius: 5px;
    margin-right: 16px;
}

.game-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
}

.game-description {
    font-size: 16px;
    margin-bottom: 8px;
    max-height: 150px;
    overflow-y: auto;
}

.game-genres,
.game-platforms {
    margin-bottom: 8px;
}

.game-release-date,
.game-metacritic {
    font-size: 14px;
    color: #888;
}

.game-website {
    display: inline-block;
    margin-top: 8px;
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
}

.game-website:hover {
    text-decoration: underline;
}
</style>