# Continuidad editorial · V2.1

Refinamiento solicitado por el usuario el 30/09/2026. Conserva identidad, textos, assets y comportamiento demo. Sustituye la composición móvil de paneles independientes por una secuencia editorial continua.

## Cambios

- Un único paisaje sticky decorativo acompaña los capítulos en flujo; el vídeo del hero se funde hacia él. Desaparecen los cuatro fondos reiniciados y el hueco de imagen vacío de origen.
- Origen es una pausa breve de lectura; el racimo precede a su texto. Los enlaces de continuación pasan a ser enlaces subrayados de al menos 48 px, manteniendo el CTA principal del hero.
- Nariz y boca comparten una sola copa. En teléfono precede a ambos pasajes; a partir de 640 px ocupa una columna sticky local mientras se leen. No hay pin global en móvil/tablet ni entradas que oculten el contenido.
- La cabecera y las uniones hacia compra/cata se integran mediante velos y máscaras de opacidad estáticas. Se conserva el encuadre y la proporción de los assets.
- En escritorio las disoluciones de texto se solapan ligeramente, sin el intervalo vacío anterior. La cámara y copa continúan; el cierre del paisaje acompaña la llegada a compra. Navegación inferior más discreta, sin línea horizontal que encajone la escena.

## Verificación realizada

Build estático revisado en Chromium mediante Playwright, `http://localhost:4322/`. Matriz: 320×740, 390×844, 430×932, 768×1024, 820×1180, 1024×768, 844×390, 1366×768 y 1440×900. Sin desbordamiento horizontal; cinco capítulos y dos vídeos en todos los tamaños. Capturas móviles/tablet/escritorio inspeccionadas, correcciones agrupadas y confirmación posterior.

Navegación de escritorio a boca: solo boca accesible y foco correcto; enlace a compra enfoca comprar. Al activar reduced motion: todos los capítulos accesibles, sin modo fijado, ambos vídeos pausados. Sin errores JavaScript en esta toma. `pnpm check`: cero errores/avisos/hints; `pnpm test`: 7/7; `pnpm build`: correcto, con los avisos transitivos PURE de Zod ya documentados. Detector de layout: sin hallazgos.

La reserva de espacio se mantiene durante la carga diferida de las imágenes. Para capturas de página completa, el paisaje sticky y las imágenes fuera de pantalla no equivalen al aspecto durante scroll; se revisaron también vistas parciales. Evidencia en `docs/qa-v2/after/continuity-*`; `continuity-final-*` corresponde a la confirmación. `docs/qa-v2/before/continuity-mobile.png` conserva el punto de partida. Las métricas de rendimiento y grabación de `VALIDATION_V2.md` son históricas de V2.0, no se presentan como nuevas medidas de esta revisión.

Archivos: `SceneStage.astro`, `NarrativeChapter.astro`, `index.astro`, `global.css`, `motion.ts`, `motion-v2.ts`, `DESIGN.md`, `README.md` y documentación de movimiento. Sin dependencias ni assets nuevos. No se ha publicado. Safari/iOS y Android físicos siguen pendientes; esta comprobación usa tamaños emulados de Chromium.
