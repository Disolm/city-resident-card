<template>
    <div class="logo">
        <RouterLink
            :to="{ name: 'home' }"
            class="logo__link"
        >
            <img
                src="../assets/logo.png"
                alt="file-manager"
                class="logo__image"
            />
            <span class="logo__title">
                {{ 'Картотека жителей города'}}
            </span>
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import {RouterLink} from 'vue-router'
</script>

<style scoped lang="scss">
.logo {
    &__link {
        display: block;
        text-align: center;
        margin: 12px auto;
        text-transform: uppercase;
        color: var(--body-color);
        text-decoration: none;
    }
    &__image{
        height: 30px;
        margin-right: 12px;
    }
    &__title {
        font-weight: 900;
        font-size: 34px;
        line-height: 30px;
    }
}

</style>