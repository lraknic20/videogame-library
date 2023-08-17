<template>
    <div class="profile">
        <h2>Uredi profil</h2>
        <form v-if="korisnik && korisnik.tip_korisnika_id">
            <label for="ime">Ime:</label>
            <InputText v-model="korisnik.ime" type="text" id="ime" :class="{ 'p-invalid': formErrors.ime }" />
            <span v-if="formErrors.ime" class="error-message">{{ formErrors.ime }}</span>
            <label for="prezime">Prezime:</label>
            <InputText v-model="korisnik.prezime" type="text" id="prezime" :class="{ 'p-invalid': formErrors.prezime }" />
            <span v-if="formErrors.prezime" class="error-message">{{ formErrors.prezime }}</span>
            <label for="korime">Korisničko ime:</label>
            <InputText v-model="korisnik.korime" type="text" id="korime" :class="{ 'p-invalid': formErrors.korime }" />
            <span v-if="formErrors.korime" class="error-message">{{ formErrors.korime }}</span>
            <label for="email">Email:</label>
            <InputText v-model="korisnik.email" type="email" id="email" :class="{ 'p-invalid': formErrors.email }" />
            <span v-if="formErrors.email" class="error-message">{{ formErrors.email }}</span>
            <div v-if="korisnik.datum_istek_bloka">
                <label for="tipKorisnika">Datum isteka bloka:</label>
                <InputText v-model="korisnik.datum_istek_bloka" type="text" id="tipKorisnika" disabled />
            </div>
            <label for="tipKorisnika">Tip korisnika:</label>
            <InputText v-model="korisnik.tip_korisnika_id.naziv" type="text" id="tipKorisnika" disabled />
            <div v-if="zanrovi">
                <label>Zaduženi žanrovi:</label>
                <p>{{ zanrovi }}</p>
            </div>
            <span>{{ message }}</span>
            <Button @click="updateUser" label="Spremi promjene" />
        </form>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { KorisnikI } from '@/types/KorisnikI';
import * as yup from 'yup';
import axiosClient from '@/services/axiosClient';
import { useToast } from "vue-toastification";
import InputText from 'primevue/inputtext';
import moment from 'moment';

const toast = useToast();

const korisnik = ref<KorisnikI>();
const zanrovi = ref<string>();
const isBlocked = ref<boolean>(false);
const formErrors = ref<any>({
    ime: '',
    prezime: '',
    korime: '',
    email: ''
});

const message = ref();

const schema = yup.object({
    ime: yup.string().required('Ime je obavezno polje.'),
    prezime: yup.string().required('Prezime je obavezno polje.'),
    korime: yup.string().min(3, 'Korisničko ime mora imati barem 3 znaka').required('Korisničko ime je obavezno polje.'),
    email: yup.string().email('Email nije validan.').required('Email je obavezno polje.'),
});

const userID = localStorage.getItem('id');

var getUserData = async () => {
    axiosClient
        .get('korisnici/' + userID)
        .then((response) => {
            korisnik.value = response.data;
            if (korisnik.value?.datum_istek_bloka) {
                const datumBloka = new Date(korisnik.value.datum_istek_bloka);
                const trenutniDatum = new Date();
                if (datumBloka >= trenutniDatum) {
                    isBlocked.value = true;
                    korisnik.value.datum_istek_bloka = moment(korisnik.value.datum_istek_bloka).format('DD.MM.YYYY HH:mm');
                }
            }
            if (korisnik.value?.zaduzenZanr)
                zanrovi.value = korisnik.value.zaduzenZanr.map((zanr) => zanr.naziv).join(', ');
        })
        .catch((error) => {
            message.value = 'Greška pri dohvaćanju korisnika!';
        });
};

async function updateUser() {
    try {
        formErrors.value = {};
        message.value = '';

        await schema.validate(korisnik.value, { abortEarly: false });

        const response = await axiosClient.put(`korisnici/${userID}`, korisnik.value);

        if (response.status == 200)
            toast.success('Profil je uspješno ažuriran!');
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            error.inner.forEach((e) => {
                if (e.path) {
                    formErrors.value[e.path] = e.message;
                }
            });
        } else {
            message.value = "Pogreška kod ažuriranja profila!";
        }
    }
}

onMounted(getUserData);
</script>

<style scoped>
.profile {
    width: 350px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.profile h2 {
    text-align: center;
}

.profile label {
    display: block;
    margin-bottom: 5px;
}

.profile input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.profile span {
    color: red;
    font-size: 14px;
    margin-bottom: 5px;
    display: block;
}

.profile button {
    width: 50%;
    padding: 10px;
    background-color: #0d79ec;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: grid;
    margin: auto;
}

.profile button:hover {
    background-color: #0556ad;
}
</style>