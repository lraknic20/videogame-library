<template>
	<div class="login">
		<h2>Prijava</h2>
		<form @submit="onSubmit">
			<label for="username">Korisničko ime</label>
			<input v-bind="username" name="username" id="username" type="text" />
			<span>{{ errors.username }}</span>
			<label for="password">Lozinka</label>
			<input v-bind="password" name="password" id="password" type="password" />
			<span>{{ errors.password }}</span>
			<span>{{ error }}</span>
			<button>Prijava</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import axiosClient from '@/services/axiosClient';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
const toast = useToast();

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

var performLogin = async (korime: string, lozinka: string) => {
	axiosClient
		.post('prijava', { korime, lozinka })
		.then((response) => {
			localStorage.setItem('id', response.data.id);
			localStorage.setItem('korime', response.data.korime);
			localStorage.setItem('token', response.data.token);
			toast.success(response.data.message);
			router.push('/');
		})
		.catch((err) => {
			error.value = err.response.data.error;
		});
}
</script>

<style scoped>
.login {
	width: 350px;
	margin: auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.login h2 {
	text-align: center;
}

.login label {
	display: block;
	margin-bottom: 5px;
	font-weight: bold;
}

.login input {
	width: 100%;
	padding: 8px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.login span {
	color: red;
	font-size: 14px;
	margin-bottom: 5px;
	display: block;
}

.login button {
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

.login button:hover {
	background-color: #0556ad;
}
</style>