/**
 * Script para suprimir devtools en producción y optimizar performance
 * También incluye caching de recursos estáticos
 */

(function() {
  'use strict';

  // Solo ejecutar en producción
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return;
  }

  // Suprimir devtools
  const devtools = {
    open: false,
    orientation: null
  };

  setInterval(function() {
    if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.log('%c🚫 Developer Tools Disabled', 'color: red; font-size: 20px; font-weight: bold;');
        // Opcional: redirigir o tomar acción
        // window.location.href = '/';
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Deshabilitar teclas de desarrollador
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
  });

  // Deshabilitar click derecho
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // Optimizaciones de cache para recursos estáticos
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      // Registrar service worker para cache
      const swScript = `
        const CACHE_NAME = 'maros-app-v1';
        const urlsToCache = [
          '/',
          '/favicon.svg',
          // Agregar otros recursos estáticos aquí
        ];

        self.addEventListener('install', function(event) {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(function(cache) {
                return cache.addAll(urlsToCache);
              })
          );
        });

        self.addEventListener('fetch', function(event) {
          event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                if (response) {
                  return response;
                }
                return fetch(event.request);
              }
            )
          );
        });
      `;

      const blob = new Blob([swScript], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);

      navigator.serviceWorker.register(swUrl)
        .then(function(registration) {
          console.log('ServiceWorker registration successful');
        })
        .catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  // Optimizaciones de carga
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptimizations);
  } else {
    initOptimizations();
  }

  function initOptimizations() {
    // Precargar recursos críticos
    const criticalResources = [
      '/api/contacts/all',
      '/api/leads/type'
    ];

    // Prefetch después de que la página esté completamente cargada
    window.addEventListener('load', function() {
      setTimeout(function() {
        criticalResources.forEach(function(url) {
          fetch(url, { method: 'HEAD' }).catch(function() {
            // Ignorar errores de prefetch
          });
        });
      }, 2000);
    });

    // Optimizar imágenes lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
      });
    }

    // Optimización de scroll performance
    let ticking = false;
    function updateScrollPosition() {
      // Lógica de scroll optimizada
      ticking = false;
    }

    document.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }, { passive: true });
  }

  // Limpiar memoria periódicamente
  setInterval(function() {
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  }, 300000); // Cada 5 minutos

})();