<template>
    <div class="game-container">
        <div v-for="igra in props.igre" :key="igra.id" class="game-item">
            <RouterLink :to="`/igre/${igra.kratki_naziv}`">
                <img :src="igra.slika" :alt="igra.naziv" class="game-picture" />
                <p class="game-name">{{ igra.naziv }}</p>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IgraI } from '@/types/IgraI';
const props = defineProps<{ igre: IgraI[] }>();
</script>

<style scoped>
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
    width: 60%;
    object-fit: cover;
}

.game-name {
    font-size: 16px;
}
</style>