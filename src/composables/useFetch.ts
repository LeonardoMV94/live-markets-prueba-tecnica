import { ref } from 'vue'

export function useFetch<T = unknown>(url: string, immediate = true) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const json = (await response.json()) as T
      data.value = json
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  if (immediate) fetchData()

  return { data, error, loading, refetch: fetchData }
}