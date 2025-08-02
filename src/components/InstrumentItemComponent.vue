<template>
    <tr @click="handleClick(props.item.shortName)" class="cursor-pointer hover:bg-gray-800">
        <td class="pr-10 ">
            <div class="flex flex-row items-center justify-start">
                <div class="pr-2">{{ props.item.shortName }}</div>
            </div>
        </td>
        <td>
            <div class="flex flex-row items-center justify-center">
                <div class="pr-2">{{ props.item.lastPrice }}</div>
            </div>
        </td>
        <td>
            <div class="flex flex-row items-center justify-center">
                <div class="pr-2">{{ props.item.volumeMoney }}</div>
            </div>
        </td>
        <td>
            <div class="flex flex-row items-center justify-center">
                <div :class="['pr-2', isPositive(props.item.pctDay)]">
                    {{ formaterNumerToPercert(props.item.pctDay) }}
                </div>
            </div>
        </td>
        <td>
            <div class="flex flex-row items-center justify-center">
                <div :class="['pr-2', isPositive(props.item.pct30D)]">
                    {{ formaterNumerToPercert(props.item.pct30D) }}
                </div>
            </div>
        </td>
        <td>
            <div class="flex flex-row items-center justify-center">
                <div :class="['pr-2', isPositive(props.item.pct1Y)]">
                    {{ formaterNumerToPercert(props.item.pct1Y) }}
                </div>
            </div>
        </td>
        <td>
            <div class="flex flex-row items-center justify-center">
                <div :class="['pr-2', isPositive(props.item.performanceAbsolute)]">
                    {{ formaterNumerToPercert(props.item.performanceAbsolute) }}
                </div>
            </div>
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { Constituent } from '../interfaces/constituens.interfaces';
import { isPositive } from '../utils/colorText.formater';
import { formaterNumerToPercert } from '../utils/percent.formater';
import { useInstrumentStore } from '../stores/useInstrumentStore';

const instrumentStore = useInstrumentStore()


// Cada fila de la lista de instrumentos, la cual debe ser interactiva.
const props = defineProps<{
    item: Constituent
}>()

const handleClick = (shortName: string) => {
    instrumentStore.setInstrument(shortName)
}


</script>

<style scoped></style>