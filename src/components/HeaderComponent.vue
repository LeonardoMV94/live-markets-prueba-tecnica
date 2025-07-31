<template>
    <div>
        <h1 class="text-2xl font-bold">{{ props.shortName }}, {{ props.countryName }}</h1>
        <div class="text-base text-gray-500 pt-6 pb-0">Indice:</div>
        <div class="divider mt-0"></div>
        <div class="flex w-full flex-row gap-2">
            <p class="text-base text-gray-500 font-bold">Valor Actual: </p>
            <div class="text-white flex flex-row items-center gap-1">
                <IconArrowUp :size="4" v-if="isPositive" />
                <IconArrowDown :size="4" v-else />
                {{ priceFormater(props.actualPrice) }}
            </div>
            <p class="text-base text-gray-500 ">Variación:</p>
            <p :class="[variationColorClass]">{{ props.variation }}%</p>
            <p class="text-base text-gray-500 ">Variación en puntos: </p>
            <p :class="[variationPointsColorClass]">{{ props.variationPoints }}</p>
        </div>
        <div class="divider"></div>
    </div>
</template>

<script setup lang="ts">
// Muestra el nombre del índice (IPSA) y el valor actual con sus variaciones.
import { computed } from "vue";
import { useColorValue } from "../composables/useColorValue";
import { priceFormater } from "../utils/price.formater";
import IconArrowUp from "./icons/IconArrowUp.vue";
import IconArrowDown from "./icons/IconArrowDown.vue";

const isPositive = computed(() => props.actualPrice > 0);


const props = defineProps<{
    shortName: string;
    countryName: string;
    actualPrice: number;
    variation: number;
    variationPoints: number;
}>();

// Usando el composable genérico con configuraciones mínimas

const { colorClass: variationColorClass } = useColorValue(props.variation);
const { colorClass: variationPointsColorClass } = useColorValue(props.variationPoints);
</script>

<style scoped></style>