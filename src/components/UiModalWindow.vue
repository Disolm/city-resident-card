<script setup lang="ts">
import UiButton from "@/components/UiButton.vue";

interface IProps {
    isOpenModal: boolean
    variant: string,
    titleButton?: string
}

const emit = defineEmits(['closeModal'])
const props = defineProps<IProps>()
const closeModal = (target: string): void => {
    emit('closeModal', target)
}
</script>
<template>
    <Teleport to="body">
        <div
            v-if="isOpenModal"
            class="modal"
        >
            <div
                class="modal__overlay"
            >
                <div
                    class="modal__window"
                    v-click-outside="() => {closeModal('overLay')}"
                >
                    <slot/>
                    <UiButton
                        class="modal__button"
                        @click="closeModal('click')"
                        :variant="variant"
                    >
                        {{ titleButton ? titleButton : "Отмена" }}
                    </UiButton>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
.modal {

    &__overlay {
        position: fixed;
        z-index: 999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0 , .7);
    }
    &__window {
        position: absolute;
        top: 20%;
        left: 50%;
        min-width: 500px;
        margin-left: -250px;
        background-color: var(--grey-light);
        display: flex;
        flex-direction: column;
        justify-items: center;
        justify-content: center;
        align-items: flex-start;
        border: 2px solid var(--blue);
        border-radius: 8px;
        padding: 20px;
    }
    &__button {
        margin-top: 26px;
    }
}
</style>