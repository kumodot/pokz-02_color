import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuração dinâmica de base
const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react()],
  base: isProd ? "/pokz-02_color/" : "./",
});