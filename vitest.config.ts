import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths({
      projects: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
    }),
  ],
  test: {
    globals: true, 
    environment: "jsdom", 
    include: ['tests/**/*.{test,spec}.{ts,tsx}'], 
    coverage: {
      reporter: ["text", "json", "html"], // Formatos del reporte
      exclude: [
        "node_modules/",
        "**/__tests__/", // Excluye las carpetas de tests del cálculo de cobertura
        "src/main.ts",
        "src/App.vue",
        "src/stores/index.ts", // Si es un archivo de exportación de stores
        // Añade cualquier otro archivo o carpeta que no necesite cobertura
        "src/composables/useFetch.ts",
        "src/components/icons/*",
        "src/components/skeletons/*",
        "src/components/tooltip/*",
        "src/assets/*",
        "src/interfaces/*",
      ],
    },
  },
});
