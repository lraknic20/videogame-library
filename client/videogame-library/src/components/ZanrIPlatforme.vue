<template>
    <div>
        <ProgressSpinner v-if="isLoading" class="spinner" />
        <span v-if="error">Greška prilikom dohvaćanja podataka. Molimo pokušajte kasnije.</span>
        <div v-if="!error && showGenresAndPlatforms">
            <h2>Status žanrova i platforma</h2>
            <h4>Žanrovi</h4>
            <p>Broj žanrova u bazi: {{ zanroviBaza.length }}; Broj žanrova u RAWG bazi: {{ zanroviRAWG.length }}</p>
            <Button v-if="zanroviBaza.length != zanroviRAWG.length" @click="addGenres" label="Dodaj nove žanrove" size="small"/>
            <h4>Platforme</h4>
            <p>Broj platforma u bazi: {{ platformeBaza.length }}; Broj platforma u RAWG bazi: {{ platformeRAWG.length }}</p>
            <Button v-if="platformeBaza.length != platformeRAWG.length" @click="addPlatforms" label="Dodaj nove platforme" size="small"/>
            <h2>Lista žanrova</h2>
            <Button @click="genresLocked = !genresLocked" label="Zaključaj/otključaj uređivanje žanrove" size="small" />
            <ul>
                <li v-for="zanr in zanroviBaza" :key="zanr.id">
                    <span v-if="genresLocked">{{ zanr.naziv }}</span>
                    <input v-if="!genresLocked" v-model="zanr.naziv" @change="updateGenre(zanr)" />
                </li>
            </ul>
        </div>
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
const showGenresAndPlatforms = ref<boolean>(false);
const genresLocked = ref<boolean>(true);
const isLoading = ref(true);
const error = ref<boolean>();

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanroviBaza.value = response.data;
        })
        .catch((err) => {
            error.value = true;
        });
};

var getAllGenresRAWG = () => {
    axiosClient
        .get('rawg/zanrovi')
        .then((response) => {
            zanroviRAWG.value = response.data.results;
        })
        .catch((err) => {
            error.value = true;
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
        .post('zanrovi', { zanrovi })
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
            error.value = true;
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
                isLoading.value = false;
                showGenresAndPlatforms.value = true;
            }
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = true;
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
        .post('platforme', { platforme })
        .then((response) => {
            toast.success(response.data);
            getAllPlatforms();
        })
        .catch((err) => {
            toast.error('Greška kod dodavanja platforma!');
        });
};

onMounted(async () => {
    getAllGenresRAWG();
    getAllPlatformsRAWG(1);
    getAllGenres();
    getAllPlatforms();
});
</script>

<style scoped>
.spinner {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    bottom: 50%;
}
</style>