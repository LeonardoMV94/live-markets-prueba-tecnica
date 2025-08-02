# GitHub Actions Workflow

Este workflow automatiza el proceso de testing, build y deploy de la aplicación Live Markets a GitHub Pages.

## Estructura del Workflow

### Jobs

#### 1. **test** - Ejecución de Tests
- **Propósito**: Ejecutar todos los tests de la aplicación
- **Trigger**: Push a `main` o Pull Request
- **Pasos**:
  - Setup de Node.js 18
  - Setup de pnpm
  - Instalación de dependencias
  - Ejecución de unit tests (`pnpm test:unit`)
  - Ejecución de integration tests (`pnpm test:integration`)
  - Ejecución de todos los tests (`pnpm test`)

#### 2. **build** - Build de la Aplicación
- **Propósito**: Compilar la aplicación para producción
- **Dependencias**: Requiere que el job `test` pase exitosamente
- **Pasos**:
  - Setup de Node.js 18
  - Setup de pnpm
  - Instalación de dependencias
  - Build de la aplicación (`pnpm build`)
  - Upload de artifacts para el deploy

#### 3. **deploy** - Deploy a GitHub Pages
- **Propósito**: Desplegar la aplicación a GitHub Pages
- **Dependencias**: Requiere que el job `build` pase exitosamente
- **Pasos**:
  - Download de artifacts del build
  - Setup de GitHub Pages
  - Upload de artifacts a GitHub Pages
  - Deploy final

## Configuración

### Permisos Requeridos
- `contents: read` - Para leer el código
- `pages: write` - Para escribir en GitHub Pages
- `id-token: write` - Para autenticación

### Concurrency
- **Group**: "pages"
- **Cancel-in-progress**: false
- Evita múltiples deploys simultáneos

## Scripts de Package.json

```json
{
  "test:unit": "vitest tests/units/",
  "test:integration": "vitest tests/integration/",
  "test": "vitest",
  "build": "vue-tsc -b && vite build"
}
```

## Triggers

El workflow se ejecuta en:
- Push a la rama `main`
- Pull Request a la rama `main`

## Cache

Se utiliza cache para:
- Dependencias de pnpm
- Optimización de tiempos de ejecución

## Environment

- **Node.js**: 18
- **Package Manager**: pnpm 8
- **OS**: ubuntu-latest 