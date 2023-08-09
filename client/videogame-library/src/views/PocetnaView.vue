<template>
	<div>
		<h2>Nadolazeće igre</h2>
		<div class="date-picker-container">
			<VueDatePicker v-model="selectedDate" :enable-time-picker="false" locale="hr" format="d.M.yyyy"
				select-text="Odaberi" cancel-text="Odustani" :clearable="false" :min-date="new Date()"
				@update:model-value="getUpcomingGames" />
		</div>
		<Igre :igre="igre" :stranica="'igreRAWG'" />
		<Paginator v-model:rows="pageSize" v-model:totalRecords="count" :rowsPerPageOptions="[10, 20, 30, 40]"
			@page="onPageChange" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import axiosClient from '@/services/axiosClient';
import Igre from '@/components/Igre.vue'
import type { IgraI } from '@/types/IgraI';

let igre = ref<IgraI[]>([]);

let selectedDate = ref(new Date());
selectedDate.value.setMonth(selectedDate.value.getMonth() + 1);

let currentPage = ref(1);
let pageSize = ref(10);
let count = ref(0);

const onPageChange = (event: any) => {
	currentPage.value = event.page + 1;
	getUpcomingGames();
};

var getUpcomingGames = async () => {
	try {
		const response = await axiosClient.get('rawg/nadolazece_igre?page=' + currentPage.value + '&pageSize=' + pageSize.value + '&futureDate=' + selectedDate.value.toISOString().split('T')[0]);
		const data = await response.data;
		const igreRAWGI: IgraRAWGI[] = data.results;
		igre.value = igreRAWGI.map((game) => {
			const { id, name, slug, background_image } = game;

			return { id, naziv: name, kratki_naziv: slug, slika: background_image };
		});
		count.value = data.count;
	} catch (error) {
		console.error('Greška pri dohvaćanju nadolazećih igara!', error);
	}
};

onMounted(getUpcomingGames);
</script>

<style scoped>
.date-picker-container {
	width: 20%;
	margin-bottom: 2%;
}
</style>