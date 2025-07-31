<template>
    <div v-if="loading">
        <div class="skeleton w-full h-full">
            <div class="w-full max-w-8xl h-[300px]">
                <div width="100%" height="100%" class="skeleton flex items-center justify-center w-full h-full" >
                    <IconLoading />
                </div>
            </div>
            <div class="flex w-full flex-row gap-2">
                <button class="skeleton btn btn-black hover:bg-primary px-5">1D</button>
                <button class="skeleton btn btn-black hover:bg-primary px-5">1S</button>
                <button class="skeleton btn btn-black hover:bg-primary px-5">1M</button>
                <button class="skeleton btn btn-black hover:bg-primary px-5">3M</button>
                <button class="skeleton btn btn-black hover:bg-primary px-5">6M</button>
                <button class="skeleton btn btn-black hover:bg-primary px-5">1Y</button>
                <button class="skeleton btn btn-black hover:bg-primary px-5">5Y</button>
                <button class="skeleton btn btn-black hover:bg-primary px-5 ml-4">
                    <IconCalendar :size="4" />
                </button>
            </div>
        </div>
    </div>
    <div v-else-if="error" class="skeleton w-full h-full">
        <p>No se encontró el instrumento</p>
    </div>
    <div v-else>
        <div class="w-full max-w-8xl h-[300px]">
            <VueApexCharts type="area" width="100%" height="100%" :series="chartData" :options="options" />
        </div>
        <div class="flex w-full flex-row gap-2">
            <button class="btn btn-black hover:bg-primary px-5">1D</button>
            <button class="btn btn-black hover:bg-primary px-5">1S</button>
            <button class="btn btn-black hover:bg-primary px-5">1M</button>
            <button class="btn btn-black hover:bg-primary px-5">3M</button>
            <button class="btn btn-black hover:bg-primary px-5">6M</button>
            <button class="btn btn-black hover:bg-primary px-5">1Y</button>
            <button class="btn btn-black hover:bg-primary px-5">5Y</button>
            <button class="btn btn-black hover:bg-primary px-5 ml-4">
                <IconCalendar :size="4" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
// Gráfico que muestra la evolución del índice seleccionado en diferentes periodos (1M, 3M, 6M, 1A).
import { computed, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import VueApexCharts from "vue3-apexcharts";
import IconCalendar from "./icons/IconCalendar.vue"
import { useHistoryStore } from '../stores/historyStore'
import type { Chart } from "../interfaces/history.interfaces";
import IconLoading from "./icons/IconLoading.vue";

const props = withDefaults(defineProps<{
    instrument: string
}>(), {
    instrument: 'IPSA'
})

const historyStore = useHistoryStore()

const { history, loading, error } = storeToRefs(historyStore)

const chartData = computed(() => {
    return [{
        name: 'Price',
        data: history.value?.data.chart.map((item: Chart) => item.lastPrice) || []
    }]
})

const options: ApexCharts.ApexOptions = {
    chart: {
        type: 'area',
        height: '100%',
        width: '100%',

        // background: 'transparent',
        toolbar: { show: false },
        zoom: { enabled: false }
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        borderColor: '#232323',
        strokeDashArray: 4,
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'vertical',
            gradientToColors: ['#0061b4'],
            stops: [0, 100],
            opacityFrom: 0.8,
            opacityTo: 0.6
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    xaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false
        }
    },
    tooltip: {
        x: {
            formatter: (value: number) => {
                const date = new Date(value)
                return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            }
        },
        y: {
            formatter: (value: number) => `$${value.toLocaleString('es-CL', { minimumFractionDigits: 2 })}`
        },
        theme: 'dark'
    },

}

onMounted(async () => {
    await historyStore.refetch(props.instrument)
})

watchEffect(() => {
    console.log("cambio chart")
})
</script>

<style scoped></style>