import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";

export default defineConfig({
  prefetch: {
    prefetchAll: false, 
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
        "@hooks": "/src/hooks",
        "@utils": "/src/utils",
      },
      dedupe: ["react", "react-dom"],
    },
  },
  integrations: [icon(), react()],
});
