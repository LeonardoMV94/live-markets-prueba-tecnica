<template>
    <h1 class="text-2xl font-bold">{{ props.shortName }}, {{ props.countryName }}</h1>
    <p class="text-base ">Indice:</p>
    <div class="flex w-full flex-row gap-2">
        <p class="text-base text-gray-500 font-bold">Valor Actual: </p>
        <p :class="priceColorClass">{{ priceFormater(props.actualPrice) }}</p>
        <p class="text-base text-gray-500 ">Variación:</p>
        <p :class="variationColorClass">{{ props.variation }}%</p>
        <p class="text-base text-gray-500 ">Variación en puntos: </p>
        <p :class="variationPointsColorClass">{{ props.variationPoints }}</p>
    </div>
</template>

<script setup lang="ts">
// Muestra el nombre del índice (IPSA) y el valor actual con sus variaciones.
import { useColor } from "../composables/useGetColor";
import { priceFormater } from "../utils/price.formater";

const props = defineProps<{
    shortName: string;
    countryName: string;
    actualPrice: number;
    variation: number;
    variationPoints: number;
}>();

// Usando el composable genérico con configuraciones mínimas
const { colorClass: priceColorClass } = useColor(props.actualPrice);

const { colorClass: variationColorClass } = useColor(props.variation);

const { colorClass: variationPointsColorClass } = useColor(props.variationPoints);
</script>

<style scoped></style>