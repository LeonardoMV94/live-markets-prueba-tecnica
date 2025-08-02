import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useResumenStore } from "../../../src/stores/resumenStore";
import { useInstrumentStore } from "../../../src/stores/useInstrumentStore";
import { storeToRefs } from "pinia";
import SummaryComponent from "../../../src/components/SummaryComponent.vue";
import { setActivePinia } from "pinia";
import { ResumenResponse } from "../../../src/interfaces/resumen.interfaces";

let wrapper: VueWrapper;
let resumenStore: ReturnType<typeof useResumenStore>;
let instrumentStore: ReturnType<typeof useInstrumentStore>;
let pinia: any;

// Mock data
const mockResumen: ResumenResponse = {
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

// Mocks
vi.mock("../../../src/utils/colorText.formater", () => ({
  isPositive: (value: number) => {
    if (value > 0) {
      return "text-green-500";
    } else if (value < 0) {
      return "text-red-500";
    } else {
      return "text-white";
    }
  },
}));

vi.mock("../../../src/utils/percent.formater", () => ({
  formaterNumerToPercert: (num: number, isPoints = true) => {
    const numFormated = num.toFixed(2);
    if (num > 0) {
      return "+" + numFormated + (isPoints ? "%" : " ");
    } else if (num < 0) {
      return numFormated + (isPoints ? "%" : "");
    } else {
      return numFormated;
    }
  },
}));

describe("SummaryComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    resumenStore = useResumenStore();
    instrumentStore = useInstrumentStore();
  });

  it("renderiza correctamente los datos del estado cuando no hay loading ni error", () => {
    const { resumen, loading, error } = storeToRefs(resumenStore);
    
    loading.value = false;
    error.value = null;
    resumen.value = mockResumen;

    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los datos principales
    expect(wrapper.text()).toContain("Santiago Stock Exchange");
    expect(wrapper.text()).toContain("5620.57");
    expect(wrapper.text()).toContain("5575.48");
    expect(wrapper.text()).toContain("5661.92");
    expect(wrapper.text()).toContain("5559.23");
    expect(wrapper.text()).toContain("5200");
    expect(wrapper.text()).toContain("5800");
  });

  it("renderiza correctamente las variaciones con colores apropiados", () => {
    const { resumen, loading, error } = storeToRefs(resumenStore);
    
    loading.value = false;
    error.value = null;
    resumen.value = mockResumen;

    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan las variaciones
    expect(wrapper.text()).toContain("+0.55%");
    expect(wrapper.text()).toContain("+2.50%");
    expect(wrapper.text()).toContain("-4.20%");
  });

  it("muestra skeleton cuando loading es true", () => {
    const { resumen, loading, error } = storeToRefs(resumenStore);
    
    loading.value = true;
    error.value = null;
    resumen.value = null;

    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.html()).toContain("skeleton");
  });

  it("muestra mensaje de error cuando error es true", () => {
    const { resumen, loading, error } = storeToRefs(resumenStore);
    
    loading.value = false;
    error.value = new Error("Error al cargar datos");
    resumen.value = null;

    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("No se encontró el instrumento");
  });

  it("responde a cambios en el instrumento seleccionado", async () => {
    const { instrumentSelected } = storeToRefs(instrumentStore);
    const getResumenSpy = vi.spyOn(resumenStore, 'getResumen');
    
    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Simular cambio de instrumento
    instrumentSelected.value = "AGUAS-A";
    await wrapper.vm.$nextTick();

    // Verificar que se llamó al método getResumen con el nuevo instrumento
    expect(getResumenSpy).toHaveBeenCalledWith("AGUAS-A");
  });

  it("llama a getResumen al montar el componente", () => {
    const getResumenSpy = vi.spyOn(resumenStore, 'getResumen');
    
    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se llamó al método getResumen al montar
    expect(getResumenSpy).toHaveBeenCalled();
  });

  it("maneja correctamente los datos cuando resumen es null", () => {
    const { resumen, loading, error } = storeToRefs(resumenStore);
    
    loading.value = false;
    error.value = null;
    resumen.value = null;

    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el componente se renderiza sin errores
    expect(wrapper.exists()).toBe(true);
  });

  it("tiene la estructura correcta de tabs", () => {
    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los inputs de radio para tabs
    const radioInputs = wrapper.findAll('input[type="radio"]');
    expect(radioInputs.length).toBeGreaterThan(0);
  });

  it("aplica las clases de color correctas para las variaciones", () => {
    const { resumen, loading, error } = storeToRefs(resumenStore);
    
    loading.value = false;
    error.value = null;
    resumen.value = mockResumen;

    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que las clases de color se aplican correctamente
    const variationElements = wrapper.findAll('p[class*="text-"]');
    expect(variationElements.length).toBeGreaterThan(0);
  });

  it("maneja valores negativos en las variaciones correctamente", () => {
    const negativeResumen = {
      ...mockResumen,
      data: {
        ...mockResumen.data,
        price: {
          ...mockResumen.data.price,
          pct30D: -1.5,
          pctRelW52: -2.3,
          pctRelCY: -0.8,
        },
      },
    };

    const { resumen, loading, error } = storeToRefs(resumenStore);
    
    loading.value = false;
    error.value = null;
    resumen.value = negativeResumen;

    wrapper = shallowMount(SummaryComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("-1.50%");
    expect(wrapper.text()).toContain("-2.30%");
    expect(wrapper.text()).toContain("-0.80%");
  });
});
