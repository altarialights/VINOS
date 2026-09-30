# Conexiones futuras

Primera fase: frontend Astro + Tailwind + TypeScript y adaptador demo. Datos en content.json; no solicitar secretos. Preparar contratos tipados:

- getProduct(id): product, formats, nullable price/stock/checkoutUrl.
- getRetailers(productId): lista verificada, vacía en demo.
- getTastingAvailability(date, persons): horarios con capacidad o estado demo; no fechas inventadas.
- createTastingRequest(input): resultado con requestId solo si una API real confirma recepción.
- createCheckout(productId, formatId, quantity): redirección solo a URL autorizada configurada.

Turso más adelante para catálogo, puntos de venta, sesiones de cata, solicitudes y estados. Precio/stock/capacidad y cualquier hold se recalculan y validan en servidor; el navegador nunca determina disponibilidad autoritativa. Integración de pago independiente y sin secretos públicos. Archivos multimedia en almacenamiento/CDN, no como BLOBs en Turso por defecto.

Campos pendientes: marca real, packshot autorizado, ficha de cata validada, ubicación real, información del anfitrión, duración, idiomas, horarios/capacidad, precio y condiciones, canal de venta, contacto y textos legales aplicables. No publicar el concepto como si describiera una bodega existente.
