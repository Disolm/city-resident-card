<template>
    <div class="citizens-list">
        <template v-if="citizens">
            <TheCitizenItem
                v-for="citizen in citizens"
                :key="citizen.id"
                :citizen="citizen"
                :cities="cities"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import TheCitizenItem from "@/components/TheCitizenItem.vue";
import type {TypeCitizens, TypeCities} from '@/types'

interface IProps {
    citizens: TypeCitizens | null | undefined
    cities: TypeCities | null | undefined
}

const props = defineProps<IProps>()
</script>

<style scoped lang="scss">
.citizens-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>