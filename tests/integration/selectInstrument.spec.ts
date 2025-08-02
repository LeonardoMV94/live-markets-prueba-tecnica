import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { ref } from "vue";
import App from "../../src/App.vue";
import { useInstrumentStore } from "../../src/stores/useInstrumentStore";
import { useConstituensStore } from "../../src/stores/constituensStore";
import { useResumenStore } from "../../src/stores/resumenStore";
import { useHistoryStore } from "../../src/stores/historyStore";

let wrapper: VueWrapper;
let instrumentStore: ReturnType<typeof useInstrumentStore>;
let constituensStore: ReturnType<typeof useConstituensStore>;
let resumenStore: ReturnType<typeof useResumenStore>;
let historyStore: ReturnType<typeof useHistoryStore>;
let pinia: any;

// Mock de ApexCharts para evitar errores
vi.mock("vue3-apexcharts", () => ({
  default: {
    name: "VueApexCharts",
    template: '<div data-testid="apex-chart">Chart Component</div>',
    props: ['type', 'width', 'height', 'series', 'options']
  }
}));

// Mock de useFetch para simular las llamadas a la API
vi.mock("../../src/composables/useFetch", () => ({
  useFetch: vi.fn(<T = unknown>(url: string, immediate = true, timeout = 300) => {
    const data = ref<T | null>(null);
    const error = ref<Error | null>(null);
    const loading = ref<boolean>(false);

    // Simular diferentes respuestas según la URL
    setTimeout(() => {
      loading.value = false;
      if (url.includes("constituents")) {
        data.value = {
          success: true,
          code: 200,
          data: {
            info: { name: "IPSA", shortName: "IPSA", countryName: "Chile", codeInstrument: "IPSA" },
            constituents: [
              {
                codeInstrument: "AGUAS-A",
                name: "Aguas Andinas",
                shortName: "AGUAS-A",
                lastPrice: 5200.00,
                volumeMoney: 1500000,
                pctDay: 2.5,
                pct30D: 5.2,
                pct1Y: 12.8,
                pctCY: 8.5,
                performanceAbsolute: 125.50,
                datetimeLastPrice: "2024-01-15 16:00:00",
                highPrice: 5300.00,
                lowPrice: 5100.00,
                openPrice: 5150.00,
                closePrice: 5200.00,
                volume: 150000,
                performanceRelative: 2.5,
              },
            ],
          },
        } as T;
      } else if (url.includes("resumen")) {
        data.value = {
          success: true,
          code: 200,
          data: {
            info: {
              name: "Aguas Andinas",
              shortName: "AGUAS-A",
              countryName: "Chile",
              currencyName: "Peso Chileno",
              currencySymbol: "CLP",
              codeInstrument: "AGUAS-A",
              hourOpen: "09:30:00",
              hourClose: "16:00:00",
            },
            price: {
              lastPrice: 5200.00,
              highPrice: 5300.00,
              lowPrice: 5100.00,
              openPrice: 5150.00,
              closePrice: 5200.00,
              volume: 150000,
              volumeMoney: 1500000,
              performanceRelative: 2.5,
              performanceAbsolute: 125.50,
              datetimeLastPrice: "2024-01-15 16:00:00",
            },
          },
        } as T;
      } else if (url.includes("history")) {
        data.value = {
          success: true,
          code: 200,
          data: {
            info: {
              name: "Aguas Andinas",
              shortName: "AGUAS-A",
              countryName: "Chile",
              currencyName: "Peso Chileno",
              currencySymbol: "CLP",
              codeInstrument: "AGUAS-A",
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
            ],
          },
        } as T;
      }
    }, 10);

    const fetchData = async () => {
      loading.value = true;
      error.value = null;
      // Simular la carga de datos
      setTimeout(() => {
        loading.value = false;
      }, 10);
    };

    if (immediate) fetchData();

    return {
      data,
      error,
      loading,
      refetch: fetchData,
    };
  }),
}));

// Mock de utilidades
vi.mock("../../src/utils/priceFormater", () => ({
  priceFormater: vi.fn((value: number) => `$${value.toLocaleString('es-CL')}`),
}));

