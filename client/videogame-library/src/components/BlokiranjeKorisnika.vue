<template>
    <div class="modal">
        <p>Molimo odaberite datum završetka bloka:</p>
        <VueDatePicker v-model="date" time-picker-inline locale="hr" format="d.M.yyyy HH:mm" select-text="Odaberi"
            cancel-text="Odustani" :clearable="false" :min-date=minDate />
        <div class="buttons">
            <Button @click="closeModal()" label="Odustani" size="small" />
            <Button @click="checkDate" label="Potvrdi i obriši" size="small" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { closeModal } from "jenesius-vue-modal"

const emits = defineEmits(['selectedDate']);

const date = ref<Date>(new Date());
const minDate = new Date();

const checkDate = () => {
    emits('selectedDate', date.value);
    closeModal();
};
</script>

<style scoped>
.modal {
    margin-top: -15%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}

.buttons {
    display: flex;
    margin-top: 16px;
}

.buttons button {
    margin: 0 8px;
}
</style>