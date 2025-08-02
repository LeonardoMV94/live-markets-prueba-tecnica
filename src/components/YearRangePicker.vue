<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: { startYear?: string, endYear?: string }
}>()

const emit = defineEmits<{
  (e: 'update:range', value: { startYear: string, endYear: string }): void
}>()

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString())

const startYear = ref(props.modelValue?.startYear || '')
const endYear = ref(props.modelValue?.endYear || '')

// Emitir cuando cambia
watch([startYear, endYear], () => {
  emit('update:range', {
    startYear: startYear.value,
    endYear: endYear.value
  })
})
</script>

<template>
  <div class="flex gap-4 items-end border border-base-300 rounded-box p-4">
    <!-- Año inicio -->
     
    <div>
      <label class="label">
        <span class="label-text">Año inicio</span>
      </label>
      <select v-model="startYear" class="select select-bordered bg-base-100 text-base-content">
        <option disabled value="">Selecciona año</option>
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <!-- Año fin -->
    <div>
      <label class="label">
        <span class="label-text">Año fin</span>
      </label>
      <select v-model="endYear" class="select select-bordered bg-base-100 text-base-content">
        <option disabled value="">Selecciona año</option>
        <option
          v-for="year in years.filter(y => y >= startYear)"
          :key="year"
          :value="year"
        >
          {{ year }}
        </option>
      </select>
    </div>
  </div>
</template>
