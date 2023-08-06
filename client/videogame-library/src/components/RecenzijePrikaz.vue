<template>
    <div v-for="recenzija in props.reviews" :key="recenzija.id" class="reviews">
        <div v-if="recenzija.igra" class="game">
            <img :src="recenzija.igra.slika" :alt="recenzija.igra.naziv" class="game-image" />
            <h4>{{ recenzija.igra.naziv }}</h4>
        </div>
        <div class="review">
            <Rating class="rating" v-model="recenzija.ocjena" v-if="recenzija.obrisano == false" :cancel="false" readonly />
            <Rating class="rating" v-else :cancel="false" readonly disabled />
            <span class="username" v-if="recenzija.obrisano == false">{{ recenzija.korime }}</span>
            <span class="username" v-else>[obrisano]</span>
            <span v-if="recenzija.datum_istek_bloka">Blokiran do: {{ moment(recenzija.datum_istek_bloka)
                .format('D.M.yyyy. HH:mm') }}</span>
            <span class="date">Objavljeno: {{ moment(recenzija.datum).format('D.M.yyyy. HH:mm') }}</span>
            <p class="comment" v-if="recenzija.obrisano == false">{{ recenzija.komentar }}</p>
            <p class="comment" v-else>[obrisano]</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RecenzijaI } from '@/types/RecenzijaI';
import Rating from 'primevue/rating';
import moment from 'moment';

const props = defineProps<{ reviews: RecenzijaI[] }>();
</script>

<style scoped>
.game-image {
    width: 200px;
    margin-right: 10px;
}

.reviews {
    margin-top: 20px;
    display: flex;
    border-bottom: 1px solid #ccc;
}

.game {
    padding: 10px;
    text-align: center;
}

.game h4 {
    margin-top: 4px;
    margin-bottom: 8px;
}

.review {
    padding: 10px;
}

.rating {
    margin-bottom: 8px;
}

.username {
    font-weight: bold;
    margin-right: 10px;
}

.date {
    margin-right: 10px;
}
</style>