<script setup lang="ts">
// Lista de instrumentos (acciones) con su información clave.

import InstrumentItemComponent from './InstrumentItemComponent.vue';
import type { Constituent } from '../interfaces/constituens.interfaces'
import { BarsArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/outline'
const props = defineProps<{ constituents: Constituent[] | null }>()
//obtener data de constituents 

</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-xs w-full">
      <thead>
        <tr class="">
          <th>
            <div class="flex flex-row items-center justify-start">
              <div class="pr-2">Nombre</div>
              <button class="flex flex-row items-center justify-center" @click="">
                <BarsArrowDownIcon class="size-4" />
              </button>
            </div>
          </th>
          <th>
            <div class="flex flex-row items-center justify-start">
              <div class="pr-2">Ultimo*</div>
              <button class="flex flex-row items-center justify-center" @click="">
                <ArrowsUpDownIcon class="size-4" />
              </button>
            </div>
          </th>
          <th>
            <div class="flex flex-row items-center justify-start">
              <div class="pr-2">Monto (MM)</div>
              <button class="flex flex-row items-center justify-center" @click="">
                <ArrowsUpDownIcon class="size-4" />
              </button>
            </div>
          </th>
          <th>
            <div class="flex flex-row items-center justify-start">
              <div class="pr-2">Var día</div>
              <button class="flex flex-row items-center justify-center" @click="">
                <ArrowsUpDownIcon class="size-4" />
              </button>
            </div>
          </th>
          <th>
            <div class="flex flex-row items-center justify-start">
              <div class="pr-2">Var 30d**</div>
              <button class="flex flex-row items-center justify-center" @click="">
                <ArrowsUpDownIcon class="size-4" />
              </button>
            </div>
          </th>
          <th>
            <div class="flex flex-row items-center justify-start">
              <div class="pr-2">Año Actual</div>
              <button class="flex flex-row items-center justify-center" @click="">
                <ArrowsUpDownIcon class="size-4" />
              </button>
            </div>
          </th>
          <th>
            <div class="flex flex-row items-center justify-start">
              <div class="pr-2">12 Meses</div>
              <button class="flex flex-row items-center justify-center" @click="">
                <ArrowsUpDownIcon class="size-4" />
              </button>
            </div>
          </th>
        </tr>
        <tr>
          <td colspan="7">
            <div class="divider my-0"></div>
          </td>
        </tr>
      </thead>
      <tbody>
        <InstrumentItemComponent v-for="item in props.constituents || []" :key="item.shortName" :item="item" />
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>