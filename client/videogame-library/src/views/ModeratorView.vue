<template>
    <div>
        <h1>Moderacija recenzija</h1>
        {{ error }}
        <ProgressSpinner v-if="isLoading" class="spinner" />
        <span v-if="!recenzije">Nema recenzija koje možete pregledavati.</span>
        <div v-for="recenzija in recenzije" :key="recenzija.id" class="reviews">
            <div class="game">
                <img :src="recenzija.igra.slika" :alt="recenzija.igra.naziv" class="game-image" />
                <h4>{{ recenzija.igra.naziv }}</h4>
            </div>
            <div class="review">
                <Rating class="rating" v-model="recenzija.ocjena" v-if="recenzija.obrisano == false" :cancel="false"
                    readonly />
                <Rating class="rating" v-else :cancel="false" readonly disabled />
                <span class="username" v-if="recenzija.obrisano == false">{{ recenzija.korime }}</span>
                <span class="username" v-else>[Obrisano]</span>
                <span v-if="new Date(recenzija.datum_istek_bloka) > new Date()">Blokiran do: {{ formatDate(recenzija.datum_istek_bloka) }}</span>
                <span v-tooltip="formatDate(recenzija.datum)" class="date"> Objavljeno prije {{ formateDateDistance(recenzija.datum) }}</span>
                <p class="comment" v-if="recenzija.obrisano == false">{{ recenzija.komentar }}</p>
                <p class="comment" v-else>[Obrisano]</p>
            </div>
            <div v-if="recenzija.obrisano == false">
                <Button @click="deleteReview(recenzija)" label="Obriši" size="small" />
                <Button @click="showCalendar(recenzija)" label="Obriši i blokiraj" size="small" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { RecenzijaI } from '@/types/RecenzijaI';
import Rating from 'primevue/rating';
import axiosClient from '@/services/axiosClient';
import { useToast } from "vue-toastification";
import BlokiranjeKorisnika from '@/components/BlokiranjeKorisnika.vue';
import { openModal } from "jenesius-vue-modal";
import moment from 'moment';
import { format, formatDistanceStrict } from "date-fns";
import { hr } from "date-fns/locale";
const isLoading = ref(true);

const toast = useToast();
const recenzije = ref<RecenzijaI[]>([]);
const error = ref<string>();
const selectedDate = ref<Date>();

var formatDate = (dateString: string) => {
    let date = new Date(dateString);
    return format(date, 'd.M.yyyy. HH:mm');
}

var formateDateDistance = (dateString: string) => {
    let date = new Date(dateString);
    return formatDistanceStrict(date, new Date(), { locale: hr });
}

var getReviews = () => {
    axiosClient
        .get('recenzije/moderator/' + localStorage.getItem('id'))
        .then((response) => {
            recenzije.value = response.data;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška prilikom dohvata recenzija. Molimo pokušajte kasnije.";
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
.spinner {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 50%;
}

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

Button {
    margin-right: 10px;
}
</style>