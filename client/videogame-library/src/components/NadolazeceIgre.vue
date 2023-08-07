<template>
  <div>
    <h2>Nadolazeće igre</h2>
    <div class="date-picker-container">
      <VueDatePicker v-model="selectedDate" :enable-time-picker="false" locale="hr" format="d.M.yyyy"
        select-text="Odaberi" cancel-text="Odustani" :clearable="false" :min-date="new Date()"
        @update:model-value="onDateChange" />
    </div>
    <select v-model="pageSize" @change="onPageSizeChange">
      <option value="10" selected>10</option>
      <option value="20">20</option>
      <option value="30">30</option>
      <option value="40">40</option>
    </select>
    <Igre :igre="igre" :stranica="'igreRAWG'"/>
    <vue-awesome-paginate :total-items="count" :items-per-page="pageSize" :max-pages-shown="5" v-model="currentPage"
      :on-click="onPageChange" />
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

const onDateChange = () => {
  fetchData();
};

const onPageChange = () => {
  fetchData();
};

const onPageSizeChange = () => {
  fetchData();
};

var fetchData = async () => {
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

onMounted(fetchData);
</script>

<style scoped>
.date-picker-container {
  width: 20%;
  margin-bottom: 2%;
}

.game-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.game-item {
  width: 40%;
  margin-bottom: 20px;
  text-align: center;
}

.game-picture {
  width: 70%;
  max-height: 200px;
  object-fit: cover;
}

.game-name {
  font-size: 16px;
}
</style>