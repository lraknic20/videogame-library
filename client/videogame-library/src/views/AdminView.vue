<template>
    <div>
        <h1>Admin</h1>
    <TabView :lazy="true">
        <TabPanel header="Korisnici">
            <Korisnici />
        </TabPanel>
        <TabPanel header="Žanr i platforme">
            <ZanrIPlatforme />
        </TabPanel>
        <TabPanel header="Statistika">
            <Statistika />
        </TabPanel>
    </TabView>
    </div>
</template>

<script setup lang="ts">
import Korisnici from '@/components/Korisnici.vue'
import ZanrIPlatforme from '@/components/ZanrIPlatforme.vue'
import Statistika from '@/components/Statistika.vue'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

</script>