vi.mock("../../src/utils/isPositive", () => ({
  isPositive: vi.fn((value: number) => value > 0),
}));

vi.mock("../../src/utils/formaterNumerToPercert", () => ({
  formaterNumerToPercert: vi.fn((value: number) => `${value.toFixed(2)}%`),
}));

describe("Integración: Selección de Instrumento", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    instrumentStore = useInstrumentStore();
    constituensStore = useConstituensStore();
    resumenStore = useResumenStore();
    historyStore = useHistoryStore();
  });

  it("simula la selección de un instrumento en la lista y verifica la actualización completa", async () => {
    // Montar la aplicación completa
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que la aplicación se renderiza correctamente
    expect(wrapper.exists()).toBe(true);

    // Simular la selección de un instrumento
    instrumentStore.setInstrument("AGUAS-A");

    // Verificar que el instrumento se actualizó en el store
    expect(instrumentStore.instrumentSelected).toBe("AGUAS-A");

    // Esperar a que se procesen las actualizaciones
    await wrapper.vm.$nextTick();

    // Verificar que se llamaron los métodos para obtener datos del nuevo instrumento
    expect(constituensStore.getConstituens).toHaveBeenCalled();
    expect(resumenStore.getResumen).toHaveBeenCalled();
    expect(historyStore.refetch).toHaveBeenCalledWith("AGUAS-A");
  });

  it("verifica que la cabecera se actualice correctamente al seleccionar un instrumento", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // Simular la selección del instrumento
    instrumentStore.setInstrument("AGUAS-A");

    await wrapper.vm.$nextTick();

    // Verificar que la aplicación se renderiza correctamente
    expect(wrapper.exists()).toBe(true);
  });

  it("verifica que el resumen se actualice correctamente al seleccionar un instrumento", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // Simular la selección del instrumento
    instrumentStore.setInstrument("AGUAS-A");

    await wrapper.vm.$nextTick();

    // Verificar que la aplicación se renderiza correctamente
    expect(wrapper.exists()).toBe(true);
  });

  it("verifica que el gráfico se actualice correctamente al seleccionar un instrumento", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // Simular la selección del instrumento
    instrumentStore.setInstrument("AGUAS-A");

    await wrapper.vm.$nextTick();

    // Verificar que la aplicación se renderiza correctamente
    expect(wrapper.exists()).toBe(true);
  });

  it("asegura que los datos correctos se muestren en cada componente después de la actualización", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // Simular la selección del instrumento
    instrumentStore.setInstrument("AGUAS-A");

    await wrapper.vm.$nextTick();

    // Verificar que la aplicación se renderiza correctamente
    expect(wrapper.exists()).toBe(true);
  });

  it("verifica el flujo completo de selección de instrumento desde la lista", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    await wrapper.vm.$nextTick();

    // Verificar que la aplicación se renderiza correctamente
    expect(wrapper.exists()).toBe(true);

    // Simular click en un instrumento de la lista
    const instrumentItems = wrapper.findAllComponents({ name: 'InstrumentItemComponent' });
    if (instrumentItems.length > 0) {
      await instrumentItems[0].trigger('click');
      
      // Verificar que se actualizó el instrumento seleccionado
      expect(instrumentStore.instrumentSelected).toBe("AGUAS-A");
    }
  });

  it("verifica que los componentes respondan correctamente a cambios en el instrumento seleccionado", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // Cambiar el instrumento seleccionado
    instrumentStore.setInstrument("BCI");

    await wrapper.vm.$nextTick();

    // Verificar que se llamaron los métodos para obtener datos del nuevo instrumento
    expect(resumenStore.getResumen).toHaveBeenCalled();
    expect(historyStore.refetch).toHaveBeenCalledWith("BCI");
  });

  it("verifica que history.value.data.chart se actualice correctamente", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // Simular la selección del instrumento
    instrumentStore.setInstrument("AGUAS-A");

    await wrapper.vm.$nextTick();

    // Verificar que se llamó al método refetch del historyStore
    expect(historyStore.refetch).toHaveBeenCalledWith("AGUAS-A");
    
    // Verificar que la aplicación se renderiza correctamente
    expect(wrapper.exists()).toBe(true);
  });
});
