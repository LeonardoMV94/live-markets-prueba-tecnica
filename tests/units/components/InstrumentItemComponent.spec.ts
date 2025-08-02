import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useInstrumentStore } from "../../../src/stores/useInstrumentStore";
import { storeToRefs } from "pinia";
import InstrumentItemComponent from "../../../src/components/InstrumentItemComponent.vue";
import { setActivePinia } from "pinia";
import type { Constituent } from "../../../src/interfaces/constituens.interfaces";

let wrapper: VueWrapper;
let instrumentStore: ReturnType<typeof useInstrumentStore>;
let pinia: any;

// Mock data
const mockConstituent: Constituent = {
  codeInstrument: "AGUAS-A",
  name: "AGUAS ANDINAS S.A., SERIE A",
  shortName: "AGUAS-A",
  pctDay: 2.5,
  pct30D: 0.3653001734253314,
  pctCY: -4.427266338721014,
  pct1Y: 1.5152646114801938,
  lastPrice: 272,
  datetimeLastPrice: "06-11-2024 12:20:25",
  volumeMoney: 778464,
  accumulatedVolumeMoney: 158922209,
  tend: "same",
  performanceAbsolute: 5.2,
  performanceRelative: 1.95,
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

describe("InstrumentItemComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    instrumentStore = useInstrumentStore();
  });

  it("renderiza correctamente los datos del instrumento", () => {
    wrapper = shallowMount(InstrumentItemComponent, {
      props: {
        item: mockConstituent,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los datos principales
    expect(wrapper.text()).toContain("AGUAS-A");
    expect(wrapper.text()).toContain("272");
    expect(wrapper.text()).toContain("778464");
    expect(wrapper.text()).toContain("+2.50%");
    expect(wrapper.text()).toContain("+0.37%");
    expect(wrapper.text()).toContain("+1.52%");
    expect(wrapper.text()).toContain("+5.20%");
  });

  it("aplica las clases de color correctas según los valores", () => {
    wrapper = shallowMount(InstrumentItemComponent, {
      props: {
        item: mockConstituent,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que las clases de color se aplican correctamente
    // Buscar los elementos que contienen los porcentajes
    const dayCell = wrapper.find('td:nth-child(4) div div');
    const monthCell = wrapper.find('td:nth-child(5) div div');
    const yearCell = wrapper.find('td:nth-child(6) div div');
    const performanceCell = wrapper.find('td:nth-child(7) div div');

    expect(dayCell.classes()).toContain("text-green-500");
    expect(monthCell.classes()).toContain("text-green-500");
    expect(yearCell.classes()).toContain("text-green-500");
    expect(performanceCell.classes()).toContain("text-green-500");
  });

  it("maneja valores negativos correctamente", () => {
    const negativeConstituent: Constituent = {
      ...mockConstituent,
      pctDay: -1.5,
      pct30D: -2.3,
      pct1Y: -0.8,
      performanceAbsolute: -3.2,
    };

    wrapper = shallowMount(InstrumentItemComponent, {
      props: {
        item: negativeConstituent,
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("-1.50");
    expect(wrapper.text()).toContain("-2.30");
    expect(wrapper.text()).toContain("-0.80");
    expect(wrapper.text()).toContain("-3.20");
  });

  it("maneja valores cero correctamente", () => {
    const zeroConstituent: Constituent = {
      ...mockConstituent,
      pctDay: 0,
      pct30D: 0,
      pct1Y: 0,
      performanceAbsolute: 0,
    };

    wrapper = shallowMount(InstrumentItemComponent, {
      props: {
        item: zeroConstituent,
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("0.00");
  });

  it("llama al store cuando se hace click en el elemento", async () => {
    const setInstrumentSpy = vi.spyOn(instrumentStore, 'setInstrument');
    
    wrapper = shallowMount(InstrumentItemComponent, {
      props: {
        item: mockConstituent,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Simular click en la fila
    await wrapper.trigger('click');

    // Verificar que se llamó al método del store
    expect(setInstrumentSpy).toHaveBeenCalledWith("AGUAS-A");
  });

  it("tiene la clase cursor-pointer para indicar que es clickeable", () => {
    wrapper = shallowMount(InstrumentItemComponent, {
      props: {
        item: mockConstituent,
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.classes()).toContain("cursor-pointer");
  });

  it("tiene la clase hover:bg-gray-800 para efecto hover", () => {
    wrapper = shallowMount(InstrumentItemComponent, {
      props: {
        item: mockConstituent,
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.classes()).toContain("hover:bg-gray-800");
  });
});
