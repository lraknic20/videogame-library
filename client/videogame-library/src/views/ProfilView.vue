<template>
    <div>
        <h2>Uredi profil</h2>
        <form @submit.prevent="updateUser">
            <label for="ime">Ime:</label>
            <input v-model="formData.ime" type="text" id="ime" />
            <p v-if="formErrors.ime" class="error-message">{{ formErrors.ime }}</p>
            <br>
            <label for="prezime">Prezime:</label>
            <input v-model="formData.prezime" type="text" id="prezime" />
            <p v-if="formErrors.prezime" class="error-message">{{ formErrors.prezime }}</p>
            <br>
            <label for="korime">Korisničko ime:</label>
            <input v-model="formData.korime" type="text" id="korime" />
            <p v-if="formErrors.korime" class="error-message">{{ formErrors.korime }}</p>
            <br>
            <label for="email">Email:</label>
            <input v-model="formData.email" type="email" id="email" />
            <p v-if="formErrors.email" class="error-message">{{ formErrors.email }}</p>
            <p v-if="message">{{ message }}</p>
            <br>
            <button>Spremi promjene</button>
        </form>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { KorisnikI } from '@/types/KorisnikI';
import * as yup from 'yup';
import axiosClient from '@/services/axiosClient';

const formData = ref({
    ime: '',
    prezime: '',
    email: '',
    korime: '',
});

const formErrors = ref<any>({
    ime: '',
    prezime: '',
    email: '',
    korime: '',
});

const message = ref();

const schema = yup.object({
    ime: yup.string().required('Ime je obavezno polje.'),
    prezime: yup.string().required('Prezime je obavezno polje.'),
    email: yup.string().email('Email nije validan.').required('Email je obavezno polje.'),
    korime: yup.string().min(3, 'Korisničko ime mora imati barem 3 znaka').required('Korisničko ime je obavezno polje.'),
});

const userID = localStorage.getItem('id');

var getUserData = async () => {
    try {
        const response = await axiosClient.get('korisnici/' + userID);
        const data = await response.data;

        formData.value.ime = data.ime;
        formData.value.prezime = data.prezime;
        formData.value.email = data.email;
        formData.value.korime = data.korime;
    } catch (error) {
        message.value = 'Greška pri dohvaćanju korisnika!';
    }
};

async function updateUser() {
    try {
        formErrors.value = {};
        message.value = '';

        await schema.validate(formData.value, { abortEarly: false });

        const korisnik: KorisnikI = {
            ime: formData.value.ime,
            prezime: formData.value.prezime,
            email: formData.value.email,
            korime: formData.value.korime,
        };

        const response = await axiosClient.put(`korisnici/${userID}`, korisnik);

        if (response.status == 200)
            message.value = "Uspješno ste ažurirali profil!";
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