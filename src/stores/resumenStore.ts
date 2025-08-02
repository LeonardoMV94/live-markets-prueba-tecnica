import { defineStore } from "pinia";
import { ref } from "vue";
import { useFetch } from "../composables/useFetch";
import type { ResumenResponse } from "../interfaces/resumen.interfaces";


export const useResumenStore = defineStore("resumen", () => {
  const resumen = ref<ResumenResponse | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const getResumen = async (instrument: string = "IPSA") => {
    loading.value = true;
    error.value = null;

    const {
      data,
      error: fetchError,
      loading: fetchLoading,
      refetch,
    } = useFetch<ResumenResponse>(`/data/resumen/${instrument}.json`,false);

    await refetch();

    resumen.value = data.value;
    error.value = fetchError.value;
    loading.value = fetchLoading.value;
  };

  return {
    resumen,
    error,
    loading,
    getResumen,
  };
});
