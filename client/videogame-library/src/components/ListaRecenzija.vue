<template>
    <div>
        <div v-for="recenzija in props.reviews" :key="recenzija.id" class="reviews">
            <div v-if="recenzija.igra" class="game">
                <RouterLink :to="`/igre/${recenzija.igra.kratki_naziv}`">
                    <img :src="recenzija.igra.slika" :alt="recenzija.igra.naziv" class="game-image" />
                    <h4>{{ recenzija.igra.naziv }}</h4>
                </RouterLink>
            </div>
            <div class="review">
                <Rating class="rating" v-model="recenzija.ocjena" :cancel="false" readonly
                    :disabled="recenzija.obrisano == true" />
                <span class="username">{{ recenzija.korime }}</span>
                <span v-tooltip="formatDate(recenzija.datum)" class="date">Objavljeno prije {{ formateDateDistance(recenzija.datum) }}</span>
                <p class="comment">{{ recenzija.komentar }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { RecenzijaI } from '@/types/RecenzijaI';
import Rating from 'primevue/rating';
import { format, formatDistanceStrict } from "date-fns";
import { hr } from "date-fns/locale";

const props = defineProps<{ reviews: RecenzijaI[] }>();

var formatDate = (dateString: string) => {
    let date = new Date(dateString);
    return format(date, 'd.M.yyyy. HH:mm');
}

var formateDateDistance = (dateString: string) => {
    let date = new Date(dateString);
    return formatDistanceStrict(date, new Date(), { locale: hr });
}
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

a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
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