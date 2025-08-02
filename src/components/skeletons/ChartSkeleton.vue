<template>
    <div class="skeleton w-full h-full">
        <div class="w-full max-w-8xl h-[300px]">
            <div width="100%" height="100%" class="skeleton flex items-center justify-center w-full h-full">
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
</template>

<script setup lang="ts">
import IconLoading from '../icons/IconLoading.vue';
import IconCalendar from '../icons/IconCalendar.vue';
</script>