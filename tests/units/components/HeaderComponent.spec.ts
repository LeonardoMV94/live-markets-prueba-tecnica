import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useResumenStore } from "../../../src/stores/resumenStore";
import { storeToRefs } from "pinia";
import HeaderComponent from "../../../src/components/HeaderComponent.vue";
import { setActivePinia } from "pinia";

let wrapper: VueWrapper;
let resumenStore: ReturnType<typeof useResumenStore>;
let pinia: any;

// Mocks
vi.mock("../../../src/utils/price.formater", () => ({
  priceFormater: (price: number) =>
    price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }),
}));

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

describe("HeaderComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    resumenStore = useResumenStore();
  });

  it("muestra el componente HeaderSkeleton si loading es true", () => {
    const { loading, error, resumen } = storeToRefs(resumenStore);
    
    loading.value = true;
    error.value = null;
    resumen.value = null;

    wrapper = shallowMount(HeaderComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.html()).toContain("header-skeleton-stub");
  });

  it("muestra mensaje de error si error es true", () => {
    const { loading, error, resumen } = storeToRefs(resumenStore);
    
    error.value = new Error("Error al cargar datos");
    loading.value = false;
    resumen.value = null;

    wrapper = shallowMount(HeaderComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("Error al cargar el instrumento");
  });

  it("renderiza información si loading y error son false", () => {
    const { loading, error, resumen } = storeToRefs(resumenStore);
    
    loading.value = false;
    error.value = null;
    resumen.value = {
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
          lastPrice: 123.45,
          datetimeLastPrice: "2024-11-06 12:20:25",
          openPrice: 120.00,
          closePrice: 123.45,
          datetimeClosePrice: "2024-11-06 16:00:00",
          performanceAbsolute: 3.45,
          performanceRelative: 2.87,
          bid: 123.40,
          bidVolume: 1000,
          bidDatetime: new Date("2024-11-06T12:20:25"),
          ask: 123.50,
          askVolume: 1500,
          askDatetime: new Date("2024-11-06T12:20:25"),
          volumeMoney: 123450,
          accumulatedVolumeMoney: 1234500,
          volumeInstrument: 1000,
          accumulatedVolumeInstrument: 10000,
          tend: "up",
          maxDay: 125.00,
          minDay: 120.00,
          min52W: 100.00,
          max52W: 130.00,
          pct30D: 0.1,
          pctRelW52: 2.5,
          pctRelCY: 1.2,
        },
      },
    };

    wrapper = shallowMount(HeaderComponent, {
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.text()).toContain("IPSA, Chile");
    expect(wrapper.text()).toContain("$123.45");
    expect(wrapper.text()).toContain("+0.10%");
  });
});
