# Pruebas de Unidad para Componentes

## 📋 Requisitos de la Prueba Técnica

### i. Crear pruebas de unidad para cada componente utilizando Jest o Vue Test Utils

### ii. Asegurarse de que cada componente:

#### ● Renderice correctamente los datos del estado
- ✅ Verificar que el componente muestre los datos del store correctamente
- ✅ Comprobar que los valores se rendericen en los lugares apropiados
- ✅ Validar que la estructura del componente sea correcta

#### ● Maneje correctamente los eventos (como seleccionar un instrumento o cambiar de periodo)
- ✅ Testear eventos de click, input, change, etc.
- ✅ Verificar que los eventos llamen a los métodos del store
- ✅ Comprobar que se pasen los parámetros correctos
- ✅ Validar la interacción del usuario con la interfaz

#### ● Responda a cambios en el estado global reflejándose en la interfaz
- ✅ Verificar que la UI se actualice cuando cambie el store
- ✅ Comprobar la reactividad de los componentes
- ✅ Validar la sincronización bidireccional entre store y UI

## 🎯 Estándares de Testing

### Estructura de Tests
```typescript
describe("ComponentName", () => {
  beforeEach(() => {
    // Configurar Pinia y store
    pinia = createTestingPinia({ stubActions: false });
    setActivePinia(pinia);
    store = useStore();
  });

  it("renderiza correctamente los datos del estado", () => {
    // Test de renderización
  });

  it("maneja correctamente los eventos", async () => {
    // Test de eventos
  });

  it("responde a cambios en el estado global", () => {
    // Test de reactividad
  });
});
```

### Patrones Obligatorios

#### 1. Tests de Renderización
- ✅ Verificar que el componente se renderice sin errores
- ✅ Comprobar que los datos del store se muestren correctamente
- ✅ Validar la estructura HTML esperada

#### 2. Tests de Eventos
- ✅ Simular interacciones del usuario (click, input, etc.)
- ✅ Verificar que se llamen los métodos del store
- ✅ Comprobar que se pasen los parámetros correctos

#### 3. Tests de Reactividad
- ✅ Cambiar valores en el store
- ✅ Verificar que la UI se actualice
- ✅ Comprobar la sincronización bidireccional

## 📁 Componentes Testeados

### ✅ HeaderComponent.spec.ts
- **Renderización**: Verifica que se muestren los datos del resumen
- **Eventos**: Manejo de estados de loading y error
- **Reactividad**: Respuesta a cambios en el store de resumen

### ✅ InstrumentItemComponent.spec.ts
- **Renderización**: Verifica que se muestren los datos del instrumento
- **Eventos**: Manejo del click para seleccionar instrumento
- **Reactividad**: Respuesta a cambios en el store de instrumentos

### ✅ InstrumentListComponent.spec.ts
- **Renderización**: Verifica que se muestre la lista de instrumentos
- **Eventos**: Manejo de estados de loading y error
- **Reactividad**: Respuesta a cambios en el store de constituyentes

### ✅ SearchComponent.spec.ts
- **Renderización**: Verifica que se muestre el input de búsqueda
- **Eventos**: Manejo del evento input para buscar
- **Reactividad**: Respuesta a cambios en el término de búsqueda

## 🚫 Lo que NO se debe testear

- ❌ Iconos decorativos (Heroicons, etc.)
- ❌ Estilos CSS específicos (solo clases funcionales)
- ❌ Implementaciones internas de librerías externas
- ❌ Elementos que no afectan la funcionalidad

## ✅ Lo que SÍ se debe testear

- ✅ Datos del estado que se muestran en la UI
- ✅ Eventos que afectan la funcionalidad
- ✅ Cambios en el estado global que se reflejan en la interfaz
- ✅ Interacciones del usuario que modifican el estado
- ✅ Estados de loading, error y éxito
- ✅ Validaciones y manejo de casos edge

## 🔧 Configuración de Tests

### Mocks Requeridos
```typescript
// Mock de utilidades
vi.mock("../../../src/utils/colorText.formater", () => ({
  isPositive: (value: number) => value > 0 ? "text-green-500" : "text-red-500"
}));

// Mock de stores (solo si es necesario)
const mockStore = {
  data: ref(null),
  loading: ref(false),
  error: ref(null)
};
```

### Configuración de Pinia
```typescript
beforeEach(() => {
  pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);
  store = useStore();
});
```

## 📊 Métricas de Cobertura

Cada componente debe tener al menos:
- ✅ **1 test de renderización** - Verificar que se renderice correctamente
- ✅ **1 test de eventos** - Verificar manejo de interacciones
- ✅ **1 test de reactividad** - Verificar respuesta a cambios de estado
- ✅ **1 test de casos edge** - Verificar manejo de errores/estados vacíos

## 🎯 Objetivo

Asegurar que cada componente cumpla con los requisitos de la prueba técnica:
1. **Renderice correctamente los datos del estado**
2. **Maneje correctamente los eventos**
3. **Responda a cambios en el estado global**

Esto garantiza que la aplicación sea robusta, mantenible y funcional. 