<template>
    <div class="sorting-filter-citizen">
        <div class="sorting-filter-citizen__search">
            <div class="sorting-filter-citizen__search-title">Поиск</div>
            <UiInput
                placeholder="Rick and Morty"
                v-model="searchValue"
            />
            <div class="sorting-filter-citizen__search-descriptions">по</div>
            <UiDropdown
                :title="optionsForSelectedSearch[0]"
                :options="optionsForSelectedSearch"
                v-model="searchLocationTitle"
            />
        </div>
        <div class="sorting-filter-citizen__filter">
            <div class="sorting-filter-citizen__filter-title">Фильтры:</div>
            <div class="sorting-filter-citizen__filter-gender">
                <span>{{ dropdownTitle('gender') }}</span>
                <UiDropdown
                    :title="optionsForSelectedFilterGender[0].name"
                    :options="optionsForSelectedFilterGender.map(item => item.name)"
                    v-model="valueGender"
                />
            </div>
            <div class="sorting-filter-citizen__filter-active">
                <span>{{ dropdownTitle('isActive') }}</span>
                <UiDropdown
                    :title="optionsForSelectedFilterIsActive[0].name"
                    :options="optionsForSelectedFilterIsActive.map(item => item.name)"
                    v-model="valueIsActive"
                />
            </div>
            <div
                class="sorting-filter-citizen__filter-city"
                v-if="props.cities"
            >
                <span>{{ dropdownTitle('cityId') }}</span>
                <UiDropdown
                    :title="optionsForSelectedFilterCities[0].name"
                    :options="optionsForSelectedFilterCities.map(item => item.name)"
                    v-model="valueCity"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {ICitizen, TypeCitizens, TypeCities} from "@/types";
import type {Ref} from "vue";
import {computed, ref, watch} from "vue";
import UiInput from "@/components/UiInput.vue";
import {titleKey} from '@/composables/titleKeyCitizen'
import UiDropdown from "@/components/UiDropdown.vue";
import {klona} from "klona";

const searchValue: Ref<string> = ref('')
const searchLocationTitle: Ref<string> = ref(titleKey['name'].title)
const valueGender: Ref<string> = ref('Все')
const valueIsActive: Ref<string> = ref('Все')
const valueCity: Ref<string> = ref('Все')

interface IProps {
    citizens: TypeCitizensFull
    cities: TypeCities | null | undefined
}

type TypeCitizensFull = TypeCitizens | null | undefined
const props = defineProps<IProps>()
const emit = defineEmits(['resultSearchAndSoring'])
const localCitizens = computed<TypeCitizensFull>(() => klona(props.citizens))
const dropdownTitle = (key): string => {
    const index = Object.keys(titleKey).findIndex(item => item === key)
    return Object.values(titleKey)[index].title
}
const resultSearch = (): TypeCitizensFull => {
    const flag: string = 'gi'
    const searchStrShielding: string = searchValue.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    const regexp: RegExp = new RegExp(searchStrShielding, flag)
    return localCitizens.value!.filter((item: ICitizen) => {
        regexp.lastIndex = 0
        const value: string = searchLocationKey.value === 'mobilePhone' ? item[searchLocationKey.value].replace(/\D+/g, '') : item[searchLocationKey.value]

        return regexp.test(value)
    })
}
const searchLocationKey = computed<string>(() => {
    const result: [string, any] | undefined = Object.entries(titleKey).find(item => {
        return item[1].title === searchLocationTitle.value
    })
    return result[0] || 'name'
})
const allFilterStart = (): TypeCitizensFull => {
    const step1 = resultSearch()
    const step2 = genderFilter(step1)
    const step3 = isActiveFilter(step2)
    return citiesFilter(step2)
}
const genderFilter = (arrayFilter: TypeCitizensFull): TypeCitizensFull => {
    const valueSearch = optionsForSelectedFilterGender.value.find(item => {
        return item.name === valueGender.value
    })
    return arrayFilter!.filter((item: ICitizen) => {
        return !valueSearch.id || item.gender === valueSearch.id
    })
}
const isActiveFilter = (arrayFilter: TypeCitizensFull): TypeCitizensFull => {
    const valueSearch = optionsForSelectedFilterIsActive.value.find(item => {
        return item.name === valueIsActive.value
    })
    return arrayFilter!.filter((item: ICitizen) => {
        return !valueSearch.id || item.isActive === (valueSearch.id === 'true')
    })
}
const citiesFilter = (arrayFilter: TypeCitizensFull): TypeCitizensFull => {
    const valueSearch = optionsForSelectedFilterCities.value.find(item => {
        return item.name === valueCity.value
    })
    return arrayFilter!.filter((item: ICitizen) => {
        return (valueSearch.id === -1) || +item.cityId === +valueSearch.id
    })
}
watch(() => searchValue.value, () => {
    emit('resultSearchAndSoring', allFilterStart())
})
watch(() => JSON.stringify(props.citizens), () => {

    emit('resultSearchAndSoring', allFilterStart())
    //можно следить через deep, но так расходуется меньше ресурсов
})
watch(() => valueGender.value, () => {

    emit('resultSearchAndSoring', allFilterStart())
})
watch(() => valueIsActive.value, () => {

    emit('resultSearchAndSoring', allFilterStart())
})
watch(() => valueCity.value, () => {

    emit('resultSearchAndSoring', allFilterStart())
})

