<script setup lang="ts">
import TheCitizenList from "@/components/TheCitizenList.vue";
import UiAlert from "@/components/UiAlert.vue";
import {useCitizensStore} from "@/stores/citizens";
import {useCitiesStore} from "@/stores/city";
import {computed, ref} from "vue";
import type {Ref} from 'vue'
import type {TypeCitizens, TypeCities} from '@/types'

const storeCitizens = useCitizensStore();
const storeCities = useCitiesStore();
const loading: Ref<boolean> = ref(true);
(async () => {
    await storeCitizens.fetchCitizens()
    await storeCities.fetchCities()
    loading.value = false
})()
const citizens = computed<TypeCitizens>(() => {
    return storeCitizens.getCitizens
})
const cities = computed<TypeCities>(() => {
    return storeCities.getCities
})
</script>

<template>
    <main class="home-view">
        <UiAlert v-if="loading">Загрузка</UiAlert>
        <UiAlert v-if="!loading && !citizens"/>
        <TheCitizenList
            :citizens="citizens"
            :cities="cities"
        />
    </main>
</template>
<style scoped lang="scss">
.home-view {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
}
</style>
