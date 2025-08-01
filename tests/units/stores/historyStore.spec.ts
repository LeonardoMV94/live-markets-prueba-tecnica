import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia, storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import { useHistoryStore } from "../../../src/stores/historyStore";
import type { HistoryResponse } from "../../../src/interfaces/history.interfaces";

// Simula refs reactivos
const data = ref<HistoryResponse | null>(null);
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

const mockResponse: HistoryResponse = {
  success: true,
  code: 200,
  data: {
    info: {
      name: "IPSA",
      shortName: "IPSA",
      countryName: "Chile",
      currencyName: "Universal",
      currencySymbol: "$$$",
      codeInstrument: "IPSA",
      hourOpen: "09:30:00",
      hourClose: "16:00:00",
    },
    chart: [
      {
        datetimeLastPrice: "06-11-2023 09:00:00",
        datetimeLastPriceTs: 1699272000,
        lastPrice: 5575.48,
        highPrice: 5661.92,
        lowPrice: 5559.23,
        openPrice: 5620.569875,
        closePrice: 5575.48,
        volume: 0,
        volumeMoney: 0,
        performanceRelative: -0.802232,
        performanceAbsolute: -45.09,
        tend: "down",
      },
      {
        datetimeLastPrice: "07-11-2023 09:00:00",
        datetimeLastPriceTs: 1699358400,
        lastPrice: 5650.77,
        highPrice: 5656.72,
        lowPrice: 5569.92,
        openPrice: 5575.482865,
        closePrice: 5650.77,
        volume: 0,
        volumeMoney: 0,
        performanceRelative: 1.350377,
        performanceAbsolute: 75.29,
        tend: "up",
      },
    ],
  },
};

// Mock de useFetch
vi.mock("../../../src/composables/useFetch", () => {
  return {
    useFetch: vi.fn().mockImplementation(() => {
      const refetch = vi.fn().mockImplementation(async () => {
        loading.value = true;
        // Simular un delay mínimo
        await new Promise(resolve => setTimeout(resolve, 10));
        loading.value = false;
        data.value = mockResponse;
        error.value = null;
      });

      return {
        data,
        error,
        loading,
        refetch,
      };
    }),
  };
});

describe("useHistoryStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    data.value = null;
    error.value = null;
    loading.value = false;
  });

  it("should call refetch and update data", async () => {
    const store = useHistoryStore();
    const { history } = storeToRefs(store);

    expect(history.value).toBeNull(); // comprobar que el valor inicial es null

    await store.refetch("IPSA"); // Ejecutamos el fetch (refetch) async

    await nextTick(); // que vue actualice los reactivos

    expect(history.value).toBeDefined(); // esperamos que history tenga datos

    // comprobar que history tiene datos
    expect(history.value?.data.chart.length).toBe(2);
    expect(history.value?.data.info.name).toBe("IPSA");
    expect(history.value?.data.info.codeInstrument).toBe("IPSA");

    // comprobar que error y loading son null
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it("should handle different instruments", async () => {
    const store = useHistoryStore();
    const { history } = storeToRefs(store);

    expect(history.value).toBeNull();

    await store.refetch("BSANTANDER"); // Probar con otro instrumento

    await nextTick();

    expect(history.value).toBeDefined();
    expect(history.value?.data.info.codeInstrument).toBe("IPSA"); // El mock siempre devuelve IPSA
  });

  it("should handle loading state correctly", async () => {
    const store = useHistoryStore();
    const { loading: storeLoading } = storeToRefs(store);

    expect(storeLoading.value).toBe(false);

    const promise = store.refetch("IPSA");
    expect(storeLoading.value).toBe(true);

    await promise;
    await nextTick();

    expect(storeLoading.value).toBe(false);
  });

  //limpiar mocks y tiempos
  afterEach(() => {
    vi.clearAllMocks();
  });
});
