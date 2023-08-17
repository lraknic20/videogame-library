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
import "primeicons/primeicons.css";
import ProgressSpinner from 'primevue/progressspinner';
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(PrimeVue);

app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 10,
    newestOnTop: true,
    timeout: 3000
});

app.component('VueDatePicker', VueDatePicker);
app.component('ProgressSpinner', ProgressSpinner);
app.component('MultiSelect', MultiSelect);
app.component('InputText', InputText);
app.component('Paginator', Paginator);
app.component('Dropdown', Dropdown);
app.component('Button', Button);
app.directive('tooltip', Tooltip);

app.use(VueAwesomePaginate).mount('#app')
