import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { ConstituensResponse } from "../interfaces/constituens.interfaces";
import { useFetch } from "../composables/useFetch";

export const useConstituensStore = defineStore("constituens", () => {
  const {
    data,
    error,
    loading,
    refetch: getConstituens,
  } = useFetch<ConstituensResponse>(
    "/data/constituyentes/constituensList.json",
    false
  );
  const searchTerm = ref<string>('')

  const filteredConstituents = computed(() => {
    const list = data.value?.data?.constituents ?? [];
    if (!searchTerm.value.trim()) return list;

    const term = searchTerm.value.toLowerCase();
    return list.filter((item) =>
      item.shortName.toLowerCase().includes(term)
    );
  })

  const setSearchTerm = (term: string) => {
    searchTerm.value = term
  }
  
  return {
    // raw data
    data,
    loading,
    error,

    // search data
    constituens: filteredConstituents,
    searchTerm,
    setSearchTerm,

    // methods
    getConstituens,
  };
});
