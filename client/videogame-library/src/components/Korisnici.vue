<template>
    <div>
        <ProgressSpinner v-if="isLoading" class="spinner" />
        <table v-if="korisnici">
            <thead>
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Korisničko ime</th>
                    <th>Tip korisnika</th>
                    <th>Zaduženi žanrovi</th>
                    <th>Odredi zadužene žanrove</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="korisnik in korisnici" :key="korisnik.id">
                    <td>{{ korisnik.ime }}</td>
                    <td>{{ korisnik.prezime }}</td>
                    <td>{{ korisnik.korime }}</td>
                    <td>
                        <Dropdown v-if="korisnik.id != prijavljeniAdminId" v-model="korisnik.tip_korisnika_id"
                            :options="tipoviKorisnika" optionLabel="naziv"
                            @change="saveSelectedUserType(korisnik.id!, korisnik.tip_korisnika_id!)" class="dropdown" />
                        <span v-else>{{ korisnik.tip_korisnika_id?.naziv }}</span>
                    </td>
                    <td>
                        <template v-if="korisnik.tip_korisnika_id?.naziv == 'moderator'" v-for="(zanr, i) in korisnik.zaduzenZanr"
                            :key="zanr.id">
                            {{ zanr.naziv }}<span v-if="korisnik.zaduzenZanr && i < korisnik.zaduzenZanr.length - 1">,
                            </span>
                        </template>
                    </td>
                    <td>
                        <Button v-if="korisnik.tip_korisnika_id?.id === 3"
                            @click="showGenresList(korisnik), showUserTypes = false" label="Dodaj/promijeni zadužene
                            žanrove" size="small"/>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="showGenres" ref="sectionAssignedGenres">
            <h2>Zaduženi žanrovi za korisnika {{ selectedUser?.ime }} {{ selectedUser?.prezime }}</h2>
            <div v-for="zanr in zanrovi" :key="zanr.id">
                <input type="checkbox" :checked="isGenreChecked(zanr)" @change="changeGenreChecked(zanr)" />
                {{ zanr.naziv }}
            </div>
            <div>
                <Button @click="closeGenres" label="Zatvori" size="small" />
                <Button @click="saveSelectedGenres" label="Spremi" size="small" />
            </div>
        </div>
    </div>
    {{ error }}
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import type { KorisnikI, TipKorisnikaI } from '@/types/KorisnikI';
import type { ZanrI } from '@/types/ZanrI';
import { useToast } from "vue-toastification";
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const korisnici = ref<KorisnikI[]>();
const zanrovi = ref<ZanrI[]>([]);
const tipoviKorisnika = ref<TipKorisnikaI[]>([]);
const prijavljeniAdminId: number = authStore.returnUserId();
const error = ref<string>();
const showGenres = ref(false);
const sectionAssignedGenres = ref();
const showUserTypes = ref(false);
const selectedUser = ref<KorisnikI>();
const isLoading = ref(false);

const toast = useToast();

var spremljeniZanrovi: ZanrI[] | undefined = [];

var getUsers = () => {
    isLoading.value = true;
    axiosClient
        .get('korisnici')
        .then((response) => {
            korisnici.value = response.data;
            isLoading.value = false;
        })
        .catch((err) => {
            isLoading.value = false;
            error.value = "Greška kod dohvaćanja korisnika. Molimo pokušajte kasnije.";
        });
};

var getAllGenres = () => {
    axiosClient
        .get('zanrovi')
        .then((response) => {
            zanrovi.value = response.data;
        })
        .catch((err) => {
            console.log(err.response.data.error);
            console.log("Greška kod dohvaćanja žanrova. Molimo pokušajte kasnije.");
        });
};

var getAllUserTypes = () => {
    axiosClient
        .get('tip_korisnika')
        .then((response) => {
            tipoviKorisnika.value = response.data;
        })
        .catch((err) => {
            console.log(err.response.data.error);
            console.log("Greška kod dohvaćanja tipova korisnika. Molimo pokušajte kasnije.");
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
            toast.success(response.data);
        })
        .catch((err) => {
            toast.error("Greška prilikom spremanja zaduženih žanrova.");
        });
}

function showGenresList(korisnik: KorisnikI) {
    selectedUser.value = korisnik;
    spremljeniZanrovi = JSON.parse(JSON.stringify(selectedUser.value?.zaduzenZanr));
    showGenres.value = true;
    setTimeout(() => {
        sectionAssignedGenres.value?.scrollIntoView();
    }, 100);
}

function saveSelectedUserType(userId: number, userType: TipKorisnikaI) {
    axiosClient
        .put('korisnici/' + userId + '/tipKorisnika', {
            tip_korisnika_id: userType.id
        })
        .then((response) => {
            toast.success(response.data);
        })
        .catch((err) => {
            toast.error("Greška prilikom spremanja tipa korisnika.");
        });
}

onMounted(() => {
    getUsers();
    getAllGenres();
    getAllUserTypes();
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

table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc;
}

th {
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
}

td {
    border: 1px solid #ccc;
    padding: 8px;
}

table th:nth-child(5),
table td:nth-child(5) {
    width: 40%;
}

table th:nth-child(6),
table td:nth-child(6) {
    width: 13%;
}

.dropdown {
    width: 100%;
}

Button {
    margin: 8px 8px 0 0;
}
</style>