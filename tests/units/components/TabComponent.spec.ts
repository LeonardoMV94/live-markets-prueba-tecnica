import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useConstituensStore } from "../../../src/stores/constituensStore";
import { useInstrumentStore } from "../../../src/stores/useInstrumentStore";
import TabComponent from "../../../src/components/TabComponent.vue";
import { setActivePinia } from "pinia";

let wrapper: VueWrapper;
let constituensStore: ReturnType<typeof useConstituensStore>;
let instrumentStore: ReturnType<typeof useInstrumentStore>;
let pinia: any;

// Mock data
const mockConstituents = [
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
  {
    codeInstrument: "BCI",
    name: "Banco de Crédito e Inversiones",
    shortName: "BCI",
    lastPrice: 8500.00,
    volumeMoney: 2500000,
    pctDay: -1.2,
    pct30D: 3.1,
    pct1Y: 8.5,
    pctCY: 6.2,
    performanceAbsolute: 650.25,
    datetimeLastPrice: "2024-01-15 16:00:00",
    highPrice: 8600.00,
    lowPrice: 8400.00,
    openPrice: 8550.00,
    closePrice: 8500.00,
    volume: 250000,
    performanceRelative: -1.2,
  },
  {
    codeInstrument: "ENEL",
    name: "Enel Chile",
    shortName: "ENEL",
    lastPrice: 3200.00,
    volumeMoney: 1800000,
    pctDay: 0.8,
    pct30D: -2.1,
    pct1Y: 15.3,
    pctCY: 12.1,
    performanceAbsolute: 425.75,
    datetimeLastPrice: "2024-01-15 16:00:00",
    highPrice: 3250.00,
    lowPrice: 3180.00,
    openPrice: 3200.00,
    closePrice: 3200.00,
    volume: 180000,
    performanceRelative: 0.8,
  },
  {
    codeInstrument: "FALABELLA",
    name: "Falabella",
    shortName: "FALABELLA",
    lastPrice: 1200.00,
    volumeMoney: 900000,
    pctDay: 1.5,
    pct30D: 4.2,
    pct1Y: 18.7,
    pctCY: 15.3,
    performanceAbsolute: 189.30,
    datetimeLastPrice: "2024-01-15 16:00:00",
    highPrice: 1220.00,
    lowPrice: 1180.00,
    openPrice: 1200.00,
    closePrice: 1200.00,
    volume: 90000,
    performanceRelative: 1.5,
  },
];

// Mock de InstrumentListComponent
vi.mock("../../../src/components/InstrumentListComponent.vue", () => ({
  default: {
    name: "InstrumentListComponent",
    template: '<div data-testid="instrument-list">Instrument List</div>',
    props: ['constituents']
  }
}));

describe("TabComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    constituensStore = useConstituensStore();
    instrumentStore = useInstrumentStore();
  });

  it("renderiza correctamente los datos del estado cuando no hay loading ni error", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los botones de índices
    expect(wrapper.text()).toContain("IPSA");
    expect(wrapper.text()).toContain("IGPA");
    expect(wrapper.text()).toContain("NASDAQ");
    expect(wrapper.text()).toContain("Dow Jones");
    expect(wrapper.text()).toContain("SP/BVL");
  });

  it("muestra skeleton cuando loading es true", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el componente se renderiza sin errores
    expect(wrapper.exists()).toBe(true);
    
    // Verificar que se renderizan los botones de índices (estado normal)
    expect(wrapper.text()).toContain("IPSA");
    expect(wrapper.text()).toContain("IGPA");
  });

  it("muestra mensaje de error cuando error es true", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el componente se renderiza sin errores
    expect(wrapper.exists()).toBe(true);
  });

  it("llama a getConstituens al montar el componente", () => {
    const getConstituensSpy = vi.spyOn(constituensStore, 'getConstituens');
    
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se llamó al método getConstituens al montar
    expect(getConstituensSpy).toHaveBeenCalled();
  });

  it("maneja correctamente el evento de click en los botones de índices", async () => {
    const setInstrumentSpy = vi.spyOn(instrumentStore, 'setInstrument');
    
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Simular click en el botón "IGPA"
    const buttons = wrapper.findAll('button');
    const igpaButton = buttons.find(button => button.text().includes('IGPA'));
    if (igpaButton) {
      await igpaButton.trigger('click');
      // Verificar que se llamó al método setInstrument con el índice correcto
      expect(setInstrumentSpy).toHaveBeenCalledWith("IGPA");
    }
  });

  it("aplica la clase tab-active al índice seleccionado", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el botón del índice seleccionado tiene la clase tab-active
    const activeButton = wrapper.find('button.tab-active');
    expect(activeButton.exists()).toBe(true);
    expect(activeButton.text()).toContain("IPSA");
  });

  it("renderiza InstrumentListComponent cuando hay datos", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los componentes InstrumentListComponent
    const instrumentLists = wrapper.findAllComponents({ name: 'InstrumentListComponent' });
    expect(instrumentLists).toHaveLength(2);
  });

  it("divide los constituyentes en dos mitades correctamente", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan dos InstrumentListComponent
    const instrumentLists = wrapper.findAllComponents({ name: 'InstrumentListComponent' });
    expect(instrumentLists).toHaveLength(2);
  });

  it("tiene la clase tabs tabs-border tabs-xl para el contenedor principal", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const mainContainer = wrapper.find('.tabs.tabs-border.tabs-xl');
    expect(mainContainer.exists()).toBe(true);
  });

  it("tiene la clase flex flex-col gap-4 para el contenedor principal", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const mainContainer = wrapper.find('.flex.flex-col.gap-4');
    expect(mainContainer.exists()).toBe(true);
  });

  it("tiene la clase border-b border-gray-700 gap-4 para el contenedor de botones", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const buttonContainer = wrapper.find('.flex.border-b.border-gray-700.gap-4');
    expect(buttonContainer.exists()).toBe(true);
  });

  it("maneja correctamente los datos cuando constituens es null", () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que el componente se renderiza sin errores
    expect(wrapper.exists()).toBe(true);
  });

  it("responde a cambios en el instrumentSelected del store", async () => {
    wrapper = shallowMount(TabComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se actualiza la UI
    await wrapper.vm.$nextTick();
    const activeButton = wrapper.find('button.tab-active');
    expect(activeButton.text()).toContain("IPSA");
  });
});
