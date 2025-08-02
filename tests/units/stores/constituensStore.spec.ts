import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia, storeToRefs } from "pinia";
import { nextTick, ref, type Ref } from "vue";
import { useConstituensStore } from "../../../src/stores/constituensStore";
import type { ConstituensResponse } from "../../../src/interfaces/constituens.interfaces";

// Simula refs reactivos
const data = ref<ConstituensResponse | null>(null);
const error = ref<Error | null>(null);
const loading = ref<boolean>(false);

const mockResponse: ConstituensResponse = {
  success: true,
  code: 200,
  data: {
    info: {
      name: "IPSA",
      shortName: "IPSA",
      countryName: "Chile",
      codeInstrument: "IPSA",
    },
    constituents: [
      {
        codeInstrument: "AGUAS-A",
        name: "AGUAS ANDINAS S.A., SERIE A",
        shortName: "AGUAS-A",
        pctDay: 0,
        pct30D: 0.3653001734253314,
        pctCY: -4.427266338721014,
        pct1Y: 1.5152646114801938,
        lastPrice: 272,
        datetimeLastPrice: "06-11-2024 12:20:25",
        volumeMoney: 778464,
        accumulatedVolumeMoney: 158922209,
        tend: "same",
        performanceAbsolute: 0,
        performanceRelative: 0,
      },
    ],
  },
};

// Mock de useFetch
vi.mock("../../../src/composables/useFetch", () => {
  return {
    useFetch: () => ({
      data,
      error,
      loading,
      refetch: vi.fn().mockImplementation(() => {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          data.value = mockResponse;
        }, 100); // simulan un delay de 100ms
      }),
    }),
  };
});

describe("useConstituensStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    data.value = null;
    error.value = null;
    loading.value = false;
    vi.useFakeTimers(); // añade soporte para timers
  });

  it("should call refetch and update data", async () => {
    const store = useConstituensStore();
    const { constituens, data } = storeToRefs(store);

    expect(data.value).toBeNull(); // comprobar que el valor inicial es null
    
    await store.getConstituens(); // Ejecutamos el fetch (refetch) async
    vi.advanceTimersByTime(101); // avanza el tiempo simulado

    
    await nextTick(); // que vue actualice los reactivos
    
    expect(constituens.value).toBeDefined(); // esperamos que constituens tenga datos

    // comprobar que constituens tiene datos
    expect(constituens.value?.length).toBe(1);
    expect(data.value?.data.info.name).toBe("IPSA");

    // comprobar que error y loading son null
    expect(error.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it("should filter constituents based on searchTerm", async () => {
    const store = useConstituensStore();

    store.getConstituens();
    vi.advanceTimersByTime(101);
    await nextTick();

    // No hay filtro aún
    expect(store.constituens.length).toBe(1);

    // Filtrar por algo que no coincide
    store.setSearchTerm("BANCO");
    await nextTick();

    expect(store.constituens.length).toBe(0);

    // Filtrar por coincidencia parcial
    store.setSearchTerm("AGUAS");
    await nextTick();

    expect(store.constituens.length).toBe(1);
  });

  //limpiar mocks y tiempos
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });
});
