# Aceptación y comprobaciones

## Funcional
- Menú móvil operable con teclado, Escape y retorno del foco.
- Anchors a capítulos correctos con margen de cabecera, sin ocultar títulos.
- En nariz/en boca con estados claros y semántica accesible si son tabs; alternativa simple como enlaces.
- Formato/cantidad coherentes: cantidad entera de 1 a 12, cambios visibles.
- Si checkoutUrl/price/stock son null, no inventar confirmación de pedido. Abrir explicación de demo.
- Fecha de cata y personas con etiquetas, validación y mensaje explícito de consulta no enviada; sin persistir datos personales en localStorage.
- Errores de red y de disponibilidad previstos para la segunda fase; no mostrar una reserva confirmada sin backend.

## Visual
Revisar 320x740, 390x844, 430x932, 768x1024, 1024x768, 1440x900 y 1920x1080. Sin overflow horizontal; etiqueta legible; botella íntegra; nav no pisa titular; textos no se mezclan durante transiciones; el último capítulo termina sin salto. Scroll lento/rápido hacia delante y atrás. Cambio de orientación y resize sin duplicar listeners ni timelines.

## Accesibilidad
Zoom 200%, foco visible, navegación por teclado, contraste de textos sobre imágenes, botones de al menos 44x44 CSS px, contenido disponible sin JS. Movimiento reducido tiene todos los capítulos en flujo normal. No imágenes con nombres/copy como sustituto del HTML. Assets decorativos con alt vacío; producto con alt útil cuando aporte significado.

## Objetivos de rendimiento para implementación (no resultados medidos de este kit)
Objetivos orientativos: LCP <=2.5s, CLS <=0.1 e INP <=200ms en datos de campo cuando existan. Evaluar carga fría, móvil de gama media y red limitada; no prometer 100/100 ni 60 FPS universales. Investigar saltos y tareas largas en trazas, memoria de texturas y número de capas, no solo Lighthouse.

Objetivo de transferencia inicial de producción: hero, fuentes críticas, CSS y JS dentro de ~1.5 MB comprimidos, ajustable con mediciones. No descargar las variantes desktop y mobile simultáneamente. La entrega HTML contiene todo en base64 por portabilidad y es deliberadamente más pesada: NO desplegarla tal cual.

## Safari iOS / Chrome Android
Revisar en dispositivos físicos: iPhone 11 o equivalente y Android de gama media. Si no están disponibles, documentar la limitación. Comprobar barras de navegador al aparecer/desaparecer, safe-area, teclado de fecha, vuelta desde segundo plano, navegación atrás, reducción de movimiento y conexiones lentas. Emular viewport no equivale a probar iOS.

## Entrega
pnpm install, pnpm check, pnpm build. Revisar consola y recursos fallidos. Capturas representativas y pequeño informe con entorno, resultados reales y pendientes. No afirmar validación de hardware no disponible.
