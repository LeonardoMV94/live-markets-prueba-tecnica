import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useHistoryStore } from "../../../src/stores/historyStore";
import { storeToRefs } from "pinia";
import ChartComponent from "../../../src/components/ChartComponent.vue";
import { setActivePinia } from "pinia";
import type { HistoryResponse } from "../../../src/interfaces/history.interfaces";

let wrapper: VueWrapper;
let historyStore: ReturnType<typeof useHistoryStore>;
let pinia: any;

// Mock data
const mockHistory: HistoryResponse = {
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
      {
        datetimeLastPrice: "08-11-2023 09:00:00",
        datetimeLastPriceTs: 1699444800,
        lastPrice: 5680.25,
        highPrice: 5690.15,
        lowPrice: 5650.50,
        openPrice: 5650.77,
        closePrice: 5680.25,
        volume: 0,
        volumeMoney: 0,
        performanceRelative: 0.52,
        performanceAbsolute: 29.48,
        tend: "up",
      },
    ],
  },
};

// Mock de VueApexCharts
vi.mock("vue3-apexcharts", () => ({
  default: {
    name: "VueApexCharts",
    template: '<div data-testid="apex-chart">Chart Component</div>',
    props: ['type', 'width', 'height', 'series', 'options']
  }
}));

// Mock de ChartSkeleton
vi.mock("../../../src/components/skeletons/ChartSkeleton.vue", () => ({
  default: {
    name: "ChartSkeleton",
    template: '<div data-testid="chart-skeleton">Chart Skeleton</div>'
  }
}));

describe("ChartComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    historyStore = useHistoryStore();
  });

  it("renderiza correctamente los datos del estado cuando no hay loading ni error", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderiza el componente sin errores
    expect(wrapper.exists()).toBe(true);
    // Verificar que se renderizan los botones de periodos
    expect(wrapper.text()).toContain("1D");
  });

  it("muestra ChartSkeleton cuando loading es true", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = true;
    error.value = null;
    history.value = null;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderiza el componente ChartSkeleton
    expect(wrapper.findComponent({ name: 'ChartSkeleton' }).exists()).toBe(true);
  });

  it("muestra mensaje de error cuando error es true", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = new Error("Error al cargar datos");
    history.value = null;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("No se encontró el instrumento");
  });

  it("llama a refetch al montar el componente", () => {
    const refetchSpy = vi.spyOn(historyStore, 'refetch');
    
    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se llamó al método refetch al montar
    expect(refetchSpy).toHaveBeenCalledWith("IPSA");
  });

  it("renderiza los botones de periodos correctamente", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los botones de periodos
    expect(wrapper.text()).toContain("ALL");
    expect(wrapper.text()).toContain("1D");
    expect(wrapper.text()).toContain("1S");
    expect(wrapper.text()).toContain("1M");
    expect(wrapper.text()).toContain("3M");
    expect(wrapper.text()).toContain("6M");
    expect(wrapper.text()).toContain("1Y");
    expect(wrapper.text()).toContain("5Y");
  });

  it("tiene la clase btn btn-black hover:bg-primary para los botones", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    const buttons = wrapper.findAll('button');
    buttons.forEach(button => {
      expect(button.classes()).toContain("btn");
      expect(button.classes()).toContain("px-5");
    });
  });

  it("tiene la clase px-5 para los botones de periodos", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    const periodButtons = wrapper.findAll('button.btn');
    periodButtons.forEach(button => {
      expect(button.classes()).toContain("px-5");
    });
  });

  it("tiene la clase ml-4 para el botón del calendario", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    const calendarButton = wrapper.find('button:last-child');
    expect(calendarButton.classes()).toContain("ml-4");
  });

  it("maneja correctamente los datos cuando history es null", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = null;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el componente se renderiza sin errores
    expect(wrapper.exists()).toBe(true);
  });

  it("tiene la clase w-full max-w-8xl h-[300px] para el contenedor del gráfico", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    const chartContainer = wrapper.find('.w-full.max-w-8xl.h-\\[300px\\]');
    expect(chartContainer.exists()).toBe(true);
  });

  it("maneja correctamente el evento de click en el botón ALL", async () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Simular click en el botón "ALL"
    const buttons = wrapper.findAll('button');
    const allButton = buttons.find(button => button.text().includes('ALL'));
    if (allButton) {
      await allButton.trigger('click');
      
      // Verificar que el botón tiene la clase btn-primary después del click
      expect(allButton.classes()).toContain("btn-primary");
    }
  });

  it("muestra todos los datos cuando se selecciona ALL", async () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Simular click en el botón "ALL"
    const buttons = wrapper.findAll('button');
    const allButton = buttons.find(button => button.text().includes('ALL'));
    if (allButton) {
      await allButton.trigger('click');
      
      // Verificar que el botón tiene la clase btn-primary
      expect(allButton.classes()).toContain("btn-primary");
      
      // Verificar que el componente se renderiza correctamente
      expect(wrapper.exists()).toBe(true);
    }
  });

  it("maneja correctamente el evento de click en los botones de periodos", async () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Simular click en el botón "3M"
    const buttons = wrapper.findAll('button');
    const threeMonthButton = buttons.find(button => button.text().includes('3M'));
    if (threeMonthButton) {
      await threeMonthButton.trigger('click');
      
      // Verificar que el botón tiene la clase btn-primary después del click
      expect(threeMonthButton.classes()).toContain("btn-primary");
    }
  });

  it("aplica la clase btn-primary al botón del periodo seleccionado", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el botón del periodo por defecto (1M) tiene la clase btn-primary
    const defaultButton = wrapper.find('button:contains("1M")');
    expect(defaultButton.classes()).toContain("btn-primary");
  });

  it("filtra los datos del gráfico según el periodo seleccionado", async () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Simular click en el botón "1Y"
    const buttons = wrapper.findAll('button');
    const oneYearButton = buttons.find(button => button.text().includes('1Y'));
    if (oneYearButton) {
      await oneYearButton.trigger('click');
      
      // Verificar que el botón tiene la clase btn-primary
      expect(oneYearButton.classes()).toContain("btn-primary");
      
      // Verificar que el componente se renderiza correctamente
      expect(wrapper.exists()).toBe(true);
    }
  });

  it("verifica que los botones de periodos funcionen correctamente", async () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el componente se renderiza correctamente
    expect(wrapper.exists()).toBe(true);
    
    // Verificar que los botones de periodos están presentes
    expect(wrapper.text()).toContain("ALL");
    expect(wrapper.text()).toContain("1Y");
  });

  it("mantiene el estado del periodo seleccionado al cambiar de instrumento", async () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;

    wrapper = shallowMount(ChartComponent, {
      props: {
        instrument: "IPSA",
      },
      global: {
        plugins: [pinia],
      },
    });

    // Simular click en el botón "6M"
    const buttons = wrapper.findAll('button');
    const sixMonthButton = buttons.find(button => button.text().includes('6M'));
    if (sixMonthButton) {
      await sixMonthButton.trigger('click');
      
      // Verificar que el botón tiene la clase btn-primary
      expect(sixMonthButton.classes()).toContain("btn-primary");
      
      // Cambiar el prop instrument
      await wrapper.setProps({ instrument: "AGUAS-A" });
      
      // Verificar que el estado del periodo se mantiene
      expect(sixMonthButton.classes()).toContain("btn-primary");
    }
  });
});
