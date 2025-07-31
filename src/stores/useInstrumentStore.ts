import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInstrumentStore = defineStore('instrument', () => {
  const instrument = ref('IPSA')

  function setInstrument(newInstrument: string = 'IPSA') {
    instrument.value = newInstrument
  }

  return {
    instrument,
    setInstrument,
  }
})