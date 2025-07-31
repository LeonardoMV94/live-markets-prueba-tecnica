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

    const {
      data,
      error: fetchError,
      loading: fetchLoading,
      refetch
    } = useFetch<HistoryResponse>(`/data/history/history-${instrument}.json`, false)

    await refetch()

    history.value = data.value
    error.value = fetchError.value
    loading.value = fetchLoading.value
  }

  return {
    history,
    error,
    loading,
    refetch: getHistory
  }
})
