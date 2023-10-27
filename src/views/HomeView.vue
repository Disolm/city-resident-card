<script setup lang="ts">
import TheCitizenList from "@/components/TheCitizenList.vue";
import UiAlert from "@/components/UiAlert.vue";
import {useCitizensStore} from "@/stores/citizens";
import {useCitiesStore} from "@/stores/city";
import {computed, onMounted, ref} from "vue";
import type {Ref} from 'vue'
import type {TypeCitizens, TypeCities} from '@/types'
import SortingAndFilterCitizen from "@/components/SortingAndFilterCitizen.vue";

const storeCitizens = useCitizensStore();
const storeCities = useCitiesStore();
const loading: Ref<boolean> = ref(true);
onMounted(async () => {
    await storeCitizens.fetchCitizens()
    await storeCities.fetchCities()
    loading.value = false
})
const citizens = computed<TypeCitizens | undefined>(() => {
    return storeCitizens.getCitizens
})
const cities = computed<TypeCities | undefined>(() => {
    return storeCities.getCities
})
const citizensChange: Ref<TypeCitizens | null> = ref(null)
</script>

<template>
    <div class="home-view">
        <SortingAndFilterCitizen
            v-if="citizens"
            :citizens="citizens"
            :cities="cities"
            @resultSearchAndSoring="citizensChange = $event"
        />
        <template v-if="!citizens">
            <UiAlert v-if="loading">Загрузка</UiAlert>
            <UiAlert v-if="!loading"/>
        </template>
        <TheCitizenList
            v-else
            :citizens="citizensChange || citizens"
            :cities="cities"
        />
    </div>
</template>
<style scoped lang="scss">
.home-view {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: flex-start;
}
</style>
