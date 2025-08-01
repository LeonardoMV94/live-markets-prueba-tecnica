import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "./src",
      "@/": "./src",
      "@/components": "./src/components",
      "@/composables": "./src/composables",
      "@/interfaces": "./src/interfaces",
      "@/stores": "./src/stores",
      "@/utils": "./src/utils",
    },
  },
  test: {
    globals: true, // Permite usar describe, it, expect globalmente sin importarlos en cada test
    environment: "jsdom", // Simula un entorno de navegador para renderizar componentes
    setupFiles: "./vitest.setup.ts", // Ruta a un archivo opcional para configuración global de tests
    include: ['tests/**/*.{test,spec}.{ts,tsx}'], // Patrón para encontrar tus archivos de test
    coverage: {
      // Opcional: para generar reportes de cobertura de código
      reporter: ["text", "json", "html"], // Formatos del reporte
      exclude: [
        "node_modules/",
        "**/__tests__/", // Excluye las carpetas de tests del cálculo de cobertura
        "src/main.ts",
        "src/App.vue",
        "src/router/",
        "src/stores/index.ts", // Si es un archivo de exportación de stores
        // Añade cualquier otro archivo o carpeta que no necesite cobertura
      ],
    },
  },
});
