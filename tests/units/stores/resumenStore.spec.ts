import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia, storeToRefs } from "pinia";
import { nextTick, ref, type Ref } from "vue";
import { useResumenStore } from "../../../src/stores/resumenStore";
import type { ResumenResponse } from "../../../src/interfaces/resumen.interfaces";

// Simula refs reactivos
const data = ref<ResumenResponse | null>(null);
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

const mockResponse: ResumenResponse = {
  success: true,
  code: 200,
  data: {
    info: {
      name: "IPSA",
      shortName: "IPSA",
      countryName: "Chile",
      currencyName: "Peso Chileno",
      currencySymbol: "CLP",
      codeInstrument: "IPSA",
      marketName: "Santiago Stock Exchange",
      hourOpen: "09:30:00",
      hourClose: "16:00:00",
      trading: true,
      exchangeRate: 1.0,
    },
    price: {
      lastPrice: 5575.48,
      datetimeLastPrice: "06-11-2024 12:20:25",
      openPrice: 5620.57,
      closePrice: 5575.48,
      datetimeClosePrice: "06-11-2024 16:00:00",
      performanceAbsolute: -45.09,
      performanceRelative: -0.802232,
      bid: 5575.00,
      bidVolume: 1000,
      bidDatetime: new Date("2024-11-06T12:20:25"),
      ask: 5576.00,
      askVolume: 1500,
      askDatetime: new Date("2024-11-06T12:20:25"),
      volumeMoney: 408750,
      accumulatedVolumeMoney: 158922209,
      volumeInstrument: 1500,
      accumulatedVolumeInstrument: 28500,
      tend: "down",
      maxDay: 5661.92,
      minDay: 5559.23,
      min52W: 5200.00,
      max52W: 5800.00,
      pct30D: 0.55,
      pctRelW52: 2.5,
      pctRelCY: -4.2,
    },
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

describe("useResumenStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    data.value = null;
    error.value = null;
    loading.value = false;
  });

  it("should call getResumen and update data", async () => {
    const store = useResumenStore();
    const { resumen } = storeToRefs(store);

    expect(resumen.value).toBeNull(); // comprobar que el valor inicial es null

    await store.getResumen("IPSA"); // Ejecutamos el fetch (getResumen) async

    await nextTick(); // que vue actualice los reactivos

    expect(resumen.value).toBeDefined(); // esperamos que resumen tenga datos

    // comprobar que resumen tiene datos
    expect(resumen.value?.data.info.name).toBe("IPSA");
    expect(resumen.value?.data.info.codeInstrument).toBe("IPSA");
    expect(resumen.value?.data.price.lastPrice).toBe(5575.48);
    expect(resumen.value?.data.price.performanceRelative).toBe(-0.802232);

    // comprobar que error y loading son null
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it("should handle different instruments", async () => {
    const store = useResumenStore();
    const { resumen } = storeToRefs(store);

    expect(resumen.value).toBeNull();

    await store.getResumen("BSANTANDER"); // Probar con otro instrumento

    await nextTick();

    expect(resumen.value).toBeDefined();
    expect(resumen.value?.data.info.codeInstrument).toBe("IPSA"); // El mock siempre devuelve IPSA
  });

  it("should handle loading state correctly", async () => {
    const store = useResumenStore();
    const { loading: storeLoading } = storeToRefs(store);

    expect(storeLoading.value).toBe(false);

    const promise = store.getResumen("IPSA");
    expect(storeLoading.value).toBe(true);

    await promise;
    await nextTick();

    expect(storeLoading.value).toBe(false);
  });

  it("should handle price data correctly", async () => {
    const store = useResumenStore();
    const { resumen } = storeToRefs(store);

    await store.getResumen("IPSA");
    await nextTick();

    expect(resumen.value?.data.price.bid).toBe(5575.00);
    expect(resumen.value?.data.price.ask).toBe(5576.00);
    expect(resumen.value?.data.price.volumeMoney).toBe(408750);
    expect(resumen.value?.data.price.tend).toBe("down");
  });

  //limpiar mocks y tiempos
  afterEach(() => {
    vi.clearAllMocks();
  });
});
