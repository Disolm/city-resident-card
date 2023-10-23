<script setup lang="ts">
import TheCitizenList from "@/components/TheCitizenList.vue";
import UiAlert from "@/components/UiAlert.vue";
import {useCitizensStore} from "@/stores/citizens";
import {useCitiesStore} from "@/stores/city";
import {computed, onMounted, ref} from "vue";
import type {Ref} from 'vue'
import type {TypeCitizens, TypeCities} from '@/types'
import UiContainer from "@/components/UiContainer.vue";
import SortingAndFilterCitizen from "@/components/SortingAndFilterCitizen.vue";

const storeCitizens = useCitizensStore();
const storeCities = useCitiesStore();
const loading: Ref<boolean> = ref(true);
onMounted(async () => {
    await storeCitizens.fetchCitizens()
    await storeCities.fetchCities()
    loading.value = false
})
const citizens = computed<TypeCitizens>(() => {
    return storeCitizens.getCitizens
})
const cities = computed<TypeCities>(() => {
    return storeCities.getCities
})
const citizensChange: Ref<TypeCitizens | null> = ref(null)
</script>

<template>
    <main class="home-view">
        <SortingAndFilterCitizen
            :citizens="citizens"
            @resultSearchAndSoring="citizensChange = $event"
        />
        <UiContainer>
            <UiAlert v-if="loading">Загрузка</UiAlert>
            <UiAlert v-if="!loading && !citizens"/>
            <TheCitizenList
                :citizens="citizensChange || citizens"
                :cities="cities"
            />
        </UiContainer>
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
