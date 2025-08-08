# maros-app

## Stack / Integraciones

- **Astro**: Framework principal para generación de sitios estáticos y SSR.
- **React**: Integración sin restricciones de rutas (`react()` en `astro.config.mjs`). Todos los componentes `.jsx` y `.tsx` en `src/**` se resuelven automáticamente.
- **TailwindCSS**: Utilizado para estilos utilitarios.
- **astro-icon**: Para manejo de íconos SVG.

### Notas de configuración

- La integración de React no utiliza el campo `include`, permitiendo que cualquier componente React en el proyecto sea detectado y renderizado correctamente por Astro.
- Verificado que el build (`npm run build`) y el desarrollo (`npm run dev`) funcionan sin errores relacionados con React/Astro.

---

> Última actualización: 8 de agosto de 2025
