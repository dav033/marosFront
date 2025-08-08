import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import react from '@astrojs/react';

export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@pages': '/src/pages',
        '@styles': '/src/styles',
        '@types': '/src/types',
        '@services': '/src/services',
        '@hooks': '/src/hooks',
        '@contexts': '/src/contexts',
        '@utils': '/src/utils'
      }
    }
  },
  integrations: [
    icon(),
    react({
      include: ['**/react/*'],
    }),
  ]
});