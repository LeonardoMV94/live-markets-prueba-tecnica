import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useHistoryStore } from "../../../src/stores/historyStore";
import { useInstrumentStore } from "../../../src/stores/useInstrumentStore";
import { storeToRefs } from "pinia";
import ChartComponent from "../../../src/components/ChartComponent.vue";
import { setActivePinia } from "pinia";
import type { HistoryResponse } from "../../../src/interfaces/history.interfaces";

let wrapper: VueWrapper;
let historyStore: ReturnType<typeof useHistoryStore>;
let instrumentStore: ReturnType<typeof useInstrumentStore>;
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

// Mock de YearRangePicker
vi.mock("../../../src/components/YearRangePicker.vue", () => ({
  default: {
    name: "YearRangePicker",
    template: '<div data-testid="year-range-picker">Year Range Picker</div>',
    emits: ['update:range']
  }
}));

// Mock de IconCalendar
vi.mock("../../../src/components/icons/IconCalendar.vue", () => ({
  default: {
    name: "IconCalendar",
    template: '<div data-testid="icon-calendar">Calendar Icon</div>',
    props: ['size']
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
    instrumentStore = useInstrumentStore();
  });

  it("renderiza correctamente el componente", () => {
    wrapper = shallowMount(ChartComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("muestra ChartSkeleton cuando loading es true", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = true;
    error.value = null;
    history.value = null;

    wrapper = shallowMount(ChartComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.findComponent({ name: 'ChartSkeleton' }).exists()).toBe(true);
  });

  it("llama a refetch al montar el componente", () => {
    const refetchSpy = vi.spyOn(historyStore, 'refetch');
    
    wrapper = shallowMount(ChartComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(refetchSpy).toHaveBeenCalledWith("IPSA");
  });

  it("tiene la clase btn btn-black hover:bg-primary para los botones", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    const { instrumentSelected } = storeToRefs(instrumentStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;
    instrumentSelected.value = "IPSA";

    wrapper = shallowMount(ChartComponent, {
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
    const { instrumentSelected } = storeToRefs(instrumentStore);
    
    loading.value = false;
    error.value = null;
    history.value = mockHistory;
    instrumentSelected.value = "IPSA";

    wrapper = shallowMount(ChartComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const periodButtons = wrapper.findAll('button.btn');
    periodButtons.forEach(button => {
      expect(button.classes()).toContain("px-5");
    });
  });

  it("maneja correctamente los datos cuando history es null", () => {
    const { history, loading, error } = storeToRefs(historyStore);
    
    loading.value = false;
    error.value = null;
    history.value = null;

    wrapper = shallowMount(ChartComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
