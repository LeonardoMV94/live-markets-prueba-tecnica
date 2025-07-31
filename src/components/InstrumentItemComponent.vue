<template>
    <tr @click="handleClick(props.item.shortName)" class="cursor-pointer">
        <td class="pr-10">
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

// Cada fila de la lista de instrumentos, la cual debe ser interactiva.
const props = defineProps<{
    item: Constituent
}>()

const handleClick = (shortName: string) => {
    console.log('clicked', shortName)
}

const formaterNumerToPercert = (num: number) => {
    const numFormated = num.toFixed(2)
    if (num > 0) {
        return '+' + numFormated + '%'
    } else if (num < 0) {
        return numFormated + '%'
    } else {
        return numFormated + '%'
    }
}

const isPositive = (num: number) => {
    if (num > 0) {
        return 'text-green-500'
    } else if (num < 0) {
        return 'text-red-500'
    } else {
        return 'text-white'
    }
}
</script>

<style scoped></style>