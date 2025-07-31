<template>
    <div class="tabs tabs-border flex flex-col gap-4">
        <div class="flex border-b border-gray-700  gap-4">
            <button class="tab" :class="{ 'tab-active': index === selectedIndex }" @click="handleClick(index)"
                v-for="index in indices" :key="index">
                {{ index }}
            </button>
        </div>
        <div class="">
            <div v-if="loading" class="bg-blue-500 grid grid-cols-1 lg:grid-cols-2 justify-between">
                <div class="overflow-x-auto">
                    <div class="skeleton w-full h-full"></div>
                </div>
                <div class="overflow-x-auto">
                    <div class="skeleton w-full h-full"></div>
                </div>
            </div>
            <div v-else-if="error" class="flex items-center justify-center col-span-2">
                <p>Error al cargar los datos</p>
            </div>
            <div v-else class="grid grid-cols-1 lg:grid-cols-2 justify-between gap-4">
                <InstrumentListComponent :constituents="firstHalf" />
                <InstrumentListComponent :constituents="secondHalf" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useConstituensStore } from '../stores/constituensStore';
import InstrumentListComponent from './InstrumentListComponent.vue';
import { storeToRefs } from 'pinia';
import { useInstrumentStore } from '../stores/useInstrumentStore';

const instrumentStore = useInstrumentStore()
const { instrument } = storeToRefs(instrumentStore)

// Permite cambiar entre diferentes índices (IPSA, IGPA, NASDAQ, etc.).
const indices = ['IPSA', 'IGPA', 'NASDAQ', 'Dow Jones', 'SP/BVL']
const selectedIndex = ref(instrument)

const handleClick = (index: string) => {
    instrumentStore.setInstrument(index)
}

// get data from store
const store = useConstituensStore()
const { constituens, loading , error} = storeToRefs(store)

const constituents = computed(() => constituens?.value?.data?.constituents || [])

const half = computed(() => Math.ceil(constituents.value.length / 2))
const firstHalf = computed(() => constituents.value.slice(0, half.value))
const secondHalf = computed(() => constituents.value.slice(half.value))

onMounted(() => {
    store.getConstituens()
})
</script>

<style scoped></style>