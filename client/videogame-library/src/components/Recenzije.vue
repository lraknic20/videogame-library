<template>
    <div class="card">
        <div class="review-name">
            <h2>Recenzije</h2>
            <span v-if="!isLoggedIn()">Prijavi se za dodavanje recenzije</span>
            <button v-if="!userBlocked && isLoggedIn() && !isUserReviewed" @click="addReview()">Dodaj recenziju</button>
            <span v-if="userBlocked">Blokirani ste do {{ blockedDate }}</span>
        </div>

        <div class="reviews">
            <div v-for="recenzija in recenzije" :key="recenzija.id" class="review">
                <Rating class="rating" v-model="recenzija.ocjena" v-if="recenzija.obrisano == false" :cancel="false" readonly />
                <Rating class="rating" v-else :cancel="false" readonly disabled />
                <span class="username" v-if="recenzija.obrisano == false">{{ recenzija.korime }}</span>
                <span class="username" v-else>[obrisano]</span>
                <span class="date">{{ formatDate(recenzija.datum) }}</span>
                <p class="comment" v-if="recenzija.obrisano == false">{{ recenzija.komentar }}</p>
                <p class="comment" v-else>[obrisano]</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import type { RecenzijaI } from '@/types/RecenzijaI';
import type { KorisnikI } from '@/types/KorisnikI';
import Rating from 'primevue/rating';
import { openModal } from "jenesius-vue-modal";
import Recenzija from '@/components/Recenzija.vue';

const props = defineProps<{ game: IgraRAWGI }>();

const recenzije = ref<RecenzijaI[]>([]);
const userBlocked = ref(false);
const blockedDate = ref('');
const isUserReviewed = ref(false);
const korisnik = ref<KorisnikI>();

const addReview = async () => {
    const modal = await openModal(Recenzija, {
        game: props.game,
        userId: korisnik.value?.id
    });
    modal.onclose = () => {
        getReviewsForGame();
    }
};

var getReviewsForGame = () => {
    axiosClient
        .get('/recenzije/' + props.game.id)
        .then((response) => {
            recenzije.value = response.data;
            if (isLoggedIn())
                checkIfUserBlocked();
        })
        .catch((err) => {
            console.log('Greška kod dohvaćanja favorita');
        });
}

const formatDate = (date: string) => {
    const newDate = new Date(date);

    return newDate.toLocaleDateString('hr-HR');
};

const isLoggedIn = () => {
    if (localStorage.getItem('token')) {
        return true;
    } else {
        return false;
    }
}

const checkIfUserBlocked = () => {
    axiosClient
        .get('/korisnici/' + localStorage.getItem('id'))
        .then((response) => {
            korisnik.value = response.data;

            let datum_isteka_bloka: Date | null = null;

            if (korisnik.value?.datum_istek_bloka) {
                datum_isteka_bloka = new Date(korisnik.value.datum_istek_bloka);
            }

            if (datum_isteka_bloka && datum_isteka_bloka > new Date()) {
                blockedDate.value = datum_isteka_bloka.toLocaleDateString('hr-HR') + ' ' + datum_isteka_bloka.toLocaleTimeString('hr-HR');
                userBlocked.value = true;
            }

            isUserReviewed.value = recenzije.value.some(recenzija => recenzija.korisnikId == Number(localStorage.getItem('id')));
        })
        .catch((err) => {
            console.log('Greška kod dohvaćanja korisnika');
        });
}

onMounted(() => {
    getReviewsForGame();
});
</script>

<style scoped>
.card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 16px;
    margin: 10px;
}

.review-name {
    display: flex;
    align-items: center;
}

.review-name h2 {
    margin: 0 10px 0 0;
}

.reviews {
    margin-top: 20px;
}

.review {
    border-bottom: 1px solid #ccc;
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