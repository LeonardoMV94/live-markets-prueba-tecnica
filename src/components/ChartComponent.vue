<template>
    <div v-if="loading">
        <ChartSkeleton />
    </div>
    <div v-else-if="error" class="skeleton w-full h-full">
        <p>No se encontró el instrumento</p>
    </div>
    <div v-else>
        <div class="w-full max-w-8xl h-[300px]">
            <VueApexCharts type="area" width="100%" height="100%" :series="chartData" :options="options" />
        </div>
        <div class="flex w-full flex-row gap-2">
            <button 
                class="btn px-5" 
                :class="selectedPeriod === 'ALL' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('ALL')"
            >
                ALL
            </button>
            <button 
                class="btn px-5" 
                :class="selectedPeriod === '1D' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('1D')"
            >
                1D
            </button>
            <button 
                class="btn px-5" 
                :class="selectedPeriod === '1S' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('1S')"
            >
                1S
            </button>
            <button 
                class="btn px-5" 
                :class="selectedPeriod === '1M' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('1M')"
            >
                1M
            </button>
            <button 
                class="btn px-5" 
                :class="selectedPeriod === '3M' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('3M')"
            >
                3M
            </button>
            <button 
                class="btn px-5" 
                :class="selectedPeriod === '6M' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('6M')"
            >
                6M
            </button>
            <button 
                class="btn px-5" 
                :class="selectedPeriod === '1Y' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('1Y')"
            >
                1Y
            </button>
            <button 
                class="btn px-5" 
                :class="selectedPeriod === '5Y' ? 'btn-primary' : 'btn-black hover:bg-primary'"
                @click="selectPeriod('5Y')"
            >
                5Y
            </button>
            <button class="btn btn-black hover:bg-primary px-5 ml-4">                
                <IconCalendar :size="4" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
// Gráfico que muestra la evolución del índice seleccionado en diferentes periodos (1M, 3M, 6M, 1A).
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import VueApexCharts from "vue3-apexcharts";
import IconCalendar from "./icons/IconCalendar.vue"
import { useHistoryStore } from '../stores/historyStore'
import type { Chart } from "../interfaces/history.interfaces";
import ChartSkeleton from "./skeletons/ChartSkeleton.vue";

const props = withDefaults(defineProps<{
    instrument: string
}>(), {
    instrument: 'IPSA'
})

const historyStore = useHistoryStore()

const { history, loading, error } = storeToRefs(historyStore)

// Estado para el periodo seleccionado
const selectedPeriod = ref('ALL')

// Función para seleccionar periodo
const selectPeriod = (period: string) => {
    selectedPeriod.value = period
}

// Función para filtrar datos según el periodo
const filterDataByPeriod = (data: Chart[], period: string): Chart[] => {
    if (!data || data.length === 0) return []
    
    // Si es "ALL", retornar todos los datos sin filtro
    if (period === 'ALL') {
        return data
    }
    
    const now = new Date()
    const periodMap = {
        'ALL': 0, // No filtro, mostrar todos los datos
        '1D': 1,
        '1S': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        '5Y': 1825
    }
    
    const daysToSubtract = periodMap[period as keyof typeof periodMap] || 30
    const cutoffDate = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000))
    
    // Filtrar datos basándose en la fecha de corte
    return data.filter(item => {
        const itemDate = new Date(item.datetimeLastPriceTs * 1000)
        return itemDate >= cutoffDate
    })
}

const chartData = computed(() => {
    const filteredData = filterDataByPeriod(history.value?.data.chart || [], selectedPeriod.value)
    return [{
        name: 'Price',
        data: filteredData.map((item: Chart) => item.lastPrice) || []
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
    yaxis:{
        labels: {
            show: true,
            style: {
                colors: ['#9b9b9b']
            }
        }
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
</script>

<style scoped></style>