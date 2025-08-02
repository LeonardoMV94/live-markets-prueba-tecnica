<template>
    <label class="input w-full">        
        <MagnifyingGlassIcon class="size-4" />
        <input 
            v-model="store.searchTerm" 
            type="search" 
            class="grow" 
            placeholder="Busca un instrumento" 
            @input="store.setSearchTerm(($event.target as HTMLInputElement).value)"
        />
    </label>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useConstituensStore } from '../stores/constituensStore';
// Barra de búsqueda de instrumentos
const store = useConstituensStore()

</script>

<style scoped></style>