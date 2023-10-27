<template>
  <Transition name="fade" mode="out-in">
    <slot />
  </Transition>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'UiTransitionFade',
});
</script>

<style scoped>
/* _transitions.css */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
