<template>
    <div class="sorting-filter-citizen">
        <div class="sorting-filter-citizen__search">
            <div class="sorting-filter-citizen__search-title">Поиск</div>
            <UiInput
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
            <div class="sorting-filter-citizen__filter-title">Фильтры: </div>
            <div class="sorting-filter-citizen__filter-gender">
                <span>{{dropdownTitle('gender')}}</span>
                <UiDropdown
                    :title="optionsForSelectedFilterGender[0].value"
                    :options="optionsForSelectedFilterGender.map(item => item.value)"
                    v-model="valueGender"
                />
            </div>

        </div>


    </div>
</template>

<script setup lang="ts">
import type {ICitizen, TypeCitizens} from "@/types";
import type {Ref} from "vue";
import {computed, ref, watch} from "vue";
import UiInput from "@/components/UiInput.vue";
import {titleKey} from '@/composables/titleKeyCitizen'
import UiDropdown from "@/components/UiDropdown.vue";
import {klona} from "klona";
const searchValue:Ref<string> = ref('')
const searchLocationTitle:Ref<string> = ref(titleKey['name'].title)
const valueGender:Ref<string> = ref('Все')
interface IProps {
    citizens: TypeCitizens | null | undefined
}
const props = defineProps<IProps>()
const emit = defineEmits(['resultSearchAndSoring'])
const localCitizens = computed<TypeCitizens | null | undefined>(() => klona(props.citizens))

const resultSearch = (): TypeCitizens | null | undefined => {
    const flag: string = 'gi'
    const searchStrShielding: string = searchValue.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    const regexp: RegExp = new RegExp(searchStrShielding, flag)
    return localCitizens.value!.filter((item: ICitizen) => {
        regexp.lastIndex = 0
        const value:string = searchLocationKey.value === 'mobilePhone' ? item[searchLocationKey.value].replace(/\D+/g, '') : item[searchLocationKey.value]

        return regexp.test(value)
    })
}
watch(() => searchValue.value, ()=> {
    emit('resultSearchAndSoring', resultSearch())
})
watch(() => JSON.stringify(props.citizens), ()=> {
    emit('resultSearchAndSoring', resultSearch())
    //можно следить через deep, но так расходуется меньше ресурсов
})
watch(()=> valueGender.value, ()=> {
    const valueSearch = optionsForSelectedFilterGender.value.find(item => {
        return item.value === valueGender.value
    })
    const resultSearchByGender: TypeCitizens = localCitizens.value!.filter((item: ICitizen) => {
        return !valueSearch.key || item.gender === valueSearch.key
    })
    emit('resultSearchAndSoring', resultSearchByGender)
})
const dropdownTitle = (key):string => {
    const index = Object.keys(titleKey).findIndex(item => item === key)
    return Object.values(titleKey)[index].title
}
interface IOptionForGender {
    key: string
    value: string
}
const optionsForSelectedFilterGender = computed<IOptionForGender[]>(()=>{
    const key = 'gender'
    const index:number = Object.keys(titleKey).findIndex(item => item === key)
    const objValue: {} = Object.values(titleKey)[index].value
    const allItemsTitle: string = 'Все'
    const arrayKeys: string[] = Object.keys(objValue)
    const arrayValue: string[] = Object.values(objValue)
    arrayKeys.unshift('')
    arrayValue.unshift(allItemsTitle)
    return arrayKeys.map((item, idx) => {
        return {key: arrayKeys[idx], value: arrayValue[idx]}
    })
})
const optionsForSelectedSearch = computed<string[]>(()=>{
    return Object.values(titleKey).filter(item => {
        return !item.select && item.title !== 'Дата рождения'
    }).map(item => {
        return item.title
    })
})
const searchLocationKey = computed<string>(() => {
    const result:[string, any] | undefined = Object.entries(titleKey).find(item => {
        return item[1].title === searchLocationTitle.value
    })
    return result[0] || 'name'
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
    &__search, &__filter {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        background-color: var(--blue-light);
        border-radius: 6px;
        padding: 6px;
        margin: 6px;
        & div {
            margin: 0 6px;
        }
    }
}
</style>