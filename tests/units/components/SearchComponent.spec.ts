import { describe, it, expect, vi, beforeEach } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useConstituensStore } from "../../../src/stores/constituensStore";
import { storeToRefs } from "pinia";
import SearchBarComponent from "../../../src/components/SearchBarComponent.vue";
import { setActivePinia } from "pinia";

let wrapper: VueWrapper;
let constituentsStore: ReturnType<typeof useConstituensStore>;
let pinia: any;

describe("SearchBarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    constituentsStore = useConstituensStore();
  });

  it("renderiza correctamente el componente de búsqueda", () => {
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    // Verificar que se renderiza el input
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('search');
    expect(input.attributes('placeholder')).toBe('Busca un instrumento');
  });

  it("tiene la clase input w-full para el label", () => {
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const label = wrapper.find('label');
    expect(label.classes()).toContain("input");
    expect(label.classes()).toContain("w-full");
  });

  it("tiene la clase grow para el input", () => {
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const input = wrapper.find('input');
    expect(input.classes()).toContain("grow");
  });

  it("maneja correctamente el evento de input y llama al store", async () => {
    const setSearchTermSpy = vi.spyOn(constituentsStore, 'setSearchTerm');
    
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const input = wrapper.find('input');
    
    // Simular escritura en el input
    await input.setValue('IPSA');
    await input.trigger('input');

    // Verificar que se llamó al método del store
    expect(setSearchTermSpy).toHaveBeenCalledWith('IPSA');
  });

  it("responde a cambios en el estado global del store", async () => {
    const { searchTerm } = storeToRefs(constituentsStore);
    
    searchTerm.value = 'AGUAS-A';

    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const input = wrapper.find('input');
    expect(input.element.value).toBe('AGUAS-A');
  });

  it("maneja múltiples cambios de valor correctamente", async () => {
    const setSearchTermSpy = vi.spyOn(constituentsStore, 'setSearchTerm');
    
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const input = wrapper.find('input');
    
    // Simular múltiples escrituras
    await input.setValue('IPSA');
    await input.trigger('input');
    expect(setSearchTermSpy).toHaveBeenCalledWith('IPSA');

    await input.setValue('AGUAS-A');
    await input.trigger('input');
    expect(setSearchTermSpy).toHaveBeenCalledWith('AGUAS-A');

    await input.setValue('');
    await input.trigger('input');
    expect(setSearchTermSpy).toHaveBeenCalledWith('');
  });

  it("mantiene el valor del input sincronizado con el store", async () => {
    const { searchTerm } = storeToRefs(constituentsStore);
    
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const input = wrapper.find('input');
    
    // Cambiar el valor en el store
    searchTerm.value = 'BCI';
    await wrapper.vm.$nextTick();
    
    expect(input.element.value).toBe('BCI');
  });

  it("tiene el atributo type search para mejor UX", () => {
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('type')).toBe('search');
  });

  it("tiene el placeholder correcto", () => {
    wrapper = shallowMount(SearchBarComponent, {
      global: {
        plugins: [pinia],
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('Busca un instrumento');
  });
});
