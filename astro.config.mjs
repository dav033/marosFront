import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";

export default defineConfig({
  prefetch: {
    prefetchAll: false, // Desactivado globalmente para evitar saturar red
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@pages": "/src/pages",
        "@styles": "/src/styles",
        "@types": "/src/types",
        "@services": "/src/services",
        "@hooks": "/src/hooks",
        "@contexts": "/src/contexts",
        "@utils": "/src/utils",
      },
      dedupe: ["react", "react-dom"],
    },
    // server: {
    //   proxy: {
    //     // Redirige /contacts/* al backend (http://localhost:8080)
    //     "/contacts": {
    //       target: "http://localhost:8080",
    //       changeOrigin: true,
    //       secure: false,
    //     },
    //     // Si tiene más prefijos de API, actívelos aquí también:
    //     "/api": {
    //       target: "http://localhost:8080",
    //       changeOrigin: true,
    //       secure: false,
    //     },
    //     // Ejemplos adicionales, descomente si aplica:
    //     // "/auth": { target: "http://localhost:8080", changeOrigin: true, secure: false },
    //     // "/uploads": { target: "http://localhost:8080", changeOrigin: true, secure: false },
    //   },
    // },
  },
  integrations: [icon(), react()],
});
