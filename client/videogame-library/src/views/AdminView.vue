<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Korisničko ime</th>
                    <th>Tip korisnika</th>
                    <th></th>
                    <th>Zaduženi žanrovi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="korisnik in korisnici" :key="korisnik.id">
                    <td>{{ korisnik.ime }}</td>
                    <td>{{ korisnik.prezime }}</td>
                    <td>{{ korisnik.korime }}</td>
                    <td>{{ korisnik.tip_korisnika_id?.naziv }}</td>
                    <td v-if="korisnik.id != prijavljeniAdminId">
                        <button @click="showUserTypesList(korisnik), showGenres = false">Promijeni tip korisnika</button>
                    </td>
                    <td>
                        <template v-for="(zanr, i) in korisnik.zaduzenZanr" :key="zanr.id">
                            {{ zanr.naziv }}<span v-if="korisnik.zaduzenZanr && i < korisnik.zaduzenZanr.length - 1">,
                            </span>
                        </template>
                    </td>
                    <td v-if="korisnik.tip_korisnika_id?.id === 3">
                        <button @click="showGenresList(korisnik), showUserTypes = false">Dodaj/promijeni zadužene
                            žanrove</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="showGenres">
            <h2>Zaduženi žanrovi za korisnika {{ selectedUser?.ime }} {{ selectedUser?.prezime }}</h2>
            <div v-for="zanr in zanrovi" :key="zanr.id">
                <label>
                    <input type="checkbox" :checked="isGenreChecked(zanr)" @change="changeGenreChecked(zanr)" />
                    {{ zanr.naziv }}
                </label>
            </div>
            <button @click="saveSelectedGenres">Spremi</button>
            <button @click="closeGenres">Zatvori</button>
        </div>
        <div v-if="showUserTypes">
            <h2>Tipovi korisnika za {{ selectedUser?.ime }} {{ selectedUser?.prezime }}</h2>
            <div v-for="tip in tipoviKorisnika" :key="tip.id">
                <label>
                    <input type="radio" :checked="isSelectedUserType(tip)" @change="tempSelectedUserType = tip" />
                    Naziv: {{ tip.naziv }} Opis: {{ tip.opis }}
                </label>
            </div>
            <button @click="saveSelectedUserType">Spremi</button>
            <button @click="closeUserTypes">Zatvori</button>
        </div>
    </div>
    <div v-if="message">{{ message }}</div>
    <div v-if="error">{{ error }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import type { KorisnikI, TipKorisnikaI } from '@/types/KorisnikI';
import type { ZanrI } from '@/types/ZanrI';

const korisnici = ref<KorisnikI[]>([]);
const zanrovi = ref<ZanrI[]>([]);
const tipoviKorisnika = ref<TipKorisnikaI[]>([]);
const prijavljeniAdminId: number = Number(localStorage.getItem('id'));
const message = ref<string>();
const error = ref<string>();
const showGenres = ref(false);
const showUserTypes = ref(false);
const selectedUser = ref<KorisnikI>();

const tempSelectedUserType = ref<TipKorisnikaI>();

var spremljeniZanrovi: ZanrI[] | undefined = [];

var getUsers = () => {
    axiosClient
        .get('korisnici')
        .then((response) => {
            korisnici.value = response.data;
        })
        .catch((err) => {
            error.value = err.response.data.error;
        });
};

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanrovi.value = response.data;
        })
        .catch((err) => {
            error.value = err.response.data.error;
        });
};

var getAllUserTypes = () => {
    axiosClient
        .get('tip_korisnika')
        .then((response) => {
            tipoviKorisnika.value = response.data;
        })
        .catch((err) => {
            error.value = err.response.data.error;
        });
};

function isGenreChecked(zanr: ZanrI) {
    return (
        selectedUser.value &&
        selectedUser.value.zaduzenZanr &&
        selectedUser.value.zaduzenZanr.some((z) => z.id === zanr.id)
    );
}

function changeGenreChecked(zanr: ZanrI) {
    if (selectedUser.value?.zaduzenZanr) {
        if (isGenreChecked(zanr)) {
            selectedUser.value.zaduzenZanr = selectedUser?.value.zaduzenZanr.filter((z) => z.id !== zanr.id);
        } else {
            selectedUser.value.zaduzenZanr.push(zanr);
        }
    }
}

function closeGenres() {
    if (selectedUser.value)
        selectedUser.value.zaduzenZanr = spremljeniZanrovi;
    selectedUser.value = undefined;
    showGenres.value = false;
}

async function saveSelectedGenres() {
    const selectedGenreIds = zanrovi.value
        .filter((zanr) => isGenreChecked(zanr))
        .map((zanr) => zanr.id);

    axiosClient
        .put('korisnici/' + selectedUser.value?.id + '/zaduzenZanr', {
            zaduzeniZanroviId: selectedGenreIds,
        })
        .then((response) => {
            selectedUser.value = undefined;
            showGenres.value = false;
            message.value = response.data;
        })
        .catch((err) => {
            error.value = err.response.data.error;
        });
}

function showGenresList(korisnik: KorisnikI) {
    selectedUser.value = korisnik;
    spremljeniZanrovi = JSON.parse(JSON.stringify(selectedUser.value?.zaduzenZanr));
    showGenres.value = true;
}

function showUserTypesList(korisnik: KorisnikI) {
    selectedUser.value = korisnik;
    showUserTypes.value = true;
    tempSelectedUserType.value = korisnik.tip_korisnika_id;
}

function isSelectedUserType(tip: TipKorisnikaI): boolean {
    return tempSelectedUserType.value === tip.id;
}

function saveSelectedUserType() {
    axiosClient
        .put('korisnici/' + selectedUser.value?.id + '/tipKorisnika', {
            tip_korisnika_id: tempSelectedUserType.value?.id
        })
        .then((response) => {
            if (selectedUser.value?.tip_korisnika_id?.id)
                selectedUser.value.tip_korisnika_id = tempSelectedUserType.value;
            selectedUser.value = undefined;
            showUserTypes.value = false;
            message.value = response.data;
        })
        .catch((err) => {
            error.value = err.response.data.error;
        });
}

function closeUserTypes() {
    selectedUser.value = undefined;
    showUserTypes.value = false;
    tempSelectedUserType.value = undefined;
}

onMounted(getUsers);
onMounted(getAllGenres);
onMounted(getAllUserTypes);
</script>