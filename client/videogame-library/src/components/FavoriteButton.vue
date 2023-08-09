<template>
    <div class="favorite-button" @click="toggleFavorite">
        <span v-if="isFavorite">❤️</span>
        <span v-else>🤍</span>
    </div>
</template>
  
<script setup lang="ts">
import type { IgraI } from '@/types/IgraI';
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import { useToast } from "vue-toastification";
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const toast = useToast();

const props = defineProps<{ igra: IgraI }>();
const userId = localStorage.getItem('id');
let favoritId = ref<number>();

const isFavorite = ref<boolean>(false);

const toggleFavorite = () => {
    if (authStore.checkLoggedIn()) {
        if (!isFavorite.value) {
            saveFavoriteGame();
        } else {
            deleteFavorite();
        }
    } else {
        toast.info("Prijavite se kako bi mogli spremiti igru u favorite.")
    }
};

const saveFavoriteGame = () => {
    axiosClient
        .post('/igre', {
            igra: {
                id: props.igra.id,
                naziv: props.igra.naziv,
                kratki_naziv: props.igra.kratki_naziv,
                opis: props.igra.opis,
                slika: props.igra.slika,
                objavljeno: props.igra.objavljeno,
                datum_izlaska: props.igra.datum_izlaska,
                stranica: props.igra.stranica,
                metacritic: props.igra.metacritic,
                minimalni_zahtjevi: props.igra.minimalni_zahtjevi,
                preporuceni_zahtjevi: props.igra.preporuceni_zahtjevi,
            },
            izdavac: props.igra.izdavaci!.map((izdavac) => ({
                id: izdavac.id,
                naziv: izdavac.naziv,
                kratki_naziv: izdavac.kratki_naziv,
                broj_igara: izdavac.broj_igara,
            })),
            zanr: props.igra.zanrovi!.map((zanr) => zanr.id),
            platforma: props.igra.platforme!.map((platforma) => platforma.id)
        })
        .then((response) => {
            if (response.status == 200)
                saveFavorite();
        })
        .catch((err) => {
            console.log('Greška kod spremanja igre');
        });
};

var deleteFavorite = () => {
    axiosClient
        .delete('/favoriti/' + favoritId.value)
        .then((response) => {
            if (response.status == 200) {
                isFavorite.value = false;
                toast.success("Igra je uklonjena iz favorita.")
            }
        })
        .catch((err) => {
            toast.error("Greška kod brisanja favorita!")
        });
}

var saveFavorite = () => {
    axiosClient
        .post('/favoriti', {
            korisnik: userId,
            igra: props.igra.id,
        })
        .then((response) => {
            if (response.status == 200) {
                isFavorite.value = true;
                favoritId.value = response.data.favorit.id;
                toast.success("Igra je spremljena u favorite.")
            }
        })
        .catch((err) => {
            console.log('Greška kod dohvaćanja favorita');
        });
}

var checkIfFavorited = () => {
    axiosClient
        .get('/favoriti/' + userId + '/igra/' + props.igra.id)
        .then((response) => {
            if (response.data.length != 0) {
                favoritId.value = response.data[0].id;
                if (response.data.length != 0)
                    isFavorite.value = true;
            }
        })
        .catch((err) => {
            console.log('Greška kod dohvaćanja favorita');
        });
}


onMounted(() => {
    if(authStore.checkLoggedIn())
        checkIfFavorited();
});
</script>
  
<style>
.favorite-button {
    cursor: pointer;
}
</style>
  