interface IOption {
    id: string | number
    name: string
}

const optionsForSelectedFilterGender = computed<IOption[]>(() => {
    const key = 'gender'
    const index: number = Object.keys(titleKey).findIndex(item => item === key)
    const objValue: {} = Object.values(titleKey)[index].value
    const allItemsTitle: string = 'Все'
    const arrayKeys: string[] = Object.keys(objValue)
    const arrayValue: string[] = Object.values(objValue)
    arrayKeys.unshift('')
    arrayValue.unshift(allItemsTitle)
    return arrayKeys.map((item, idx) => {
        return {id: arrayKeys[idx], name: arrayValue[idx]}
    })
})
const optionsForSelectedFilterIsActive = computed<IOption[]>(() => {
    const key = 'isActive'
    const index: number = Object.keys(titleKey).findIndex(item => item === key)
    const objValue: (arg: boolean) => string = Object.values(titleKey)[index].value
    const allItemsTitle: string = 'Все'
    const arrayKeys: string[] = ['true', 'false']
    const arrayValue: string[] = [objValue(true), objValue(false)]

    arrayKeys.unshift('')
    arrayValue.unshift(allItemsTitle)
    return arrayKeys.map((item, idx) => {
        return {id: arrayKeys[idx], name: arrayValue[idx]}
    })
})
const optionsForSelectedFilterCities = computed<IOption[]>(() => {
    const allItemsTitle: string = 'Все'
    const localCities = klona(props.cities)
    const mainTitle = {id: -1, name: allItemsTitle}
    if (localCities) {
        localCities.unshift(mainTitle)
        return localCities
    } //TS ругается на другой вид записи
    return [mainTitle]
})
const optionsForSelectedSearch = computed<string[]>(() => {
    return Object.values(titleKey).filter(item => {
        return !item.select && item.title !== 'Дата рождения'
    }).map(item => {
        return item.title
    })
})
</script>

<style scoped lang="scss">
.sorting-filter-citizen {
    position: sticky;
    top: -1px;
    z-index: 10;
    background-color: var(--blue);
    width: 100%;
    padding: 16px 0;
    min-height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    &__search, &__filter {
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        background-color: var(--blue-light);
        border-radius: 6px;
        padding: 6px;
        margin: 6px;

        & div {
            margin: 0 6px;
        }
    }

    &__filter-gender {
        display: flex;
        flex-direction: row;
        justify-content: center;
        justify-items: center;
        flex-wrap: nowrap;
    }
}
</style>