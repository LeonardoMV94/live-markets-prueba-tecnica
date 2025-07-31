import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConstituensResponse } from '../interfaces/constituens.interfaces'
import { useFetch } from '../composables/useFetch'

export const useConstituensStore = defineStore('constituens', () => {
  const constituens = ref<ConstituensResponse | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const getConstituens = async () => {
    loading.value = true
    error.value = null

    const { data, error: fetchError, loading: fetchLoading, refetch } =
      useFetch<ConstituensResponse>('/data/constituyentes/constituensList.json', false)

    await refetch()
    console.log("store data constituens", data.value)
    constituens.value = data.value
    error.value = fetchError.value
    loading.value = fetchLoading.value
  }

  return {
    constituens,
    loading,
    error,
    getConstituens,
  }
})
