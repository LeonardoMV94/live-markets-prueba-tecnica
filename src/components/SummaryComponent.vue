<template>
    <div class="flex w-full">
        <div class="tabs tabs-border tabs-xl w-full flex">
            <input type="radio" name="tabulacion" class="tab flex-1 pb-2" aria-label="Resumen" />

            <input type="radio" name="tabulacion" class="tab flex-1 pb-2" aria-label="Detalles" checked />
            <div v-if="loading" class="tab-content skeleton p-2 flex items-center justify-center h-full w-full">
                <IconLoading />
            </div>
            <div v-else-if="error" class="tab-content skeleton w-full p-2 flex items-center justify-center">
                <p>No se encontró el instrumento</p>
            </div>
            <div v-else class="tab-content p-2">
                <div class="flex flex-row justify-between">
                    <p>Cotizacion</p>
                    <p>{{ resumen?.data.price.askDatetime }}</p>
                </div>
                <div class="divider"></div>
                <div class="flex flex-row justify-between">
                    <p>MERCADO</p>
                    <p>{{ resumen?.data.info.marketName }}</p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>APERTURA</p>
                    <p>{{ resumen?.data.price.openPrice }}</p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>CIERRE ANTERIOR</p>
                    <p>{{ resumen?.data.price.closePrice }}</p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>MAXIMO DIARIO</p>
                    <p>{{ resumen?.data.price.maxDay }}</p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>MINIMO DIARIO</p>
                    <p>{{ resumen?.data.price.minDay }}</p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>MAXIMO 52 SEMANAS</p>
                    <p>{{ resumen?.data.price.max52W }}</p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>MINIMO 52 SEMANAS</p>
                    <p>{{ resumen?.data.price.min52W }}</p>
                </div>
                <div class="flex flex-row justify-between mt-4">
                    <p>Variación</p>
                    <p>%</p>
                </div>
                <div class="divider"></div>
                <div class="flex flex-row justify-between">
                    <p>1 MES</p>
                    <p :class="isPositive(resumen?.data.price.pct30D ?? 0)">
                        {{ formaterNumerToPercert(resumen?.data.price.pct30D ?? 0) }}
                    </p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>1 AÑO</p>
                    <p :class="isPositive(resumen?.data.price.pctRelW52 ?? 0)">
                        {{ formaterNumerToPercert(resumen?.data.price.pctRelW52 ?? 0) }}
                    </p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>AÑO A LA FECHA</p>
                    <p :class="isPositive(resumen?.data.price.pctRelCY ?? 0)">
                        {{ formaterNumerToPercert(resumen?.data.price.pctRelCY ?? 0) }}
                    </p>
                </div>


            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Muestra el detalle de la cotización y otros datos relevantes.
import { storeToRefs } from 'pinia';
import { useInstrumentStore } from '../stores/useInstrumentStore';
import { useResumenStore } from '../stores/resumenStore';
import { onMounted, watch } from 'vue';
import { formaterNumerToPercert } from '../utils/percent.formater';
import { isPositive } from '../utils/colorText.formater';
import IconLoading from './icons/IconLoading.vue';

const instrumentStore = useInstrumentStore()
const { instrumentSelected } = storeToRefs(instrumentStore)

const resumenStore = useResumenStore()
const { resumen, loading, error } = storeToRefs(resumenStore)

onMounted(() => {
   resumenStore.getResumen()
})

watch(instrumentSelected, (newInstrument) => {
    console.log("cambio instrumento", newInstrument)
    resumenStore.getResumen(newInstrument)
})
</script>

<style scoped></style>