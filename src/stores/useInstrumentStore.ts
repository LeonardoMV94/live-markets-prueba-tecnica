import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useInstrumentStore = defineStore('instrument', () => {
  const instrumentSelected = ref('IPSA')

  function setInstrument(newInstrument: string = 'IPSA') {
    instrumentSelected.value = newInstrument
  }

  return {
    instrumentSelected,
    setInstrument,
  }
})