import { defineStore } from "pinia";
import type { ConstituensResponse } from "../interfaces/constituens.interfaces";
import { useFetch } from "../composables/useFetch";

export const useConstituensStore = defineStore("constituens", () => {
  const {
    data: constituens,
    error,
    loading,
    refetch: getConstituens,
  } = useFetch<ConstituensResponse>(
    "/data/constituyentes/constituensList.json",
    false
  );

  return {
    constituens,
    loading,
    error,
    getConstituens,
  };
});
