<template>
    <div class="game-container">
        <div v-for="igra in props.igre" :key="igra.id" class="game-item">
            <RouterLink :to="`/${props.stranica}/${igra.kratki_naziv}`">
                <img :src="igra.slika" :alt="igra.naziv" class="game-picture" />
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
    padding: 20px;

}

.game-item {
    /* align-self: center; */
    text-align: center;
}

.game-picture {
    width: 80%;
}

/* .game-picture {
    max-width: 100%;
    height: 250px;
} */

.game-name {
    text-align: center;
}
</style>