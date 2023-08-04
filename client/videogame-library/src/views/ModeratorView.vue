<template>
    <h2>Moderacija recenzija</h2>
    {{ error }}
    <div v-for="recenzija in recenzije" :key="recenzija.id" class="reviews">
        <div class="game">
            <img :src="recenzija.igra.slika" :alt="recenzija.igra.naziv" class="game-image" />
            <h4>{{ recenzija.igra.naziv }}</h4>
        </div>
        <div class="review">
            <Rating class="rating" v-model="recenzija.ocjena" v-if="recenzija.obrisano == false" :cancel="false" readonly />
            <Rating class="rating" v-else :cancel="false" readonly disabled />
            <span class="username" v-if="recenzija.obrisano == false">{{ recenzija.korime }}</span>
            <span class="username" v-else>[obrisano]</span>
            <span v-if="recenzija.datum_istek_bloka">Blokiran do: {{ moment(recenzija.datum_istek_bloka)
                .format('D.M.yyyy. HH: mm') }}</span>
            <span class="date">Objavljeno: {{ moment(recenzija.datum).format('D.M.yyyy.') }}</span>
            <p class="comment" v-if="recenzija.obrisano == false">{{ recenzija.komentar }}</p>
            <p class="comment" v-else>[obrisano]</p>
        </div>
        <div class="buttons" v-if="recenzija.obrisano == false">
            <button @click="deleteReview(recenzija)">Obriši</button>
            <button @click="showCalendar(recenzija)">Obriši i blokiraj</button>
            <!-- <div v-if="showDatePicker">
                <p>Molimo odaberite datum završetka bloka:</p>
                <VueDatePicker v-model="date" time-picker-inline locale="hr" format="d.M.yyyy HH:mm" select-text="Odaberi"
                    cancel-text="Odustani" :clearable="false" :min-date=minDate />
                <button @click="blockUser(recenzija)">Potvrdi</button>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { RecenzijaI } from '@/types/RecenzijaI';
import Rating from 'primevue/rating';
import axiosClient from '@/services/axiosClient';
import { useToast } from "vue-toastification";
import moment from 'moment';
import BlokiranjeKorisnika from '@/components/BlokiranjeKorisnika.vue';
import { openModal } from "jenesius-vue-modal";

const toast = useToast();
const recenzije = ref<RecenzijaI[]>([]);
const error = ref<string>();
const date = ref<Date>(new Date());
const selectedDate = ref<Date>();
const minDate = new Date();

var getReviews = () => {
    axiosClient
        .get('recenzije/moderator/' + localStorage.getItem('id'))
        .then((response) => {
            recenzije.value = response.data;
        })
        .catch((err) => {
            error.value = err.response.data;
        });
}

var deleteReview = (review: RecenzijaI) => {
    axiosClient
        .put('recenzije/' + review.id)
        .then((response) => {
            toast.success(response.data);
            getReviews();
        })
        .catch((err) => {
            toast.error("Greška prilikom brisanja recenzije!");
        });
}

var showCalendar = async (review: RecenzijaI) => {
    const modal = await openModal(BlokiranjeKorisnika);
    modal.on('selectedDate', (date: Date) => {
        selectedDate.value = date;
    });
    modal.onclose = () => {
        if (selectedDate.value)
            blockUser(review);
    }
}

var blockUser = (review: RecenzijaI) => {
    axiosClient
        .put('korisnici/' + review.korisnikId + '/datumIstekBloka', {
            datum_istek_bloka: moment(selectedDate.value).format('YYYY-MM-DD HH:mm:ss')
        })
        .then((response) => {
            selectedDate.value = undefined;
            toast.success(response.data);
            deleteReview(review);
            getReviews();
        })
        .catch((err) => {
            console.log(err.response.data)
            toast.error("Greška prilikom blokiranja korisnika!");
        });

}

onMounted(() => {
    getReviews();
});
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

.buttons {
    align-self: center;
}

button {
    margin-right: 10px;
}
</style>