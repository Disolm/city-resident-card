<template>
    <div class="edit-citizen-icon">
        <UiIcon
            icon="pencil"
            key="edit"
            class="edit-citizen-icon_click"
            v-if="!editConfirmation"
            @click="editConfirmation = true"
        />
        <template v-if="editConfirmation">
            <UiIcon
                icon="check-mark"
                key="confirmation"
                @click="saveLine"
                class="edit-citizen-icon_click"
            />
            <UiIcon
                icon="cross"
                key="cancellation"
                @click="cancellation"
                class="edit-citizen-icon_click"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import UiIcon from "@/components/UiIcon.vue";
import {ref} from "vue";
import type {Ref} from "vue";
const emit = defineEmits(['cancellationEdit', 'saveChanges'])
const editConfirmation: Ref<boolean> = ref(false)
const saveLine = ():void => {
    editConfirmation.value = false
    emit('saveChanges')
}
const cancellation = ():void => {
    editConfirmation.value = false
    emit('cancellationEdit')
}
</script>

<style scoped lang="scss">
.edit-citizen-icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    @include icon-edit
}
</style>