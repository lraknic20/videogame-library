<template>
    <div>
        <h2>Status žanrova i platforma</h2>
        <h4>Žanrovi</h4>
        <p>Broj žanrova u bazi: {{ zanroviBaza.length }}; Broj žanrova u RAWG bazi: {{ zanroviRAWG.length }}</p>
        <button v-if="zanroviBaza.length != zanroviRAWG.length" @click="addGenres">Dodaj nove žanrove</button>
        <h4>Platforme</h4>
        <p>Broj platforma u bazi: {{ platformeBaza.length }}; Broj platforma u RAWG bazi: {{ platformeRAWG.length }}</p>
        <button v-if="platformeBaza.length != platformeRAWG.length" @click="addPlatforms">Dodaj nove platforme</button>
        <h2>Lista žanrova</h2>
        <button @click="genresLocked = !genresLocked">Zaključaj/otključaj žanrove</button>
        <ul>
            <li v-for="zanr in zanroviBaza" :key="zanr.id">
                <span v-if="genresLocked">{{ zanr.naziv }}</span>
                <input v-if="!genresLocked" v-model="zanr.naziv" @change="updateGenre(zanr)" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import { useToast } from "vue-toastification";
import type { ZanrI } from '@/types/ZanrI';
import type { PlatformaI } from '@/types/PlatformaI';
import type { genres, platform } from '@/types/IgreRAWGI';

const toast = useToast();

const zanroviBaza = ref<ZanrI[]>([]);
const zanroviRAWG = ref<genres[]>([]);
const platformeBaza = ref<PlatformaI[]>([]);
const platformeRAWG = ref<platform[]>([]);
const genresLocked = ref<boolean>(true);

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanroviBaza.value = response.data;
        })
        .catch((err) => {
            toast.error('Greška kod dohvaćanja žanrova iz baze!');
        });
};

var getAllGenresRAWG = () => {
    axiosClient
        .get('rawg/zanrovi')
        .then((response) => {
            zanroviRAWG.value = response.data.results;
        })
        .catch((err) => {
            toast.error('Greška kod dohvaćanja žanrova iz RAWG baze!');
        });
};

var addGenres = () => {
    const zanrovi = zanroviRAWG.value.map((zanr) => {
        return {
            id: zanr.id,
            naziv: zanr.name,
            broj_igara: zanr.games_count,
        };
    });

    axiosClient
        .post('zanrovi', {zanrovi})
        .then((response) => {
            toast.success(response.data);
            getAllGenres();
        })
        .catch((err) => {
            toast.error('Greška kod dodavanja žanrova!');
        });
};

var updateGenre = (zanr: ZanrI) => {
    axiosClient
        .put('zanrovi/' + zanr.id, zanr)
        .then((response) => {
            toast.success(response.data);
        })
        .catch((err) => {
            toast.error('Greška kod ažuriranja žanra!');
        });
};

var getAllPlatforms = () => {
    axiosClient
        .get('platforme')
        .then((response) => {
            platformeBaza.value = response.data;
        })
        .catch((err) => {
            toast.error('Greška kod dohvaćanja žanrova iz baze!');
        });
};

var getAllPlatformsRAWG = (page: number) => {
    axiosClient
        .get('rawg/platforme?page=' + page + '&pageSize=40')
        .then((response) => {
            platformeRAWG.value.push(response.data.results);
            if (response.data.next != null) {
                getAllPlatformsRAWG(++page);
            } else {
                platformeRAWG.value = platformeRAWG.value.flat();
            }
        })
        .catch((err) => {
            toast.error('Greška kod dohvaćanja platformi iz RAWG baze!');
        });
};

var addPlatforms = () => {
    const platforme = platformeRAWG.value.map((platforma) => {
        return {
            id: platforma.id,
            naziv: platforma.name,
            broj_igara: platforma.games_count,
        };
    });

    axiosClient
        .post('platforme', {platforme})
        .then((response) => {
            toast.success(response.data);
            getAllPlatforms();
        })
        .catch((err) => {
            toast.error('Greška kod dodavanja platforma!');
        });
};

onMounted(() => {
    getAllGenresRAWG();
    getAllPlatformsRAWG(1);
    getAllGenres();
    getAllPlatforms();
});
</script>