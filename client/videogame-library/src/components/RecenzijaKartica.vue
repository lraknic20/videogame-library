<template>
    <div class="card">
        <div class="review-name">
            <h2>Recenzije</h2>
            <span v-if="!isLoggedIn()">Prijavi se za dodavanje recenzije</span>
            <button v-if="!userBlocked && isLoggedIn() && !isUserReviewed" @click="addReview()">Dodaj recenziju</button>
            <span v-if="userBlocked">Blokirani ste do {{ blockedDate }}</span>
        </div>
        <ListaRecenzija :reviews="recenzije"/>
        <div v-if="recenzije && recenzije.length == 0">
            <p>Nema recenzija za ovu igru</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import type { IgraI } from '@/types/IgraI';
import type { RecenzijaI } from '@/types/RecenzijaI';
import type { KorisnikI } from '@/types/KorisnikI';
import { openModal } from "jenesius-vue-modal";
import DodajRecenziju from '@/components/DodajRecenziju.vue';
import ListaRecenzija from '@/components/ListaRecenzija.vue'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const props = defineProps<{ igra: IgraI }>();

const recenzije = ref<RecenzijaI[]>([]);
const userBlocked = ref(false);
const blockedDate = ref('');
const isUserReviewed = ref(false);
const korisnik = ref<KorisnikI>();

const addReview = async () => {
    const modal = await openModal(DodajRecenziju, {
        igra: props.igra,
        userId: korisnik.value?.id
    });
    modal.onclose = () => {
        getReviewsForGame();
    }
};

var getReviewsForGame = () => {
    axiosClient
        .get('/recenzije/' + props.igra.id)
        .then((response) => {
            recenzije.value = response.data;
            if (isLoggedIn())
                checkIfUserBlocked();
        })
        .catch((err) => {
            console.log('Greška kod dohvaćanja favorita');
        });
}

const isLoggedIn = () => {
    return authStore.checkLoggedIn();
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
    margin: 0 10%;
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