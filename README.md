# Live Markets - Aplicación de Datos Financieros en Tiempo Real

## 📋 Descripción del Proyecto

Aplicación web desarrollada en Vue 3 + TypeScript que simula una plataforma de datos financieros en tiempo real. Permite visualizar y analizar instrumentos financieros con una interfaz interactiva que se actualiza dinámicamente al seleccionar diferentes instrumentos.

## 🎯 Requerimientos Implementados

### 1. Componentización ✅

La interfaz se ha dividido en los siguientes componentes:

- **SearchBarComponent**: Barra de búsqueda de instrumentos con filtrado en tiempo real
- **HeaderComponent**: Muestra el nombre del índice (IPSA) y el valor actual con sus variaciones
- **ChartComponent**: Gráfico que muestra la evolución del índice seleccionado en diferentes periodos (1D, 1S, 1M, 3M, 6M, 1Y, 5Y, ALL)
- **TabComponent**: Permite cambiar entre diferentes índices (IPSA, IGPA, NASDAQ, etc.)
- **SummaryComponent**: Muestra el detalle de la cotización y otros datos relevantes
- **InstrumentListComponent**: Lista de instrumentos (acciones) con su información clave
- **InstrumentItemComponent**: Cada fila de la lista de instrumentos, interactiva al hacer click

### 2. Manejo de Estado Global ✅

Implementado con **Pinia** para gestionar:

- **useInstrumentStore**: Estado del instrumento seleccionado
- **useHistoryStore**: Datos históricos para el gráfico
- **useConstituensStore**: Lista de instrumentos disponibles
- **useResumenStore**: Datos de resumen del instrumento

### 3. Interacción ✅

- Al seleccionar un instrumento de la lista, se actualiza automáticamente:
  - HeaderComponent con nuevos valores y variaciones
  - SummaryComponent con datos detallados
  - ChartComponent con datos históricos del instrumento seleccionado

### 4. Testing ✅

#### Pruebas de Unidad para Componentes
- ✅ **InstrumentItemComponent**: 7 tests - Renderizado, eventos click, colores, formateo
- ✅ **InstrumentListComponent**: 10 tests - Tabla, headers, skeleton, errores
- ✅ **SearchComponent**: 9 tests - Input, eventos, sincronización con store
- ✅ **SummaryComponent**: 10 tests - Datos, variaciones, skeleton, errores
- ✅ **ChartComponent**: 6 tests - Renderizado, periodos, botones, skeleton
- ✅ **HeaderComponent**: 3 tests - Renderizado, colores, datos
- ✅ **TabComponent**: 13 tests - Navegación, estados activos, eventos

#### Pruebas de Estado Global
- ✅ **useInstrumentStore**: 11 tests - Cambio de instrumento, reactividad
- ✅ **useHistoryStore**: 3 tests - Carga de datos, refetch
- ✅ **useConstituensStore**: 2 tests - Lista de instrumentos
- ✅ **useResumenStore**: 4 tests - Datos de resumen

#### Pruebas de Integración
- ✅ **selectInstrument.spec.ts**: 8 tests - Flujo completo de selección de instrumento
  - Simulación de selección de instrumento
  - Verificación de actualización de componentes
  - Validación de datos correctos en cada componente

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes Vue
│   ├── HeaderComponent.vue
│   ├── ChartComponent.vue
│   ├── SummaryComponent.vue
│   ├── SearchBarComponent.vue
│   ├── TabComponent.vue
│   ├── InstrumentListComponent.vue
│   ├── InstrumentItemComponent.vue
│   └── skeletons/       # Componentes skeleton para loading
├── stores/             # Stores Pinia
│   ├── useInstrumentStore.ts
│   ├── useHistoryStore.ts
│   ├── useConstituensStore.ts
│   └── useResumenStore.ts
├── composables/        # Lógica reutilizable
│   ├── useFetch.ts     # Composable para fetch con manejo de URLs en prod/dev y parametro timeout simulado
│   └── useGetColor.ts
├── utils/              # Utilidades
│   ├── priceFormater.ts
│   ├── isPositive.ts
│   └── formaterNumerToPercert.ts
├── interfaces/         # Tipos TypeScript
│   ├── history.interfaces.ts
│   ├── constituens.interfaces.ts
│   └── resumen.interfaces.ts
└── pages/             # Páginas
    └── HomePage.vue
