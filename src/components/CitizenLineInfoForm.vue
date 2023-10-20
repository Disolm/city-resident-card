<template>
    <div
        class="citizen-line-info-form"
    >
        <CitizenLineInfo
            v-for="(item, key) in titleKey"
            :key="key"
        >
            <template v-slot:title>
                {{ item.title }}
            </template>
            <template
                v-slot:description
                v-if="!clickOnEdit || !filterOnInput(key)"
            >
                {{ citizenFormatted(key, citizen) }}
            </template>
            <template
                v-else-if="clickOnEdit && filterOnInput(key)"
                v-slot:description
            >
                <UiDropdown
                    v-if="item.select"
                    :options="optionsForSelected(key)"
                    :modelValue="citizenFormatted(key, localCitizen)"
                    @update:modelValue="changeOptions(key, $event)"
                />
                <UiInput
                    v-else
                    :multiline="item.type === 'multiline'"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    :modelValue="citizenFormatted(key, localCitizen)"
                    @update:modelValue="changeInput(key, $event)"
                />
            </template>
        </CitizenLineInfo>
    </div>
</template>

<script setup lang="ts">

import {titleKey} from "@/composables/titleKeyCitizen";
import UiDropdown from "@/components/UiDropdown.vue";
import UiInput from "@/components/UiInput.vue";
import CitizenLineInfo from "@/components/CitizenLineInfo.vue";
import type {ICitizen, TypeCities} from "@/types";
import {ref, onMounted} from "vue";
import type {Ref} from "vue";
import {klona} from "klona";
import {formatPhoneNumber} from "@/composables/formatPhoneNumber";

interface IProps {
    clickOnEdit: boolean
    cities: TypeCities | null | undefined
    citizen: ICitizen
    openWithModal?: boolean
}
const emit = defineEmits(['localCitizen'])

const props = defineProps<IProps>()
const localCitizen: Ref<ICitizen> = ref(klona(props.citizen));
onMounted (() => {
    emit('localCitizen', localCitizen.value)
})
const filterOnInput = (key): boolean => {
    if (props.openWithModal) return true
    return ['additional'].some(item => item !== key)
}
const citizenFormatted = (key: string, citizen: ICitizen): string => {
    if (key === 'isActive') {
        return titleKey[key].value(citizen[key])
    }
    if (key === 'gender') {
        return titleKey[key].value[citizen[key]]
    }
    if (key === 'birthday') {
        return citizen.birthday
    }
    if (key === 'cityId' && props.cities?.length) {
        return props.cities.find(city => city.id === citizen[key])?.name || 'н/д'
    }
    return citizen[key]
}
const optionsForSelected = (key: string): string[] => {
    if (key === 'isActive') {
        return ["Да", "Нет"]
    }
    if (key === 'gender') {
        return Object.values(titleKey[key].value)
    }
    if (key === 'cityId') {
        return props.cities?.map(citi => citi.name)
    }
    return []
}
const changeOptions = (key: string, event: string): void => {
    if (key === 'isActive') {
        localCitizen.value[key] = event === titleKey[key].value(true)
    }
    if (key === 'gender') {
        localCitizen.value[key] = <string>Object.entries(titleKey[key].value).find(arr => arr[1] === event)?.[0]
    }
    if (key === 'cityId' && props.cities) {
        localCitizen.value[key] = props.cities?.find(citi => citi.name === event).id
    }
}
const changeInput = (key: string, event: string): void => {
    if (key === 'mobilePhone') {
        localCitizen.value[key] = formatPhoneNumber(event)
    } else {
        localCitizen.value[key] = event
    }
}
</script>

<style scoped>

</style>