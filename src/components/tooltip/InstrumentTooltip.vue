<template>
    <div
      class="relative"
      @mousemove="handleMouseMove"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <div class="cursor-pointer text-primary">
        {{ props.instrument.shortName }}
      </div>
  
      <div
        v-if="showTooltip"
        :style="tooltipStyle"
        class="fixed z-50 bg-base-200 p-3 rounded-lg shadow-xl border text-sm w-64 pointer-events-none"
      >
        <p class="font-bold">{{ props.instrument.name }}</p>
        <p>Precio actual: {{ props.instrument.lastPrice }}</p>
        <p>Volumen: {{ props.instrument.volumeMoney }}%</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { Constituent } from '../../interfaces/constituens.interfaces'
  
  const props = defineProps<{
    instrument: Constituent
  }>()
  
  const showTooltip = ref(false)
  const tooltipStyle = reactive<Record<string, string>>({
    top: '0px',
    left: '0px',
    position: 'fixed'
  })
  
  function handleMouseMove(event: MouseEvent) {
    tooltipStyle.top = `${event.clientY + 16}px`
    tooltipStyle.left = `${event.clientX + 16}px`
  }
  </script>
  