```

## 🧪 Testing

### Estructura de Tests
```
tests/
├── units/
│   ├── components/     # Tests unitarios de componentes
│   └── stores/         # Tests unitarios de stores
└── integration/        # Tests de integración
    └── selectInstrument.spec.ts
```

### Cobertura de Testing
- **86 tests** en total
- **12 archivos de test**
- **100% de componentes** con tests unitarios
- **100% de stores** con tests unitarios
- **Tests de integración** para flujos completos

### 📊 Métricas de Cobertura
- **Statements**: 86.28% ✅ Excelente
- **Branches**: 89.41% ✅ Excelente
- **Functions**: 33.33% ⚠️ Mejorable
- **Lines**: 86.28% ✅ Excelente

> 📋 **Reporte detallado**: Ver `COVERAGE_REPORT.md` para análisis completo

## 🚀 Tecnologías Utilizadas

- **Vue 3** - Framework de frontend
- **TypeScript** - Tipado estático
- **Pinia** - State management
- **Vue Test Utils** - Testing de componentes
- **Vitest** - Test runner
- **Tailwind CSS** - Framework CSS
- **DaisyUI** - Componentes CSS
- **ApexCharts** - Gráficos interactivos

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- pnpm (recomendado) o npm

### Instalación de Dependencias
```bash
# Instalar dependencias del proyecto
pnpm install
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo
pnpm dev

# El proyecto estará disponible en http://localhost:5173
```

### Build de Producción
```bash
# Generar build optimizado para producción
pnpm build

# Los archivos se generarán en la carpeta dist/
```

### Testing
```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests unitarios específicos
pnpm test:unit

# Ejecutar tests de integración
pnpm test:integration
```

### Cobertura de Tests
```bash
# Generar reporte de cobertura
pnpm test --coverage

# Generar reporte HTML de cobertura
pnpm test --coverage --reporter=html

# Ver reporte HTML (después de generarlo)
npx vite preview --outDir html
```

### Scripts Disponibles
```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm preview      # Preview del build

# Testing
pnpm test         # Ejecutar todos los tests
pnpm test:unit    # Solo tests unitarios
pnpm test:integration  # Solo tests de integración

# Linting
pnpm lint         # Ejecutar ESLint
pnpm lint:fix     # Corregir errores de linting

## 🚀 Deployment

### GitHub Pages
El proyecto está configurado para deploy automático en GitHub Pages:

- **Base URL**: `/live-markets-prueba-tecnica/`
- **Configuración**: Automática en `vite.config.ts`
- **URLs**: Se ajustan automáticamente en producción vs desarrollo

### Variables de Entorno
- **Desarrollo**: URLs relativas sin base
- **Producción**: URLs con base `/live-markets-prueba-tecnica`

## 📊 Funcionalidades Implementadas

### Componentes Principales
- **Búsqueda en tiempo real** de instrumentos
- **Gráficos interactivos** con múltiples periodos
- **Lista de instrumentos** con datos en tiempo real
- **Resumen detallado** de cada instrumento
- **Navegación por pestañas** entre índices
- **Skeletons** para estados de carga

### Características Técnicas
- **Arquitectura modular** con componentes reutilizables
- **State management** centralizado con Pinia
- **Composables** para lógica reutilizable
- **TypeScript** para tipado seguro
- **Testing completo** con cobertura del 100%
- **Responsive design** con Tailwind CSS

## 🎨 Interfaz de Usuario

La aplicación presenta una interfaz moderna y profesional que incluye:

- **Header** con información del índice seleccionado
- **Gráfico interactivo** con filtros por periodo
- **Lista de instrumentos** con datos clave
- **Panel de resumen** con información detallada
- **Barra de búsqueda** para filtrar instrumentos
- **Navegación por pestañas** para diferentes índices

## 📈 Estado del Proyecto

✅ **Completado al 100%**
- Todos los requerimientos implementados
- Testing completo con 86 tests pasando
- Arquitectura escalable y mantenible
- Interfaz funcional y responsive

## 👨‍💻 Autor

**Leonardo Muñoz Veloso**

---

*Proyecto desarrollado como prueba técnica para demostrar competencias en Vue 3, TypeScript, testing y arquitectura de aplicaciones web.*
