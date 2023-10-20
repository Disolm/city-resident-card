<template>
    <div
        class="citizens-item"
        @mouseover="citizenEditedCursor = true"
        @mouseleave="[citizenEditedCursor = false, clickOnDelete = false]"
        :ref="'citizen-item'+ citizen.id"
        v-clickOutside="() => clickOnEdit = false"
    >
        <div class="citizens-item__photo"/>
        <div
            class="citizens-item__info-list"
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
                        :type="!!item?.type && item.type"
                        :placeholder="item.placeholder"
                        :modelValue="citizenFormatted(key, localCitizen)"
                        @update:modelValue="changeInput(key, $event)"
                    />
                </template>
            </CitizenLineInfo>
        </div>
        <UiTransitionGroupFade class="citizens-item__icons">
            <template v-if="citizenEditedCursor">
                <EditCitizenIcon
                    class="citizens-item__icon"
                    key="EditCitizenIcon"
                    @mouseup="clickOnEdit = true"
                    @cancellationEdit="clickOnEdit = false"
                    @save-changes="saveChanges"
                    v-if="!clickOnDelete"
                />
                <DeleteCitizenIcon
                    class="citizens-item__icon"
                    key="DeleteCitizenIcon"
                    v-if="!clickOnEdit"
                    @mouseup="clickOnDelete = true"
                    @cancellationDelete="clickOnDelete = false"
                    :citizen="props.citizen"
                />
            </template>
        </UiTransitionGroupFade>

    </div>
</template>

<script setup lang="ts">
import type {ICitizen, ITitleKey, TypeCities, TypeCitizens} from '@/types'
import {computed, ref} from "vue";
import type {Ref} from "vue";
import CitizenLineInfo from "@/components/CitizenLineInfo.vue";
import UiTransitionGroupFade from "@/components/UiTransitionGroupFade.vue";
import DeleteCitizenIcon from "@/components/DeleteCitizenIcon.vue";
import EditCitizenIcon from "@/components/EditCitizenIcon.vue";
import UiInput from "@/components/UiInput.vue";
import {klona} from "klona";
import {useCitizensStore} from "@/stores/citizens";
import UiDropdown from "@/components/UiDropdown.vue";

const titleKey: ITitleKey = {
    name: {title: "ФИО:", type: "text"},
    birthday: {title: "Дата рождения:", type: "date"},
    cityId: {title: "Город:", select: true, type: ""},
    address: {title: "Адрес:", type: "text"},
    mobilePhone: {title: "Телефон:", type: "tel", placeholder: "+7 987-654-3210"},
    gender: {
        title: "Пол:",
        select: true,
        value: {Female: "Женский", Male: "Мужской"},
        type: ""
    },
    isActive: {
        title: "Активный:",
        select: true,
        value: (ev) => ev ? "Да" : "Нет",
        type: ""
    },
    additional: {title: "Доп. информация:", type: "multiline"},
}

interface IProps {
    citizen: ICitizen
    cities: TypeCities | null | undefined
}

const props = defineProps<IProps>()
const localCitizen: Ref<ICitizen> = ref(klona(props.citizen))
const photo = computed<string>(() => 'url(./src/api/picture/' + props.citizen.photo + ')')
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
const formatPhoneNumber = (value: string): string => {
    if (!value || (value.slice(0, 1) === '+' && value.length === 1)) return value
    let phoneNumber: string = value.replace(/\D+/g, '')
    const phoneNumberLength = phoneNumber.length

    if (phoneNumber.slice(0, 1) !== '7') phoneNumber = '7' + phoneNumber
    if (phoneNumberLength > 0) phoneNumber = '+' + phoneNumber
    if (phoneNumberLength > 1) phoneNumber = phoneNumber.slice(0, 2) + ' ' + phoneNumber.slice(2)
    if (phoneNumberLength > 4) phoneNumber = phoneNumber.slice(0, 6) + '-' + phoneNumber.slice(6)
    if (phoneNumberLength > 7) phoneNumber = phoneNumber.slice(0, 10) + '-' + phoneNumber.slice(10)
    return phoneNumber
}
const citizenEditedCursor: Ref<boolean> = ref(false)
const clickOnDelete: Ref<boolean> = ref(false)
const clickOnEdit: Ref<boolean> = ref(false)
const saveChanges = (): void => {
    const storeCitizens = useCitizensStore();
    const citizens: TypeCitizens = storeCitizens.getCitizens
    let replaceCitizenIndex: number = citizens.findIndex(citizen => citizen.id === localCitizen.value.id)
    citizens[replaceCitizenIndex] = klona(localCitizen.value)
    clickOnEdit.value = false
}
const filterOnInput = (key): boolean => {
    return ['additional'].some(item => item !== key)
}
</script>

<style lang="scss">
.citizens-item {
    position: relative;
    padding: 10px;
    margin: 10px;
    border: 2px solid var(--grey);
    border-radius: 8px;
    min-height: 250px;
    width: clamp(600px, 800px, 50%);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 10px;

    &:hover {
        box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);
    }

    &__photo {
        grid-area: 1 / 1 / 2 / 2;
        height: 100%;
        background-image: v-bind(photo);
        background-position: center;
        background-repeat: no-repeat;
        background-size: auto 100%;
    }

    &__info-list {
        grid-area: 1 / 2 / 2 / 4;
        margin-left: 8px;
        width: 100%;
    }

    &__icon {
        width: 26px;
    }

    &__icons {
        height: 26px;
        position: absolute;
        right: 10px;
        top: 10px;
        display: flex;
        flex-direction: row;
        //justify-content: flex-end;
    }
}
</style>