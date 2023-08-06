<template>
    <div class="registration">
        <h2>Registracija</h2>
        <form @submit="onSubmit">
            <label for="name">Ime</label>
            <input v-bind="name" name="name" id="name" type="text" />
            <span>{{ errors.name }}</span>
            <label for="surname">Prezime</label>
            <input v-bind="surname" name="surname" id="surname" type="text" />
            <span>{{ errors.surname }}</span>
            <label for="email">Email</label>
            <input v-bind="email" name="email" id="email" type="email" />
            <span>{{ errors.email }}</span>
            <label for="username">Korisničko ime</label>
            <input v-bind="username" name="username" id="username" type="text" />
            <span>{{ errors.username }}</span>
            <label for="password">Lozinka</label>
            <input v-bind="password" name="password" id="password" type="password" />
            <span>{{ errors.password }}</span>
            <span>{{ error }}</span>
            <button>Registracija</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axiosClient from '@/services/axiosClient';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
const toast = useToast();

let error = ref();
const router = useRouter();

const schema = yup.object({
    name: yup.string().required('Ime je potrebno'),
    surname: yup.string().required('Prezime je potrebno'),
    email: yup.string().email('Email nije ispravan').required('Email je potreban'),
    username: yup.string().min(3, 'Korisničko ime mora imati barem 3 znakova').required('Korisničko ime je potrebno'),
    password: yup.string().min(6, 'Lozinka mora imati barem 6 znakova').required('Lozinka je potrebna')
});

const { defineInputBinds, errors, handleSubmit } = useForm({
    validationSchema: schema,
});

const name = defineInputBinds('name');
const surname = defineInputBinds('surname');
const email = defineInputBinds('email');
const username = defineInputBinds('username');
const password = defineInputBinds('password');

const onSubmit = handleSubmit(async (values) => {
    await performRegister(values.name, values.surname, values.email, values.username, values.password);
});

var performRegister = async (ime: string, prezime: string, email: string, korime: string, lozinka: string) => {
    axiosClient
        .post('registracija', {
            ime,
            prezime,
            email,
            korime,
            lozinka
        })
        .then((response) => {
            toast.success(response.data.message);
            router.push('/prijava');
        })
        .catch((err) => {
            error.value = err.response.data.error;
        });
}
</script>

<style scoped>
.registration {
    width: 350px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.registration h2 {
    text-align: center;
}

.registration label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.registration input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.registration span {
    color: red;
    font-size: 14px;
    margin-bottom: 5px;
    display: block;
}

.registration button {
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

.registration button:hover {
    background-color: #0556ad;
}
</style>