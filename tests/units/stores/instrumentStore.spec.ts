import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import { useInstrumentStore } from "../../../src/stores/useInstrumentStore";

let instrumentStore: ReturnType<typeof useInstrumentStore>;
let pinia: any;

describe("useInstrumentStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    pinia = createTestingPinia({
      stubActions: false,
    });

    setActivePinia(pinia);
    instrumentStore = useInstrumentStore();
  });

  it("inicializa con el instrumento por defecto", () => {
    expect(instrumentStore.instrumentSelected).toBe("IPSA");
  });

  it("cambia el instrumento seleccionado correctamente", () => {
    instrumentStore.setInstrument("AGUAS-A");
    expect(instrumentStore.instrumentSelected).toBe("AGUAS-A");
  });

  it("mantiene el valor anterior cuando se llama setInstrument sin parámetros", () => {
    instrumentStore.setInstrument("AGUAS-A");
    instrumentStore.setInstrument();
    expect(instrumentStore.instrumentSelected).toBe("IPSA");
  });

  it("puede cambiar múltiples veces el instrumento", () => {
    instrumentStore.setInstrument("AGUAS-A");
    expect(instrumentStore.instrumentSelected).toBe("AGUAS-A");
    
    instrumentStore.setInstrument("BCI");
    expect(instrumentStore.instrumentSelected).toBe("BCI");
    
    instrumentStore.setInstrument("ENEL");
    expect(instrumentStore.instrumentSelected).toBe("ENEL");
  });

  it("acepta instrumentos con caracteres especiales", () => {
    instrumentStore.setInstrument("AGUAS-A");
    expect(instrumentStore.instrumentSelected).toBe("AGUAS-A");
    
    instrumentStore.setInstrument("BANCO-ESTADO");
    expect(instrumentStore.instrumentSelected).toBe("BANCO-ESTADO");
  });

  it("acepta instrumentos con números", () => {
    instrumentStore.setInstrument("BCI2024");
    expect(instrumentStore.instrumentSelected).toBe("BCI2024");
  });

  it("acepta instrumentos en minúsculas", () => {
    instrumentStore.setInstrument("ipsa");
    expect(instrumentStore.instrumentSelected).toBe("ipsa");
  });

  it("acepta instrumentos con espacios", () => {
    instrumentStore.setInstrument("BANCO ESTADO");
    expect(instrumentStore.instrumentSelected).toBe("BANCO ESTADO");
  });

  it("acepta instrumentos vacíos", () => {
    instrumentStore.setInstrument("");
    expect(instrumentStore.instrumentSelected).toBe("");
  });

  it("vuelve al valor por defecto después de cambiar a un instrumento vacío", () => {
    instrumentStore.setInstrument("");
    instrumentStore.setInstrument();
    expect(instrumentStore.instrumentSelected).toBe("IPSA");
  });

  it("mantiene la reactividad del store", () => {
    const initialValue = instrumentStore.instrumentSelected;
    expect(initialValue).toBe("IPSA");
    
    instrumentStore.setInstrument("AGUAS-A");
    expect(instrumentStore.instrumentSelected).toBe("AGUAS-A");
    expect(instrumentStore.instrumentSelected).not.toBe(initialValue);
  });
});
