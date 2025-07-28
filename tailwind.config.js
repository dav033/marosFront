// tailwind.config.js
export default {
  // Configuración simplificada en v4
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue}'],
  
  // Paleta de colores personalizada
  theme: {
    colors: {
      'dark-primary': '#222831',
      'dark-secondary': '#393E46',
      'accent-orange': '#F96D00',
      'light-text': '#F2F2F2',
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      // Variables CSS para compatibilidad avanzada
      boxShadow: {
        'accent': '0 4px 14px 0 rgba(249, 109, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  
  // Plugins recomendados
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};