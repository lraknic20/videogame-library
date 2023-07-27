<template>
  <form @submit="onSubmit">
    <label for="username">Korisničko ime</label>
    <input v-bind="username" name="username" id="username" type="text" />
    <span>{{ errors.username }}</span>
    <br>
    <label for="password">Lozinka</label>
    <input v-bind="password" name="password" id="password" type="password" />
    <span>{{ errors.password }}</span>
    <br>
    <span>{{ error }}</span>
    <br>
    <button>Prijava</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import axiosClient from '@/services/axiosClient';
import { useRouter } from 'vue-router';

let error = ref();

const schema = yup.object({
  username: yup.string().min(3, 'Korisničko ime mora imati barem 3 znakova').required('Korisničko ime je potrebno'),
  password: yup.string().min(6, 'Lozinka mora imati barem 6 znakova').required('Lozinka je potrebna'),
});

const { defineInputBinds, errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const username = defineInputBinds('username');
const password = defineInputBinds('password');
const router = useRouter();

const onSubmit = handleSubmit(async (values) => {
  await performLogin(values.username, values.password);
});

async function performLogin(korime: string, lozinka: string) {
  try {
    const response = await axiosClient.post('prijava', {korime, lozinka});
    const data = await response.data;
    localStorage.setItem('id', data.id);
    localStorage.setItem('korime', data.korime);
    localStorage.setItem('token', data.token);
    router.push('/');
  } catch (err: any) {
    if (err.response?.status === 401) {
      error.value = err.response.data.error;
    } else {
      error.value = 'Pogreška prilikom prijave';
    }
  }
}
</script>