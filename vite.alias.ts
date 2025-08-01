import path from "node:path";

export const alias = {
  "@": path.resolve(__dirname, "./src"),
  "@/components": path.resolve(__dirname, "./src/components"),
  "@/composables": path.resolve(__dirname, "./src/composables"),
  "@/interfaces": path.resolve(__dirname, "./src/interfaces"),
  "@/stores": path.resolve(__dirname, "./src/stores"),
  "@/utils": path.resolve(__dirname, "./src/utils"),
};