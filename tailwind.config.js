// tailwind.config.js
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue}'],
  
  // Tema personalizado con paleta de colores oscuros
  theme: {
    extend: {
      colors: {
        // Tema personalizado - estructura plana para mejor compatibilidad
        'theme-dark': '#000000',
        'theme-gray': '#273F4F',
        'theme-gray-alt': '#1F313D', 
        'theme-gray-darker': '#101010',
        'theme-gray-subtle': '#2A2A2A',
        'theme-primary': '#041FC4',
        'theme-primary-alt': '#C44A04',
        'theme-light': '#EFEEEA',
        
        // Colores base necesarios para compatibilidad
        'transparent': 'transparent',
        'current': 'currentColor',
        'white': '#ffffff',
        'black': '#000000',
        
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        
        // Mantenemos algunos colores de estado
        'red': {
          500: '#ef4444',
          600: '#dc2626',
        },
        'green': {
          500: '#10b981',
          600: '#059669',
        },
        'blue': {
          500: '#3b82f6',
          600: '#2563eb',
        },
        'yellow': {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      
      // Sombras personalizadas
      boxShadow: {
        'theme': '0 4px 14px 0 rgba(4, 31, 196, 0.2)',
        'theme-alt': '0 4px 14px 0 rgba(196, 74, 4, 0.2)',
        'dark': '0 4px 14px 0 rgba(0, 0, 0, 0.3)',
      },
      
      // Animaciones personalizadas
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  },
  
  // Plugins
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};