<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { container as WidgetContainerModal } from "jenesius-vue-modal";
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
	<header>
		<nav>
			<RouterLink to="/">Početna</RouterLink>
			<RouterLink to="/istrazi">Istraži</RouterLink>
			<RouterLink to="/izdavaci">Izdavači</RouterLink>
			<RouterLink to="/najbolje-igre">Najbolje ocijenjene igre</RouterLink>
			<RouterLink v-if="!authStore.loggedIn" to="/prijava">Prijava</RouterLink>
			<RouterLink v-if="!authStore.loggedIn" to="/registracija">Registracija</RouterLink>
			<RouterLink v-if="authStore.loggedIn" to="/favoriti">Favoriti</RouterLink>
			<RouterLink v-if="authStore.loggedIn" to="/recenzije">Recenzije igara</RouterLink>
			<RouterLink v-if="authStore.loggedIn" to="/profil">Profil</RouterLink>
			<RouterLink v-if="authStore.loggedIn && authStore.isAdmin()" to="/admin">Admin</RouterLink>
			<RouterLink v-if="authStore.loggedIn && authStore.isModerator()" to="/moderator">Moderator</RouterLink>
			<RouterLink v-if="authStore.loggedIn" to="/odjava">Odjava</RouterLink>
		</nav>
	</header>

	<RouterView id="routerView"/>
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

/* nav {
	margin-left: -1rem;
	margin-top: -1rem;
	margin-bottom: 1rem;
	display: flex;
	justify-content: space-around;
	background-color: rgb(51, 51, 51);
	padding: 15px;
} */

nav {
	position: fixed;
	top: 0;
	right: 0;
	width: 100%;
	display: flex;
	justify-content: space-around;
	background-color: rgb(51, 51, 51);
	padding: 10px;
	z-index: 100;
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

#routerView {
	margin-top: 65px;
}
</style>