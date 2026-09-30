# Conectar la segunda fase

La interfaz `CommerceAdapter`, sus resultados discriminados y la implementación demo están en `src/lib/commerce.ts`. `src/scripts/controls.ts` consume el adaptador, muestra carga, errores, listas vacías, disponibilidad y recepción futura de solicitudes. La implementación demo no realiza peticiones de red ni persiste datos.

Implementar un adaptador HTTP y reemplazar la exportación `adapter`. Las rutas deberán ejecutarse en servidor; el build actual es estático. Añadir el adaptador de despliegue Astro adecuado cuando se conozca el alojamiento.

- `getProduct(id)`: catálogo y formatos; precio, stock y URL nulos hasta disponer de datos verificados.
- `getRetailers(productId)`: comercios verificados y enlaces configurados. Lista vacía en demo.
- `getTastingAvailability(date, persons)`: devolver `available` con horarios y capacidad, `empty` o error de red. No inventar horarios.
- `createTastingRequest(input)`: devolver `received` con `requestId` únicamente después de confirmar recepción en servidor. Recepción no equivale a reserva confirmada. La UI contempla esta diferencia.
- `createCheckout(productId, formatId, quantity)`: el servidor revalida producto, formato, cantidad, unidades, precio y stock; crea una sesión de pago con el proveedor elegido y devuelve una URL HTTPS de un dominio autorizado. Completar `checkoutOrigins` explícitamente. Nunca construir un pedido solo con datos del navegador.

Turso almacenará catálogo, retailers, sesiones de cata, solicitudes y estados. Credenciales únicamente en variables privadas del servidor; nunca en `PUBLIC_*`, JSON público o bundle cliente. Recursos multimedia en almacenamiento/CDN, no BLOBs en la base por defecto. Añadir validación de esquemas de respuestas, protección de abuso, idempotencia y transacciones para capacidad/stock. Los holds y la confirmación de pago pertenecen al servidor y sus webhooks.

Antes de activar operaciones: suministrar marca y packshot autorizados, ficha validada, precios y condiciones, ubicación, anfitrión, duración, idiomas, horarios/capacidad, contacto y textos legales. El envío de datos de contacto necesita el alcance y autorización correspondientes. Retirar los avisos demo y `noindex` únicamente con datos reales y autorización de publicación.
