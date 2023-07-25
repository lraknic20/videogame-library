<template>
    <div>
      <h2>Nadolazeće igre</h2>
      <div class="game-container">
        <div v-for="igra in nadolazeceIgre" :key="igra.id" class="game-item">
          <img :src="igra.background_image" :alt="igra.name" class="game-picture" />
          <p class="game-name">{{ igra.name }}</p>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import type { IgraRAWGI } from '../types';

const nadolazeceIgre = ref<IgraRAWGI[]>([]);

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:1337/rawg/nadolazece_igre?page=1&pageSize=20&futureDate=2023-08-20');
        const data = await response.data;
        nadolazeceIgre.value = data.results;
    } catch (error) {
        console.error('Greška pri dohvaćanju nadolazećih igara!', error);
    }
};

onMounted(fetchData);
</script>

<style scoped>
.game-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.game-item {
  width: 30%;
  margin-bottom: 20px;
  text-align: center;
}

.game-picture {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.game-name {
  font-size: 16px;
}
</style>