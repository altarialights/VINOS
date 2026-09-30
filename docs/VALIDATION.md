# Validación local de Ladera

Informe histórico V1. Para la integración de vídeos y la nueva coreografía, consultar `VALIDATION_V2.md`; los resultados siguientes no certifican la V2.

Fecha: 30 de septiembre de 2026. Windows, Node 22.20.0, pnpm 10.22.0, Astro 6.4.8, Tailwind 4.3.3, GSAP 3.15.0, TypeScript 5.9.3. Navegador Chromium mediante Playwright. Servidores locales de desarrollo (4321) y build estático (4322). No se ha desplegado.

## Integridad y compilación

- Extracción del HTML original: 31 archivos comprobados por SHA-256.
- `pnpm verify:assets`: 60 comprobaciones correctas del paquete original, copias de producción y manifiesto de imágenes. Masters, exportaciones móviles, logo, fuentes y licencia conservados.
- `pnpm check`: cero errores, avisos o hints de tipos.
- `pnpm build`: build estático correcto. Rollup elimina dos comentarios `@__PURE__` de Zod (dependencia transitiva); no afectan al resultado.
- `pnpm test`: cinco pruebas correctas. Cubren ausencia de pedidos/reservas en demo, límites enteros 1–12, identificadores desconocidos, calendario y zona Europe/Madrid, allowlist de checkout HTTPS y aislamiento de los datos retornados.
- Detector de Impeccable: `[]` (sin hallazgos).

## Matriz responsive

| Viewport CSS | Resultado |
| --- | --- |
| 320 × 740 | Apilado, sin overflow; título y controles dentro del ancho. La sección crece para permitir todos los CTAs. |
| 390 × 844 | Apilado, imágenes móviles, todos los capítulos y formularios accesibles. |
| 430 × 932 | Apilado, sin overflow ni solapamiento con cabecera. |
| 768 × 1024 | Tablet apilada; se protege el ancho de lectura. |
| 1024 × 768 | Tablet apilada; compra en dos columnas sin desbordamiento. |
| 1440 × 900 | Cinco estados de escena, pausas de lectura, compra/cata en flujo. |
| 1920 × 1080 | Escena y textos dentro del encuadre, sin overflow. |
| 844 × 390 | Teléfono horizontal, sin pin; secciones crecen y controles alcanzables. |

Se inspeccionaron capturas de portada, compra y cata en los ocho tamaños; capítulos origen, uva, nariz y boca en escritorio; página completa móvil y visión general de escritorio. Están en `.impeccable/review/`. Los capítulos fijados deben juzgarse con sus capturas individuales: una captura completa del documento no reproduce el desplazamiento del escenario sticky.

Una captura inicial de compra a 1440 mostraba una banda de composición gráfica. Se repitió desde el enlace Comprar esperando dos frames de composición; la nueva captura muestra etiqueta y controles completos y el hit test devuelve el botón correcto. No se tomó la captura defectuosa como aprobación visual.

## Flujos comprobados en navegador

- Comprar desde cabecera evita recorrer la narrativa. Formato Caja de 3 y cantidad 2 actualizan el resumen a 6 botellas.
- Comprar abre aviso explícito de demo sin crear pedido. Escape cierra el diálogo y devuelve el foco al botón.
- Cantidad 1,5 rechazada; mensaje asociado al campo. Límites adicionales 0, negativos, 13 y no finitos cubiertos en pruebas de dominio.
- Dónde encontrarlo muestra el estado vacío sin inventar comercios.
- Cata sin fecha muestra error asociado y enfoca el campo. Consulta válida (10 de octubre de 2099, 3 personas) devuelve resultado simulado y declara que no se envió ni realizó una reserva.
- Menú móvil: foco permanece dentro con Tab, Escape cierra y devuelve foco; La uva cierra el menú, actualiza hash y enfoca el artículo. Título queda bajo la cabecera (artículo a ~84 px con cabecera de 68 px).
- Links En nariz/En boca cambian al capítulo correspondiente con estado semántico. Un solo h1 y contenido textual real.
- Build final: el h1 contiene exactamente `UN LUJO EN NAVALUENGA`. Entradas directas por `#uva`, `#comprar` y `#cata` mantienen el destino y muestran el título; compra/cata arrancan a ~92 px de la parte superior. La rama identificada como LCP lleva `fetchpriority="high"`. Consola final sin errores ni avisos.
- Scroll adelante y atrás, con muestras dentro de transiciones: nunca dos textos con opacidad superior a 0,4 a la vez. Cinco mesetas; último estado continúa hasta finalizar el tramo.
- Tres ciclos móvil/escritorio: una sola escena compartida activa, sin duplicación del DOM.
- Cambio dinámico a movimiento reducido, tras esperar el evento de media query: cero escenas compartidas; cinco capítulos en posición relativa, opacidad 1 y sin inert. Sin pin ni rotación de botella.
- Contexto independiente con JavaScript desactivado: cinco capítulos visibles, un h1, navegación disponible, cero overflow y aviso honesto para controles demo.
- Reflow equivalente a 200% de una ventana 1440×900 probado a 720×450 CSS: sin overflow ni pin. No equivale a una sesión manual de zoom del navegador ni a una prueba con lector de pantalla.
- Inputs >=16px; botones/inputs/CTAs renderizados >=44px en la matriz. Foco visible y diálogos HTML nativos.

## Carga inicial observada

Dos contextos nuevos contra `pnpm preview`, sin scroll, sin throttling y con caché del contexto nueva. Lectura de Resource Timing y PerformanceObserver; no es Lighthouse ni dato de campo. La transferencia indicada suma subrecursos (excluye el documento HTML).

| Muestra local | Subrecursos transferidos | CLS observado | LCP observado |
| --- | ---: | ---: | ---: |
| 390 × 844 | 496.430 bytes | 0,00491 | 80 ms, botella móvil |
| 1440 × 900 | 1.325.132 bytes | 0 | 128 ms, rama de primer plano |

Estos tiempos solo reflejan localhost en este equipo. No permiten prometer LCP en red móvil, INP o FPS. Se priorizó también la rama de escritorio al identificarla como candidato LCP. La botella móvil ya era prioritaria. En la muestra de escritorio no se descargaron la copa ni el escenario de cata al inicio; en móvil no se descargó GSAP. No se descargaron ambas variantes desktop/mobile del mismo asset. Cero errores JavaScript y cero peticiones fallidas en las dos cargas de producción.

## Pendientes concretos

- Safari iOS y Chrome Android en dispositivos físicos, teclado de fecha real, safe-area, barras dinámicas, segundo plano y conexión móvil limitada.
- Medición de campo de Core Web Vitals, INP, memoria/GPU y trazas en hardware de gama media; Lighthouse no ejecutado.
- Zoom real 200% con navegador y evaluación con lector de pantalla; se comprobó el reflow equivalente, teclado y semántica.
- Backend, catálogo autorizado, precios/stock, horarios/capacidad, checkout, Turso y contenidos legales/reales. Ver `BACKEND.md`.

No se confirma producción comercial ni hardware no probado. El resultado es una implementación local funcional de demostración.
