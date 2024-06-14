<template>
	<div class="login">
		<h2>Prijava</h2>
		<form>
			<label for="username">Korisničko ime:</label>
			<InputText v-model="korisnik.korime" type="text" id="username" :class="{ 'p-invalid': formErrors.username }" />
			<span v-if="formErrors.korime" class="error-message">{{ formErrors.korime }}</span>
			<label for="password">Lozinka:</label>
			<Password v-model="korisnik.lozinka" id="password" :class="{ 'p-invalid': formErrors.password }"
				:feedback="false" class="password" toggleMask />
			<span v-if="formErrors.lozinka" class="error-message">{{ formErrors.lozinka }}</span>
			<span>{{ error }}</span>
			<Button @click="performLogin" label="Prijava" />
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as yup from 'yup';
import axiosClient from '@/services/axiosClient';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
const toast = useToast();
import { useAuthStore } from '@/stores/auth';
import type { KorisnikI } from '@/types/KorisnikI';
import Password from 'primevue/password';

const authStore = useAuthStore();
const error = ref();
const korisnik = ref<KorisnikI>({
	korime: '',
	lozinka: ''
});
const formErrors = ref<any>({
	korime: '',
	lozinka: ''
});

const schema = yup.object({
	korime: yup.string().min(3, 'Korisničko ime mora imati barem 3 znakova').required('Korisničko ime je potrebno'),
	lozinka: yup.string().min(6, 'Lozinka mora imati barem 6 znakova').required('Lozinka je potrebna'),
});

const router = useRouter();

var performLogin = async () => {
	try {
		formErrors.value = {};
		error.value = '';

		await schema.validate(korisnik.value, { abortEarly: false });

		axiosClient
			.post('prijava', { korime: korisnik.value.korime, lozinka: korisnik.value.lozinka })
			.then((response) => {
				localStorage.setItem('token', response.data.token);
				authStore.login();
				toast.success(response.data.message);
				router.push('/');
			})
			.catch((err) => {
				error.value = err.response.data.error;
			});
	} catch (error: any) {
		if (error instanceof yup.ValidationError) {
			error.inner.forEach((e) => {
				if (e.path) {
					formErrors.value[e.path] = e.message;
				}
			});
		} else {
			error.value = "Pogreška kod prijave!";
		}
	}
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
}

input {
	width: 100%;
}

.login span {
	color: red;
	font-size: 14px;
	margin-bottom: 5px;
	display: block;
}

.password {
	width: 100%;
}

.login button {
	width: 50%;
	display: grid;
	margin: auto;
	margin-top: 16px;
}
</style>