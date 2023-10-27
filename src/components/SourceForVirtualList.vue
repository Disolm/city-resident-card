<template>
    <div class="source-item">
        <TheCitizenItem
            :key="source.id"
            :citizen="source"
            :cities="extraProps.cities"
        />
    </div>
</template>

<script setup lang="ts">
import {ICitizen, TypeCities} from "@/types";
import TheCitizenItem from "@/components/TheCitizenItem.vue";

interface IExtraProps {
    cities: TypeCities | null | undefined
}

interface IProps {
    index: number
    source: ICitizen
    extraProps: IExtraProps
}

const props = defineProps<IProps>()

</script>

<style scoped lang="scss">
.source-item {
    min-height: 1px;
    min-width: 1px;
    display: flex;
    flex-direction: row;
    justify-items: center;
    justify-content: center;
}
</style>