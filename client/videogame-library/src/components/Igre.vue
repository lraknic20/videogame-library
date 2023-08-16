<template>
    <div class="game-container">
        <div v-for="igra in props.igre" :key="igra.id" class="game-item">
            <RouterLink :to="`/${props.stranica}/${igra.kratki_naziv}`">
                <img v-if="igra.slika" :src="igra.slika" :alt="igra.naziv" class="game-image" />
                <img v-else src="https://fakeimg.pl/1920x1080?text=Slika+ne+postoji" :alt="igra.naziv" class="game-image" />
                <p class="game-name">{{ igra.naziv }}</p>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IgraI } from '@/types/IgraI';
const props = defineProps<{ igre: IgraI[], stranica: string }>();
</script>

<style scoped>
.game-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    /* padding: 20px; */
}

.game-item {
    /* align-self: center; */
    text-align: center;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
}

.game-image {
    margin-top: 16px;
    width: 80%;
}

/* .game-picture {
    max-width: 100%;
    height: 250px;
} */

a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    font-size: 20px;
}

.game-name {
    margin: 8px;
    margin-bottom: 16px;    
}
</style>