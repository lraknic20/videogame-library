<template>
	<div>
		<h2>Nadolazeće igre</h2>
		<div class="container">
			<div class="filter">
				<h3>Filter</h3>
				<label for="maxDate">Završni datum</label>
				<VueDatePicker v-model="selectedDate" :enable-time-picker="false" locale="hr" format="d.M.yyyy"
					select-text="Odaberi" cancel-text="Odustani" :clearable="false" :min-date="new Date()"
					@update:model-value="getUpcomingGames" id="maxDate" />
			</div>
			{{ error }}
			<Igre :igre="igre" :stranica="'igreRAWG'" />
			<ProgressSpinner v-if="isLoading" class="spinner" />
		</div>
		<Paginator v-if="!error && !isLoading" v-model:rows="pageSize" v-model:totalRecords="count" :rowsPerPageOptions="[10, 20, 30, 40]"
			@page="onPageChange" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import axiosClient from '@/services/axiosClient';
import Igre from '@/components/Igre.vue'
import type { IgraI } from '@/types/IgraI';

const igre = ref<IgraI[]>([]);

const selectedDate = ref(new Date());
selectedDate.value.setMonth(selectedDate.value.getMonth() + 1);

const currentPage = ref(1);
const pageSize = ref(10);
const count = ref(0);
const isLoading = ref(false);
const error = ref<string>();

const onPageChange = (event: any) => {
	currentPage.value = event.page + 1;
	getUpcomingGames();
};

var getUpcomingGames = () => {
	isLoading.value = true;
	axiosClient
		.get('rawg/nadolazece_igre?page=' + currentPage.value + '&pageSize=' + pageSize.value + '&futureDate=' + selectedDate.value.toISOString().split('T')[0])
		.then((response) => {
			isLoading.value = false;
			const data = response.data;
			const igreRAWGI: IgraRAWGI[] = data.results;
			igre.value = igreRAWGI.map((game) => {
				const { id, name, slug, background_image } = game;

				return { id, naziv: name, kratki_naziv: slug, slika: background_image };
			});
			count.value = data.count;
		})
		.catch((err) => {
			isLoading.value = false;
			error.value = "Greška prilikom dohvaćanja igara. Molimo pokušajte kasnije."
		});
};

onMounted(getUpcomingGames);
</script>

<style scoped>
h2 {
	font-size: 36px;
	color: rgb(51, 51, 51);
	text-align: center;
}

.spinner {
	position: fixed;
	left: 0;
	right: 0;
	top: 50%;
	bottom: 50%;
}

.container {
	display: grid;
	grid-template-columns: 1fr 4fr;
	gap: 20px;
	padding: 20px;
}

.filter {
	height: 140px;
	padding: 10px;
	border: 1px solid rgb(204, 204, 204);
	border-radius: 5px;
}

.filter h3 {
	color: rgb(51, 51, 51);
	margin: 10px 0 10px 0;
	text-align: center;
	padding-bottom: 8px;
	border-bottom: 1px solid rgb(204, 204, 204);
}
</style>