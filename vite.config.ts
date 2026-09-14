import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import zipPlugin from "vite-plugin-zip-pack";
import pkg from "./package.json";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
  },
  base: "/web-ews-ui",
  plugins: [zipPlugin({ outFileName: "web-ews-ui.zip" }), react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@mocks": path.resolve(__dirname, "./src/mocks"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      // Приватный внутренний SDK Сбербанка недоступен вне корпоративного
      // реестра npm — подменяем локальной заглушкой (см. файл по пути ниже).
      "@sber-scpl/core/jssdk": path.resolve(
        __dirname,
        "./src/shared/vendor-stubs/sber-scpl-core-jssdk.ts",
      ),
    },
  },

}));
