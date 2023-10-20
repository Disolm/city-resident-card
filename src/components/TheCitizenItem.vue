<template>
    <div
        class="citizens-item"
        @mouseover="citizenEditedCursor = true"
        @mouseleave="[citizenEditedCursor = false, clickOnDelete = false]"
        :ref="'citizen-item'+ citizen.id"
        v-clickOutside="() => clickOnEdit = false"
        @dblclick="isOpenModal=true"
    >
        <div class="citizens-item__photo"/>
        <div
            class="citizens-item__info-list"
        >
            <CitizenLineInfoForm
                :clickOnEdit="clickOnEdit"
                :cities="cities"
                :citizen="citizen"
                @localCitizen="localCitizen = $event"
            />
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
        <UiModalWindow
            @closeModal="isOpenModal = false"
            :isOpenModal="isOpenModal"
        >
            <div
                class="citizens-item__modal-window"
            >
                <CitizenLineInfoForm
                    :clickOnEdit="true"
                    :cities="cities"
                    :citizen="citizen"
                    :openWithModal=true
                    @localCitizen="localCitizen = $event"
                />
                <UiButton
                    class="citizens-item__button"
                    @click="[saveChanges(), isOpenModal = false]"
                >
                    Сохранить
                </UiButton>
            </div>
        </UiModalWindow>
    </div>
</template>

<script setup lang="ts">
import type {ICitizen, TypeCities, TypeCitizens} from '@/types'
import {computed, ref} from "vue";
import type {Ref} from "vue";
import UiTransitionGroupFade from "@/components/UiTransitionGroupFade.vue";
import DeleteCitizenIcon from "@/components/DeleteCitizenIcon.vue";
import EditCitizenIcon from "@/components/EditCitizenIcon.vue";
import {klona} from "klona";
import {useCitizensStore} from "@/stores/citizens";
import UiModalWindow from "@/components/UiModalWindow.vue";
import CitizenLineInfoForm from "@/components/CitizenLineInfoForm.vue";
import UiButton from "@/components/UiButton.vue";

interface IProps {
    citizen: ICitizen
    cities: TypeCities | null | undefined
}

const props = defineProps<IProps>()
const photo = computed<string>(() => 'url(./src/api/picture/' + props.citizen.photo + ')')
const citizenEditedCursor: Ref<boolean> = ref(false)
const clickOnDelete: Ref<boolean> = ref(false)
const clickOnEdit: Ref<boolean> = ref(false)
const isOpenModal: Ref<boolean> = ref(false)
const localCitizen: Ref<ICitizen | null> = ref(null)


const saveChanges = (): void => {
    const storeCitizens = useCitizensStore();
    const citizens: TypeCitizens = storeCitizens.getCitizens
    let replaceCitizenIndex: number = citizens.findIndex(citizen => citizen.id === localCitizen.value?.id)
    citizens[replaceCitizenIndex] = klona(localCitizen.value) as ICitizen
    clickOnEdit.value = false
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

    &__button {
        margin-top: 40px;
    }
}
</style>