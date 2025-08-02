import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '../composables/useFetch'
import type { HistoryResponse } from '../interfaces/history.interfaces'

export const useHistoryStore = defineStore('history', () => {
  const history = ref<HistoryResponse | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const getHistory = async (instrument: string = 'IPSA') => {
    loading.value = true
    error.value = null

    try {
      const {
        data,
        error: fetchError,
        refetch
      } = useFetch<HistoryResponse>(
        `/data/history/history-${instrument}.json`,
        false 
      )

      await refetch()

      if (fetchError.value) {
        throw fetchError.value
      }

      if (!data.value) {
        throw new Error(`No se pudo obtener el historial para el instrumento ${instrument}.`)
      }

      history.value = data.value
    } catch (err) {
      error.value = err instanceof Error
        ? err
        : new Error('Ocurrió un error inesperado al obtener el historial.')
      history.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    history,
    error,
    loading,
    refetch: getHistory
  }
})
