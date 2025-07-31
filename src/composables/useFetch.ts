import { ref } from 'vue'
/**
 * @param url url de la api
 * @param immediate si se debe ejecutar inmediatamente
 * @param timeout tiempo de espera en milisegundos simulado para la carga de datos
 * @returns data, error, loading, refetch
 */
export function useFetch<T = unknown>(url: string, immediate = true, timeout = 200) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref<boolean>(false)

  /**
   * @description función para obtener los datos de la api
   */
  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      await new Promise(resolve => setTimeout(resolve, timeout))
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