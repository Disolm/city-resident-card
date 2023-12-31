<template>
    <component
        :is="tag!"
        class="button"
        :class="[classForButton, {'button_block': block}]"
        :[type]="'button'"
    >
        <slot/>
    </component>
</template>

<script lang="ts">

import {defineComponent} from 'vue';

export default defineComponent({
    name: 'UiButton',
    props: {
        tag: {
            type: String,
            required: false,
            default: 'button'
        },
        variant: {
            type: String,
            required: false,
            validator: (value) => ['primary', 'secondary', 'danger'].includes(value),
            default: 'secondary'
        },
        block: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        classForButton(): string {
            return `button_${this.variant}`
        },
        type(): string | null {
            return this.tag === 'button' ? 'type' : null
        }
    }
});
</script>

<style scoped>
/* _button.css */
.button {
    display: inline-block;
    padding: 6px 12px;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    color: initial;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 2px;
    transition-duration: 0.2s;
    transition-property: background-color, border-color, color;
    outline: none;
    box-shadow: none;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none;
}

.button.button_block {
    display: block;
    width: 100%;
}

.button_primary {
    background-color: var(--blue);
    border-color: var(--blue);
    color: var(--white);
}

.button_primary:hover {
    background-color: var(--blue-light);
    border-color: var(--blue-light);
}

.button_secondary {
    background-color: var(--white);
    border-color: var(--blue);
    color: var(--blue);
}

.button_secondary:hover {
    border-color: var(--blue-light);
}

.button_danger {
    background-color: var(--white);
    border-color: var(--red);
    color: var(--red);
}

.button_danger:hover {
    border-color: var(--red-light);
}
</style>
