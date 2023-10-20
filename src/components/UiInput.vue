<script lang="ts">
export default {

    name: 'UiInput',
    inheritAttrs: false,
    props: {
        modelValue: {
            type: String,
            required: false,
        },
        placeholder: {
            type: String,
            default: ''
        },
        multiline: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ['update:modelValue'],
    computed: {
        tag() {
            return this.multiline ? 'textarea' : 'input'
        }
    },
    methods: {
        focus() {
            (this.$refs.input as HTMLInputElement | HTMLTextAreaElement).focus();
        },
    },
    mounted() {
        this.focus()
    }
};
</script>
<template>
    <div
        class="input"
    >
        <component
            :is="tag"
            ref="input"
            class="input__input"
            :value="modelValue"
            v-bind="$attrs"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement | HTMLTextAreaElement ).value)"
            :placeholder="placeholder"
            pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
        />
    </div>
</template>

<style scoped lang="scss">

.input {
    width: 100%;

    &__input {
        width: 100%;
        min-width: 0;
        max-width: 300px;
        background: var(--green-light);
        color: var(--grey-8);

        &::placeholder {
            color: var(--blue-light);
            font-size: .9em;
        }
    }
}
</style>