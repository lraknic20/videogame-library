<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { isLoggedIn, isAdmin, isModerator } from '@/services/auth';
import { ref } from 'vue';
import { container as WidgetContainerModal } from "jenesius-vue-modal";

let loggedIn = ref(isLoggedIn());

</script>

<template>
	<header>
		<nav>
			<RouterLink to="/">Početna</RouterLink>
			<RouterLink to="/istrazi">Istraži</RouterLink>
			<RouterLink to="/izdavaci">Izdavači</RouterLink>
			<RouterLink to="/najbolje-igre">Najbolje ocijenjene igre</RouterLink>
			<RouterLink v-if="!loggedIn" to="/prijava">Prijava</RouterLink>
			<RouterLink v-if="!loggedIn" to="/registracija">Registracija</RouterLink>
			<RouterLink v-if="loggedIn" to="/favoriti">Favoriti</RouterLink>
			<RouterLink v-if="loggedIn" to="/recenzije">Recenzije igara</RouterLink>
			<RouterLink v-if="loggedIn" to="/profil">Profil</RouterLink>
			<RouterLink v-if="loggedIn && isAdmin()" to="/admin">Admin</RouterLink>
			<RouterLink v-if="loggedIn && isModerator()" to="/moderator">Moderator</RouterLink>
			<RouterLink v-if="loggedIn" to="/odjava">Odjava</RouterLink>
		</nav>
	</header>

	<RouterView />
	<widget-container-modal />
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

nav {
	margin-left: -1rem;
	margin-right: -1rem;
	margin-top: -1rem;
	margin-bottom: 1rem;
	display: flex;
	justify-content: space-around;
	background-color: rgb(51, 51, 51);
	padding: 15px;
}

nav a {
	text-decoration: none;
	color: white;
	padding: 5px 10px;
	border-radius: 5px;
	transition: background-color 0.3s;
}

nav a:hover,
a.router-link-active {
	background-color: rgb(85, 85, 85);
}
</style>