// Tema oscuro personalizado para componentes de búsqueda
export const searchBoxTheme = {
  // Dropdown
  dropdown: {
    base: "appearance-none bg-theme-gray-subtle border border-theme-gray-subtle border-r-0 rounded-l-md px-3 py-2 text-sm text-theme-light focus:outline-none focus:ring-1 focus:ring-theme-primary focus:border-theme-primary cursor-pointer min-w-[140px]",
    option: "bg-theme-gray-subtle text-theme-light"
  },
  
  // Input
  input: {
    base: "block w-full pl-10 pr-10 py-2 border border-theme-gray-subtle rounded-r-md leading-5 bg-theme-gray-subtle text-theme-light placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-theme-primary focus:border-theme-primary sm:text-sm"
  },
  
  // Icons and buttons
  icons: {
    search: "h-5 w-5 text-gray-400",
    dropdown: "h-4 w-4 text-gray-400",
    clear: "h-5 w-5"
  },
  
  // Clear button
  clearButton: {
    base: "text-gray-400 hover:text-theme-light focus:outline-none focus:text-theme-light transition-colors"
  },
  
  // Results summary
  summary: {
    base: "text-sm text-gray-400",
    highlight: "text-gray-500 ml-2"
  }
};

// Colores del tema para referencia rápida
export const themeColors = {
  dark: '#000000',
  gray: '#273F4F',
  grayAlt: '#1F313D',
  grayDarker: '#101010',
  graySubtle: '#2A2A2A',
  primary: '#041FC4',
  primaryAlt: '#C44A04',
  light: '#EFEEEA',
};
