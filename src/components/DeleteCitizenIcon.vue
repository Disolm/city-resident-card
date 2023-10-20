<template>
    <div class="delete-citizen-icon">
        <UiIcon
            icon="trash-bin"
            key="delete"
            v-if="!deletionConfirmation"
            @click="deletionConfirmation = true"
            class="delete-citizen-icon_click"
        />
        <template v-if="deletionConfirmation">
            <UiIcon
                icon="check-mark"
                key="confirmation"
                @click="deleteLine"
                class="delete-citizen-icon_click"
            />
            <UiIcon
                icon="cross"
                key="cancellation"
                @click="cancellation"
                class="delete-citizen-icon_click"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import {useCitizensStore} from "@/stores/citizens";
import UiIcon from "@/components/UiIcon.vue";
import type {Ref} from "vue";
import {ref} from "vue";
import type{ICitizen} from "@/types";
const emit = defineEmits(['cancellationDelete'])
const deletionConfirmation: Ref<boolean> = ref(false)
interface IProps {
    citizen: ICitizen
}
const props = defineProps<IProps>()
const storeCitizens = useCitizensStore();

const deleteLine = (): void => {
    const citizensArray = storeCitizens.getCitizens
    const newArrayCitizens = citizensArray.filter(item => {
        return item.id !== props.citizen.id
    })
    storeCitizens.setCitizens(newArrayCitizens)
}
const cancellation = (): void => {
    deletionConfirmation.value = false
    emit('cancellationDelete')
}
</script>

<style scoped lang="scss">
.delete-citizen-icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    @include icon-edit
}
</style>