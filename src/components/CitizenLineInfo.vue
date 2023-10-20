<template>
    <div
        class="citizen-line-info"
    >
        <div class="citizen-line-info__title">
            <slot name='title'></slot>
        </div>
        <div class="citizen-line-info__description">
            <slot name='description'></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.citizen-line-info {
    height: 24px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: flex-start;

    &__title {
        margin-right: 2px;
    }

    &__description {
    }


}
</style>