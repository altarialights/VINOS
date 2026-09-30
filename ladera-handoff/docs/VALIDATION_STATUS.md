# Estado de validación de la entrega

## Comprobado
- Sintaxis JavaScript del prototipo: correcta con node --check.
- Los 12 archivos WebP coinciden con sus hashes del manifiesto.
- Configuraciones JSON válidas y extracción íntegra verificada.
- Capas fotográficas con transparencia real, variantes móviles derivadas del mismo master.

## Pendiente obligatorio antes de aprobar producción
No se ha completado la revisión en navegador. La instalación de Chromium falló al descargar un archivo de navegador inválido. No se han medido Lighthouse, Core Web Vitals o FPS; no se han probado dispositivos iOS/Android físicos.

El prototipo fija intención, contenido y recursos, pero NO certifica ausencia de solapamientos o errores visuales. Codex debe ejecutar docs/QA_ACCEPTANCE.md, corregir composición responsive, foco y flujos, y adjuntar resultados reales. Se pueden ajustar medidas para encajar cada viewport conservando dirección visual y activos. La accesibilidad y la legibilidad prevalecen sobre una posición numérica que falle en pantalla.

El HTML de entrega contiene recursos embebidos para transporte. No es el build de Astro ni debe publicarse. Compra y cata son demostraciones sin backend.
