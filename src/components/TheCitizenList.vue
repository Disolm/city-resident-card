<template>
    <div
        class="citizens-list"
        ref="citizenListRef"
    >
        <UiTransitionGroupFade
            v-if="citizens"
            class="citizens-list__transition-group"
        >
            <VirtualList
                v-if="citizens && cities && isShowVirtualList"
                class="citizens-list__virtual-list"
                :data-component="SourceForVirtualList"
                :data-key="'id'"
                :data-sources='citizens || []'
                :extra-props="{extraProps}"
                :estimate-size="heightItem"
                :keeps="14"
                :start="startItemShow"
                @scroll="scrollVirtualList"
            />
            <!--            <UiAlert slot="footer" class="loading-spinner footer-class">Загрузка</UiAlert>-->
            <!--</VirtualList>-->
        </UiTransitionGroupFade>
    </div>
</template>

<script setup lang="ts">
import type {TypeCitizens, TypeCities} from '@/types'
import UiTransitionGroupFade from "@/components/UiTransitionGroupFade.vue";
import SourceForVirtualList from "@/components/SourceForVirtualList.vue";
import UiAlert from "@/components/UiAlert.vue";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import type {Ref} from "vue";

interface IProps {
    citizens: TypeCitizens | null | undefined
    cities: TypeCities | null | undefined
}

const props = defineProps<IProps>()

const extraProps = computed(() => {
    return {cities: props.cities}
})

const startItemShow:Ref<number> = ref(0)
const heightItem: number = 270
watch(() => JSON.stringify(props.citizens), () => {
    startItemShow.value = 0
})
const scrollVirtualList = (event): void => {
    startItemShow.value = Math.floor((event.target.scrollTop + heightItem) / heightItem) - 1
}


const isShowVirtualList: Ref<boolean> = ref(false)
const citizenListRef: Ref<HTMLDivElement | null> = ref(null)

const heightDiv: Ref<number> = ref(citizenListRef.value?.clientHeight || 0)
const heightCitizenListDivTake = async () => {
    isShowVirtualList.value = false
    await nextTick(() => {
        heightDiv.value = citizenListRef.value?.clientHeight || 0
    })
    isShowVirtualList.value = true
}
const heightCitizenListDiv = computed<string>(() => {
    return heightDiv.value + 'px'
})

onMounted(() => {
    heightCitizenListDivTake()
    window.addEventListener('resize', () => {
        heightCitizenListDivTake()
    })
})
onUnmounted(() => {
    window.removeEventListener("resize", () => {
        heightCitizenListDivTake()
    })
})
</script>

<style scoped lang="scss">
.citizens-list {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: auto;

    &__transition-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__virtual-list {
        height: v-bind(heightCitizenListDiv);
        width: 100%;
        overflow-y: auto;
    }
}
</style>