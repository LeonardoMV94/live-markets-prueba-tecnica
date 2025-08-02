import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useConstituensStore } from "../../../src/stores/constituensStore";
import { storeToRefs } from "pinia";
import InstrumentListComponent from "../../../src/components/InstrumentListComponent.vue";
import { setActivePinia } from "pinia";
import type { Constituent } from "../../../src/interfaces/constituens.interfaces";

let wrapper: VueWrapper;
let constituentsStore: ReturnType<typeof useConstituensStore>;
let pinia: any;

// Mock data
const mockConstituents: Constituent[] = [
  {
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
  },
  {
    codeInstrument: "BCI",
    name: "BANCO DE CREDITO E INVERSIONES",
    shortName: "BCI",
    pctDay: -1.2,
    pct30D: 1.5,
    pctCY: 2.3,
    pct1Y: 0.8,
    lastPrice: 150,
    datetimeLastPrice: "06-11-2024 12:20:25",
    volumeMoney: 450000,
    accumulatedVolumeMoney: 120000000,
    tend: "down",
    performanceAbsolute: -2.1,
    performanceRelative: -1.4,
  },
];

// Mock de los iconos de Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  BarsArrowDownIcon: {
    name: 'BarsArrowDownIcon',
    template: '<div>BarsArrowDownIcon</div>'
  },
  ArrowsUpDownIcon: {
    name: 'ArrowsUpDownIcon',
    template: '<div>ArrowsUpDownIcon</div>'
  }
}));

describe("InstrumentListComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    constituentsStore = useConstituensStore();
  });

  it("renderiza correctamente la tabla con headers", () => {
    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: mockConstituents,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los headers de la tabla
    expect(wrapper.text()).toContain("Nombre");
    expect(wrapper.text()).toContain("Ultimo*");
    expect(wrapper.text()).toContain("Monto (MM)");
    expect(wrapper.text()).toContain("Var día");
    expect(wrapper.text()).toContain("Var 30d**");
    expect(wrapper.text()).toContain("Año Actual");
    expect(wrapper.text()).toContain("12 Meses");
  });

  it("renderiza correctamente la lista de instrumentos", () => {
    const { loading, error } = storeToRefs(constituentsStore);
    
    loading.value = false;
    error.value = null;

    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: mockConstituents,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los componentes InstrumentItemComponent
    expect(wrapper.findAllComponents({ name: 'InstrumentItemComponent' })).toHaveLength(2);
  });

  it("muestra skeleton cuando loading es true", () => {
    const { loading, error } = storeToRefs(constituentsStore);
    
    loading.value = true;
    error.value = null;

    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: null,
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.html()).toContain("skeleton");
  });

  it("muestra mensaje de error cuando error es true", () => {
    const { loading, error } = storeToRefs(constituentsStore);
    
    loading.value = false;
    error.value = new Error("Error al cargar datos");

    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: null,
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("No se encontró el instrumento");
  });

  it("renderiza instrumentos cuando no hay loading ni error", () => {
    const { loading, error } = storeToRefs(constituentsStore);
    
    loading.value = false;
    error.value = null;

    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: mockConstituents,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los componentes InstrumentItemComponent
    expect(wrapper.findAllComponents({ name: 'InstrumentItemComponent' })).toHaveLength(2);
  });

  it("maneja lista vacía correctamente", () => {
    const { loading, error } = storeToRefs(constituentsStore);
    
    loading.value = false;
    error.value = null;

    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: [],
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que no se renderizan componentes cuando la lista está vacía
    expect(wrapper.findAllComponents({ name: 'InstrumentItemComponent' })).toHaveLength(0);
  });

  it("maneja constituents null correctamente", () => {
    const { loading, error } = storeToRefs(constituentsStore);
    
    loading.value = false;
    error.value = null;

    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: null,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que no se renderizan componentes cuando constituents es null
    expect(wrapper.findAllComponents({ name: 'InstrumentItemComponent' })).toHaveLength(0);
  });

  it("tiene la clase overflow-x-auto para scroll horizontal", () => {
    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: mockConstituents,
      },
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.classes()).toContain("overflow-x-auto");
  });

  it("tiene la clase table table-xs w-full para la tabla", () => {
    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: mockConstituents,
      },
      global: {
        plugins: [pinia],
      },
    });

    const table = wrapper.find('table');
    expect(table.classes()).toContain("table");
    expect(table.classes()).toContain("table-xs");
    expect(table.classes()).toContain("w-full");
  });

  it("renderiza botones de ordenamiento en los headers", () => {
    wrapper = shallowMount(InstrumentListComponent, {
      props: {
        constituents: mockConstituents,
      },
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderizan los botones de ordenamiento
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
