<script setup lang="ts">
import MainLogo from "@/components/MainLogo.vue";
</script>
<template>
    <div class="header">
        <MainLogo/>
    </div>
</template>

<style scoped>
.header {
    background-color: var(--green);
    min-height: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.5;
    max-height: 100vh;
}
</style>