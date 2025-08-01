<template>
    <div class="flex flex-col gap-4 px-8 py-2 bg-black">
        <div></div>
        <SearchBarComponent />

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div class="lg:col-span-4 flex flex-col gap-4">
                <HeaderComponent shortName="IPSA" countryName="Chile" :actualPrice="6474.37" :variation="variation"
                    :variationPoints="-51.01" />
                <ChartComponent class="" instrument="IPSA" />
            </div>

            <SummaryComponent class="lg:col-span-1 lg:mt-10" />
        </div>
        <TabComponent />
        <div class="flex flex-col items-start justify-center">
            <p class="text-sm text-gray-500">* Ultimo precio. Monto Transado y Variacion daria con desfase de 15
                minutos. Haz click en cada instrumento para ver información actualizada en el gráfico</p>
            <p class="text-sm text-gray-500">** Variacion a 30d. Año actual y 12 meses calculadas con el precio de
                cierre al ultimo dia habil</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchBarComponent from "../components/SearchBarComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import ChartComponent from "../components/ChartComponent.vue";
import TabComponent from "../components/TabComponent.vue";
import SummaryComponent from "../components/SummaryComponent.vue";
import { ref } from "vue";

const variation = ref(-1.74);
</script>