<template>
    <div>
        <div class="w-full max-w-3xl h-[300px]">
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
import VueApexCharts from "vue3-apexcharts";
import { ref } from "vue";
import IconCalendar from "./icons/IconCalendar.vue";

const chartData = ref([
    {
        name: "Price",
        data: [10, 22, 3, 4, 59, 60, 7, 8, 9, 10]
    }
]);

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
    tooltip: {
        x: {
            format: 'dd MMM HH:mm'
        },
        y: {
            formatter: (value: number) => `$${value.toLocaleString('es-CL', { minimumFractionDigits: 2 })}`
        },
        theme: 'dark'
    },
    yaxis: {
        labels: {
            formatter: (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2 }),
            style: {
                colors: '#ccc'
            }
        }
    },

}
</script>

<style scoped></style>