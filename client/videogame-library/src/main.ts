import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-blue/theme.css';

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(PrimeVue);

app.component('VueDatePicker', VueDatePicker);

app.use(VueAwesomePaginate).mount('#app')
