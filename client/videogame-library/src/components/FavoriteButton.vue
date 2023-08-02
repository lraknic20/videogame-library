<template>
    <div class="favorite-button" @click="toggleFavorite">
        <span v-if="isFavorite">❤️</span>
        <span v-else>🤍</span>
    </div>
</template>
  
<script setup lang="ts">
import type { IgraRAWGI } from '@/types/IgreRAWGI';
import { ref, onMounted } from 'vue';
import axiosClient from '@/services/axiosClient';
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps<{ game: IgraRAWGI }>();
const userId = localStorage.getItem('id');
let favoritId = ref<number>();

const isFavorite = ref<boolean>(false);

const toggleFavorite = () => {
    if (localStorage.getItem('token')) {
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
                id: props.game.id,
                naziv: props.game.name,
                kratki_naziv: props.game.slug,
                opis: props.game.description,
                slika: props.game.background_image,
                objavljeno: props.game.tba,
                datum_izlaska: props.game.released,
                stranica: props.game.website,
                metacritic: props.game.metacritic,
                minimalni_zahtjevi: props.game.platforms.find((data) => data.platform.name === 'PC')?.requirements?.minimum,
                preporuceni_zahtjevi: props.game.platforms.find((data) => data.platform.name === 'PC')?.requirements?.recommended,
            },
            izdavac: props.game.publishers.map((publisher) => ({
                id: publisher.id,
                naziv: publisher.name,
                kratki_naziv: publisher.slug,
                broj_igara: publisher.games_count,
            })),
            zanr: props.game.genres.map((genre) => genre.id),
            platforma: props.game.platforms.map((platform) => platform.platform.id)
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
            igra: props.game.id,
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
        .get('/favoriti/' + userId + '/igra/' + props.game.id)
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

onMounted(checkIfFavorited);
</script>
  
<style>
.favorite-button {
    cursor: pointer;
}
</style>
  