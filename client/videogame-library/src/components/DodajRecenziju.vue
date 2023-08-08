<template>
    <div class="add-review">
        <h2>Recenzija</h2>
        <label for="rating" class="label">Ocjena:</label>
        <Rating v-model="rating" :cancel="false" id="rating" />
        <label for="comment" class="label">Komentar:</label>
        <textarea v-model="comment" type="text" id="comment" cols="33" rows="5"></textarea>
        <div class="buttons">
            <button @click="closeModal()">Odustani</button>
            <button @click="saveGame()">Dodaj recenziju</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Rating from 'primevue/rating';
import axiosClient from '@/services/axiosClient';
import type { IgraI } from '@/types/IgraI';
import { useToast } from "vue-toastification";
import { closeModal } from "jenesius-vue-modal"

const toast = useToast();

const props = defineProps<{ igra: IgraI, userId: number | undefined }>();

const comment = ref<string>();
const rating = ref<number>();

var saveGame = () => {
    if (rating.value == undefined) {
        toast.error('Ocjena ne može biti prazna!');
        return;
    }
    if (comment.value == undefined || comment.value == '') {
        toast.error('Komentar ne može biti prazan!');
        return;
    }
    axiosClient
        .post('/igre', {
            igra: {
                id: props.igra.id,
                naziv: props.igra.naziv,
                kratki_naziv: props.igra.kratki_naziv,
                opis: props.igra.opis,
                slika: props.igra.slika,
                objavljeno: props.igra.objavljeno,
                datum_izlaska: props.igra.datum_izlaska,
                stranica: props.igra.stranica,
                metacritic: props.igra.metacritic,
                minimalni_zahtjevi: props.igra.minimalni_zahtjevi,
                preporuceni_zahtjevi: props.igra.preporuceni_zahtjevi,
            },
            izdavac: props.igra.izdavaci!.map((izdavaci) => ({
                id: izdavaci.id,
                naziv: izdavaci.naziv,
                kratki_naziv: izdavaci.kratki_naziv,
                broj_igara: izdavaci.broj_igara,
            })),
            zanr: props.igra.zanrovi!.map((zanr) => zanr.id),
            platforma: props.igra.platforme!.map((platforme) => platforme.id)
        })
        .then((response) => {
            if (response.status == 200)
                addReview();
        })
        .catch((err) => {
            console.log('Greška kod spremanja igre');
        });
}

var addReview = () => {
    axiosClient
        .post('/recenzije', {
            komentar: comment.value,
            ocjena: rating.value,
            igra: props.igra.id,
            korisnik: props.userId
        })
        .then((response) => {
            toast.success(response.data);
            closeModal();
        })
        .catch((err) => {
            toast.error('Greška kod dodavanja recenzije!');
        });
}
</script>

<style scoped>
h2 {
    margin: 8px;
}

.add-review {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.label {
    margin-top: 8px;
    margin-bottom: 8px;
    align-self: flex-start;
}

.buttons {
    display: flex;
    margin-top: 16px;
}

.buttons button {
    margin: 0 8px;
}</style>