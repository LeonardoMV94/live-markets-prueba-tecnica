<template>
    <div class="flex flex-row items-center justify-center">
        <ArrowDownIcon :class="[sizeClass, 'text-red-500']" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowDownIcon } from '@heroicons/vue/24/outline'

// https://heroicons.com/
const props = withDefaults(defineProps<{
    size: number;
}>(), {
    size: 4
});

const sizeClass = computed(() => {
  const allowedSizes = [4, 5, 6, 7, 8]; // agrega más si necesitas
  const validSize = allowedSizes.includes(props.size) ? props.size : 6;
  return `size-${validSize}`;
});
</script>