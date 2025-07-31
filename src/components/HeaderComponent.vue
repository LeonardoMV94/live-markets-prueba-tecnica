<template>
    <div v-if="loading">
        <div class="skeleton w-full h-full flex items-center justify-center">
            <IconLoading />
        </div>
    </div>
    <div v-else-if="error" class="skeleton w-full h-full">
        <p>No se encontró el instrumento</p>
    </div>
    <div v-else>
        <h1 class="text-2xl font-bold">{{ resumen?.data.info.shortName }}, {{ resumen?.data.info.countryName }}</h1>
        <div class="text-base text-gray-500 pt-6 pb-0">Indice:</div>
        <div class="divider mt-0"></div>
        <div class="flex w-full flex-row gap-2">
            <p class="text-base text-gray-500 font-bold">Valor Actual: </p>
            <div class="text-white flex flex-row items-center gap-1">
                <IconArrowUp :size="4" v-if="isPositiveArrow" />
                <IconArrowDown :size="4" v-else />
                {{ priceFormater(resumen?.data.price.lastPrice ?? 0) }}
            </div>
            <p class="text-base text-gray-500 ">Variación:</p>
            <p :class="[isPositive(resumen?.data.price.pct30D ?? 0)]">{{ formaterNumerToPercert(resumen?.data.price.pct30D ?? 0) }}%</p>
            <p class="text-base text-gray-500 ">Variación en puntos: </p>
            <p :class="[isPositive(resumen?.data.price.pct30D ?? 0)]">{{ formaterNumerToPercert(resumen?.data.price.pct30D ?? 0) }}</p>
        </div>
        <div class="divider"></div>
    </div>
</template>

<script setup lang="ts">
// Muestra el nombre del índice (IPSA) y el valor actual con sus variaciones.
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { priceFormater } from "../utils/price.formater";
import IconArrowUp from "./icons/IconArrowUp.vue";
import IconArrowDown from "./icons/IconArrowDown.vue";
import { useResumenStore } from "../stores/resumenStore";
import { isPositive } from "../utils/colorText.formater";
import { formaterNumerToPercert } from "../utils/percent.formater";
import IconLoading from "./icons/IconLoading.vue";

const resumenStore = useResumenStore()
const { resumen, loading, error } = storeToRefs(resumenStore)

const isPositiveArrow = computed(() => (resumen?.value?.data.price.lastPrice ?? 0) > 0);


// const props = defineProps<{
//     shortName: string;
//     countryName: string;
//     actualPrice: number;
//     variation: number;
//     variationPoints: number;
// }>();

// Usando el composable genérico con configuraciones mínimas

// const { colorClass: variationColorClass } = useColorValue(props.variation);
// const { colorClass: variationPointsColorClass } = useColorValue(props.variationPoints);
</script>

<style scoped></style>