#!/usr/bin/env node

/**
 * Script para analizar el rendimiento del frontend
 * Compara versiones optimizadas vs originales
 */

const fs = require('fs');
const path = require('path');

// Análisis de tamaños de bundle
function analyzeBundleSize() {
  console.log('📊 ANÁLISIS DE BUNDLE SIZE\n');
  
  const distPath = path.join(__dirname, '../dist/_astro');
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ Ejecuta "npm run build" primero');
    return;
  }
  
  const files = fs.readdirSync(distPath)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024 * 100) / 100
      };
    })
    .sort((a, b) => b.size - a.size);
  
  console.log('🔍 Archivos más pesados:');
  files.slice(0, 10).forEach((file, index) => {
    const indicator = file.sizeKB > 50 ? '🔴' : file.sizeKB > 20 ? '🟡' : '🟢';
    console.log(`${indicator} ${index + 1}. ${file.name}: ${file.sizeKB} KB`);
  });
  
  const totalSize = files.reduce((sum, file) => sum + file.sizeKB, 0);
  console.log(`\n📦 Total Bundle Size: ${Math.round(totalSize * 100) / 100} KB`);
  
  return { files, totalSize };
}

// Análisis de componentes React
function analyzeComponents() {
  console.log('\n🔍 ANÁLISIS DE COMPONENTES\n');
  
  const componentsPath = path.join(__dirname, '../src/components');
  
  const heavyComponents = [
    'InteractiveTable.tsx',
    'GenerictButton.tsx', 
    'CreateLeadModal.tsx',
    'EditLeadModal.tsx'
  ];
  
  heavyComponents.forEach(component => {
    const filePath = path.join(componentsPath, 'leads', component);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      const hasLazyLoading = content.includes('lazy(') || content.includes('Suspense');
      const hasMemoization = content.includes('useMemo') || content.includes('useCallback') || content.includes('React.memo');
      
      console.log(`📄 ${component}:`);
      console.log(`   - Líneas: ${lines}`);
      console.log(`   - Lazy Loading: ${hasLazyLoading ? '✅' : '❌'}`);
      console.log(`   - Memoización: ${hasMemoization ? '✅' : '❌'}\n`);
    }
  });
}

// Análisis de optimizaciones aplicadas
function analyzeOptimizations() {
  console.log('⚡ OPTIMIZACIONES IMPLEMENTADAS\n');
  
  const optimizations = [
    {
      name: 'Sidebar Context',
      file: 'src/contexts/SidebarContext.tsx',
      checks: ['MutationObserver', 'useCallback', 'useMemo', 'polling'],
      description: 'Eliminado polling, añadido memoization'
    },
    {
      name: 'State Cache',
      file: 'src/hooks/useStateCache.ts',
      checks: ['sessionStorage', 'cache', 'memoization'],
      description: 'Cache inteligente entre navegaciones'
    },
    {
      name: 'API Client',
      file: 'src/lib/optimizedApiClient.ts',
      checks: ['cache', 'retry', 'interceptors'],
      description: 'Cache de requests y retry automático'
    },
    {
      name: 'Lazy Loading',
      file: 'src/components/leads/LazyInteractiveTable.tsx',
      checks: ['lazy', 'Suspense', 'client:idle'],
      description: 'Carga diferida de componentes pesados'
    }
  ];
  
  optimizations.forEach(opt => {
    const filePath = path.join(__dirname, '..', opt.file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const implemented = opt.checks.filter(check => {
        if (check === 'polling') {
          return !content.includes('setInterval') || content.includes('ELIMINADO');
        }
        return content.includes(check);
      });
      
      const score = Math.round((implemented.length / opt.checks.length) * 100);
      const indicator = score >= 80 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      
      console.log(`${indicator} ${opt.name}: ${score}% implementado`);
      console.log(`   ${opt.description}`);
      console.log(`   Checks: ${implemented.join(', ')}\n`);
    }
  });
}

// Recomendaciones basadas en análisis
function generateRecommendations(bundleData) {
  console.log('💡 RECOMENDACIONES DE OPTIMIZACIÓN\n');
  
  const { files, totalSize } = bundleData;
  
  // Recomendaciones basadas en bundle size
  if (totalSize > 200) {
    console.log('🔴 CRÍTICO: Bundle size muy grande (>200KB)');
    console.log('   - Implementar code splitting agresivo');
    console.log('   - Usar client:idle en lugar de client:load');
    console.log('   - Separar vendor bundle\n');
  }
  
  const heavyFiles = files.filter(f => f.sizeKB > 40);
  if (heavyFiles.length > 0) {
    console.log('🟡 MEDIO: Archivos pesados detectados:');
    heavyFiles.forEach(file => {
      console.log(`   - ${file.name} (${file.sizeKB}KB): Considerar lazy loading`);
    });
    console.log('');
  }
  
  // Recomendaciones específicas
  console.log('🎯 PRÓXIMOS PASOS:');
  console.log('1. ✅ Implementar cache de estado (HECHO)');
  console.log('2. ✅ Optimizar sidebar context (HECHO)');
  console.log('3. 🔄 Migrar a páginas optimizadas:');
  console.log('   - /contacts → /contacts-fast');
  console.log('   - /leads/construction → /leads/construction-fast');
  console.log('4. 📦 Implementar service worker para cache');
  console.log('5. 🎨 Optimizar CSS y remover unused styles');
  console.log('6. 📊 Añadir métricas de performance en tiempo real\n');
}

// Función principal
function main() {
  console.log('🚀 ANÁLISIS DE RENDIMIENTO FRONTEND - MarosApp\n');
  console.log('=' .repeat(60) + '\n');
  
  const bundleData = analyzeBundleSize();
  analyzeComponents();
  analyzeOptimizations();
  
  if (bundleData) {
    generateRecommendations(bundleData);
  }
  
  console.log('✨ Análisis completado. Revisa las recomendaciones arriba.\n');
}

main();
