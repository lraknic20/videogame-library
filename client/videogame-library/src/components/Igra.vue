<template>
    <div v-if="igra" class="game-card">
        <img v-if="igra.slika" :src="igra.slika" :alt="igra.naziv" class="game-image" />
        <img v-else src="https://fakeimg.pl/1920x1080?text=Slika+ne+postoji" :alt="igra.naziv" class="game-image" />
        <div class="game-details">
            <div class="game-name">
                <h2>{{ igra.naziv }}</h2>
                <FavoriteButton :igra="igra" />
            </div>
            <Panel header="Opis">
                <p class="game-description">{{ igra?.opis?.replace(/(<([^>]+)>)/ig, '') }}</p>
            </Panel>
            <div class="game-genres">
                <h3 class="game-genres">Žanrovi</h3>
                <p>{{ formatGenres(igra.zanrovi) }}</p>
            </div>
            <div class="game-platforms">
                <h3>Platforme</h3>
                <p>{{ formatPlatforms(igra.platforme) }}</p>
            </div>
            <div class="game-publishers">
                <h3>Izdavači</h3>
                <span v-for="(publisher, index) in igra.izdavaci" :key="publisher.id">
                    <RouterLink :to="`/izdavaci/${publisher.kratki_naziv}`">{{ publisher.naziv }}</RouterLink>
                    <span v-if="index != igra.izdavaci!.length - 1">, </span>
                </span>
            </div>
            <p class="game-release-date">Datum izlaska: {{ moment(igra.datum_izlaska).format('D.M.yyyy.') }}</p>
            <p v-if="igra.metacritic" class="game-metacritic">Metacritic ocjena: {{ igra.metacritic }}</p>
            <a :href="igra.stranica" target="_blank" class="game-website">Posjeti stranicu</a>
            <h3>Zahtjevi</h3>
            <div v-if="igra.minimalni_zahtjevi && igra.preporuceni_zahtjevi">
                <p>{{ igra.minimalni_zahtjevi }}</p>
                <p>{{ igra.preporuceni_zahtjevi }}</p>
            </div>
            <div v-else>
                <p>Zahtjevi za ovu igru nisu definirani</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import moment from 'moment';
import FavoriteButton from '@/components/FavoriteButton.vue';
import type { IgraI } from '@/types/IgraI';
import type { ZanrI } from '@/types/ZanrI';
import type { PlatformaI } from '@/types/PlatformaI';
import Panel from 'primevue/panel';
const props = defineProps<{ igra: IgraI | undefined }>();
const igra = toRef(props, 'igra');

const formatGenres = (zanrovi: ZanrI[] | undefined) => {
    return zanrovi!.map((zanr) => zanr.naziv).join(', ');
};

const formatPlatforms = (platforme: PlatformaI[] | undefined) => {
    return platforme!.map((platforma) => platforma.naziv).join(', ');
};

</script>

<style scoped>
.game-card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 16px;
    margin: 10px 5% 10px 5%;
}

.game-image {
    width: 40%;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
}

.game-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px;
}

.game-name h2 {
    margin: 0 8px 0 0;
}

.game-genres,
.game-platforms {
    margin-bottom: 8px;
}

.game-release-date,
.game-metacritic {
    font-size: 14px;
    color: #888;
}

.game-website {
    display: inline-block;
    margin-top: 8px;
    font-size: 14px;
}

.game-website:hover {
    text-decoration: underline;
}

a {
    color: black;
}
</style>