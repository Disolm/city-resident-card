<template>
    <div class="citizens-item">
        <div
            class="citizens-item__photo"
        />
<!--        :style="{backgroundImage: `url(./src/api/picture/${props.citizen.photo})`}"-->

        <div class="citizens-item__info-list">

            <div
                class="citizens-item__description"
                v-for="(item, key) in titleKey"
            >
                {{ item.title }} <span>{{ citizenFormatted(key) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {ICitizen, ITitleKey, TypeCities} from '@/types'
import {computed} from "vue";

const titleKey: ITitleKey = {
    name: {title: "ФИО: "},
    birthday: {title: "Дата рождения: "},
    cityId: {title: "Город: "},
    address: {title: "Адрес: "},
    mobilePhone: {title: "Телефон: "},
    gender: {
        title: "Пол: ",
        value: {
            Female: "Женский",
            Male: "Мужской",
        }
    },
    isActive: {
        title: "Активный: ",
        value: (ev) => ev ? "Да" : "Нет"
    },
    additional: {
        title: "Доп. информация: ",
        multiline: true
    },
}

interface IProps {
    citizen: ICitizen
    cities: TypeCities | null | undefined
}
const props = defineProps<IProps>()
const photo = computed<string>(() => 'url(./src/api/picture/' + props.citizen.photo + ')')
const citizenFormatted = (key) => {
    if (key === 'isActive') {
        return titleKey[key].value(props.citizen[key])
    }
    if (key === 'gender') {
        return titleKey[key].value[props.citizen[key]]
    }
    if (key === 'birthday') {
        const date = new Date(props.citizen.birthday)
        return date.getDay() + '-' + Number(date.getMonth() + 1) + '-' + date.getFullYear()
    }
    // console.log(props.cities)
    if (key === 'cityId' && props.cities?.length) {
        return props.cities.find(city => city.id === props.citizen[key])?.name || 'н/д'
    }
    return props.citizen[key]
}
</script>

<style lang="scss">
.citizens-item {
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
    }
    &__description {
        :hover {
            background-color: var(--grey);
            cursor: pointer;
        }
    }
}
</style>