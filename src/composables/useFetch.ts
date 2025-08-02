import { ref } from 'vue'

/**
 * @description composable para obtener los datos reactivos y tipados desde una api con metodo GET
 * @param url url de la api
 * @param immediate si se debe ejecutar inmediatamente
 * @param timeout tiempo de espera en milisegundos simulado para la carga de datos
 * @returns data, error, loading, refetch
 */
export function useFetch<T = unknown>(url: string, immediate = true, timeout = 300) {
  // Determinar si estamos en producción (GitHub Pages)
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  const baseUrl = isProduction ? '/live-markets-prueba-tecnica' : ''
  
  // Construir la URL completa
  const fullUrl = `${baseUrl}${url}`
  /**
   * @description datos reactivos tipado con generico
   * 
   */
  const data = ref<T | null>(null)
  /**
   * @description error reactivos tipado con Error
   */
  const error = ref<Error | null>(null)
  /**
   * @description loading reactivos tipado con booleano
   */
  const loading = ref<boolean>(false)

  /**
   * @description funcion para obtener los datos desde una api con metodo GET
   * @returns data, error, loading, refetch
   * @example
   * const { data, error, loading, refetch } = useFetch<Resumen>('https://api.example.com/data', false, 200)
   * 
   * await refetch()
   * 
   */
  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(fullUrl)
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

  /**
   * @description si se debe ejecutar inmediatamente
   */
  if (immediate) fetchData()

  /**
   * @description retorna los datos reactivos y tipados
   * @returns data, error, loading, refetch
   */
  return { 
    data, 
    error, 
    loading, 
    refetch: fetchData }
}