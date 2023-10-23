<template>
    <div class="sorting-filter-citizen">
        <div class="sorting-filter-citizen__search">
            <div class="sorting-filter-citizen__search-title">Поиск</div>
            <UiInput
                v-model="searchValue"
            />
            <div class="sorting-filter-citizen__search-descriptions">по</div>
            <UiDropdown
                :title="optionsForSelected[0]"
                :options="optionsForSelected"
                v-model="searchLocationTitle"
            />
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
const searchValue:Ref<string> = ref('')
const searchLocationTitle:Ref<string> = ref(titleKey['name'].title)
interface IProps {
    citizens: TypeCitizens | null | undefined
}

const props = defineProps<IProps>()
const emit = defineEmits(['resultSearchAndSoring'])
const resultSearch = (): TypeCitizens | null | undefined => {
    const flag: string = 'gi'
    const searchStrShielding: string = searchValue.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    const regexp: RegExp = new RegExp(searchStrShielding, flag)
    return props.citizens ? props.citizens.filter((item: ICitizen) => {
        regexp.lastIndex = 0
        const value:string = searchLocationKey.value === 'mobilePhone' ? item[searchLocationKey.value].replace(/\D+/g, '') : item[searchLocationKey.value]

        return regexp.test(value)
    }) : props.citizens
}
watch(() => searchValue.value, ()=> {
    emit('resultSearchAndSoring', resultSearch())
})
const optionsForSelected = computed<string[]>(()=>{
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
    background-color: var(--blue);
    width: 100%;
    min-height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    &__search {
        display: inline-flex;
        flex-direction: row;
        justify-content: flex-start;
        background-color: var(--blue-light);
        border-radius: 6px;
        padding: 6px;
        & div {
            margin: 0 6px;
        }
    }
}
</style>