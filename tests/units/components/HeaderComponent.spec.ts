import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useResumenStore } from "../../../src/stores/resumenStore";
import HeaderComponent from "../../../src/components/HeaderComponent.vue";

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
vi.mock("@/stores/resumenStore", () => ({
  useResumenStore: vi.fn(),
}));

describe("HeaderComponent", () => {
  let resumenStore: ReturnType<typeof useResumenStore>;

  beforeEach(() => {
    createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    });

    resumenStore = useResumenStore();
  });

  it("muestra el componente HeaderSkeleton si loading es true", () => {
    resumenStore.loading = true;
    const wrapper = shallowMount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.html()).toContain("HeaderSkeleton");
  });

  it("muestra mensaje de error si error es true", () => {
    resumenStore.error = new Error("Error al cargar datos");
    resumenStore.loading = false;
    const wrapper = shallowMount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.text()).toContain("Error al cargar el instrumento");
  });

  it("renderiza información si loading y error son false", () => {
    resumenStore.loading = false;
    resumenStore.error = null;
    resumenStore.resumen = {
      data: {
        info: {
          shortName: "IPSA",
          countryName: "Chile",
        },
        price: {
          lastPrice: 123.45,
          pct30D: 0.1,
        },
      },
    } as any;

    const wrapper = shallowMount(HeaderComponent, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(wrapper.text()).toContain("IPSA, Chile");
    expect(wrapper.text()).toContain("$123.45");
    expect(wrapper.text()).toContain("10.00%");
  });
});
