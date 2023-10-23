<template>
    <div
        class="citizens-item"
        @mouseover="citizenEditedCursor = true"
        @mouseleave="mouseleaveMainDiv"
        :ref="'citizen-item'+ citizen.id"
        v-clickOutside="() => {clickOnEdit = false; citizenEditedCursor = false}"
        @dblclick="isOpenModalEdit = true"
    >
        <div class="citizens-item__photo"
             :style="props.citizen.photo && {'--bg-url': 'url(' + photo + ')'}"
        />
        <div
            class="citizens-item__info-list"
        >
            <CitizenLineInfoForm
                :clickOnEdit="clickOnEdit"
                :cities="cities"
                :citizen="citizen"
                @localCitizenChang="localCitizen = $event"
            />
        </div>
        <UiTransitionGroupFade class="citizens-item__icons">
            <template v-if="citizenEditedCursor">
                <EditCitizenIcon
                    class="citizens-item__icon"
                    key="EditCitizenIcon"
                    @mouseup="clickOnEdit = true"
                    @cancellationEdit="clickOnEdit = false"
                    @save-changes="saveChanges()"
                    v-if="!clickOnDelete"
                />
                <DeleteCitizenIcon
                    class="citizens-item__icon"
                    key="DeleteCitizenIcon"
                    v-if="!clickOnEdit"
                    @mouseup="() => {clickOnDelete = true}"
                    @cancellationDelete="clickOnDelete = false"
                    :citizen="props.citizen"
                />
            </template>
        </UiTransitionGroupFade>
        <UiModalWindow
            variant="secondary"
            @closeModal="closeModalWindow($event,'modalEdit')"
            :is-open-modal="isOpenModalEdit"
        >
            <div
                class="citizens-item__modal-window"
            >
                <UiImageUploader
                    :preview="photo"
                    @select="handleSelect"
                />
                <CitizenLineInfoForm
                    :clickOnEdit="true"
                    :cities="cities"
                    :citizen="citizen"
                    :openWithModal=true
                    @localCitizenChang="localCitizen = $event"
                />
                <UiButton
                    variant="secondary"
                    class="citizens-item__button"
                    @click="[saveChanges(), isOpenModalEdit = false]"
                >
                    Сохранить
                </UiButton>
            </div>
        </UiModalWindow>
        <UiModalWindow
            :is-open-modal="isOpenModalWarning"
            @closeModal="closeModalWindow($event,'modalWarning')"
            variant="danger"
            titleButton="Закрыть"
        >
            <div>"Данные были изменены, сохраните или отмените изменения"</div>
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
import UiImageUploader from "@/components/UiImageUploader.vue";

interface IProps {
    citizen: ICitizen
    cities: TypeCities | null | undefined
}

const props = defineProps<IProps>()
const photo = computed<string>(() => props.citizen.photo)
const citizenEditedCursor: Ref<boolean> = ref(false)
const clickOnDelete: Ref<boolean> = ref(false)
const clickOnEdit: Ref<boolean> = ref(false)
const isOpenModalEdit: Ref<boolean> = ref(false)
const isOpenModalWarning: Ref<boolean> = ref(false)
const localCitizen: Ref<ICitizen | null> = ref(null)

const mouseleaveMainDiv = ():void => {
    if (!clickOnEdit.value) citizenEditedCursor.value = false
    clickOnDelete.value = false
}
const saveChanges = (): void => {
    const storeCitizens = useCitizensStore();
    const citizens: TypeCitizens = storeCitizens.getCitizens
    let replaceCitizenIndex: number = citizens.findIndex(citizen => citizen.id === localCitizen.value?.id)
    citizens[replaceCitizenIndex] = klona(localCitizen.value) as ICitizen
    clickOnEdit.value = false
}
const closeModalWindow = (target: string, toCloseWhat: string): void => {
    if (target === 'click') {
        if (toCloseWhat === 'modalEdit') isOpenModalEdit.value = false
        if (toCloseWhat === 'modalWarning') isOpenModalWarning.value = false
    }
    if (target === 'overLay') {
        if (toCloseWhat === 'modalWarning') isOpenModalWarning.value = false
        if (toCloseWhat === 'modalEdit') {
            const citizenSting: string = JSON.stringify(props.citizen)
            const localCitizenSting: string = JSON.stringify(localCitizen.value)
            if (citizenSting === localCitizenSting || !localCitizen.value) {
                isOpenModalEdit.value = false
            } else {
                isOpenModalWarning.value = true

            }
        }
    }
}
const handleSelect = (urlImg) => {
    if (!localCitizen.value?.photo) {
        localCitizen.value = klona(props.citizen)
    }
    if ("photo" in localCitizen.value) {
        localCitizen.value.photo = urlImg
    }
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
        --bg-url: var(--default-cover);
        background-image: var(--bg-url);
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