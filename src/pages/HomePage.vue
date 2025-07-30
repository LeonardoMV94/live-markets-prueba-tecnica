<template>
    <div class="flex flex-col gap-8 p-8">
        <SearchBarComponent />
        <HeaderComponent shortName="IPSA" countryName="Chile" :actualPrice="6474.37" :variation="-0.74" :variationPoints="-51.01" />
    </div>
</template>

<script setup lang="ts">
import SearchBarComponent from "../components/SearchBarComponent.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
</script>