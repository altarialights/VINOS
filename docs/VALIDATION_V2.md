# Validación de Ladera V2

Este informe registra V2.0. El posterior refinamiento de continuidad editorial se documenta en [CONTINUITY_V2_1.md](CONTINUITY_V2_1.md); las métricas y la grabación de abajo pertenecen a la toma anterior.

30 de septiembre de 2026. Integración local terminada, sin publicación. Informe vigente para `ladera-video-handoff`; `VALIDATION.md` y `REVIEW.md` corresponden a V1.

## Implementación y evidencias

Los seis archivos finales de `media/` están en `public/media/ladera/`, con sus nombres y bytes originales. No se publican los masters del vídeo. Botella, racimo, copa, rama, logo, fuentes, textos y datos aprobados conservados. La comparación de movimiento está en [MOTION_V2.md](MOTION_V2.md).

- [Grabación del recorrido en producción](qa-v2/recordings/scroll-v2.webm): capítulos, compra y cata a 1440×900.
- [Capturas anteriores](qa-v2/before/) y [capturas de la implementación](qa-v2/after/).
- Las imágenes `first-*` son diagnósticos intermedios; `hero-*`, `cata-*`, capítulos `*-1440` y `*-seam-*` documentan la revisión final.
- Se corrigieron durante la inspección una capa de sombra que afectaba al texto y una doble traslación de la botella causada por la interpretación del transform porcentual de CSS al inicializar GSAP.

## Entorno y comprobaciones

Windows, Node 22.20.0, pnpm 10.22.0. Astro 6.4.8, GSAP 3.15.0. Chromium automatizado con Playwright, build estático servido en `http://localhost:4322/`. Las pruebas temporales se ejecutaron con la página en primer plano: las pestañas secundarias del entorno pueden limitar requestAnimationFrame y distorsionar las mediciones.

| Comprobación | Resultado |
| --- | --- |
| `pnpm check` | 22 archivos, 0 errores, 0 avisos, 0 hints |
| `pnpm test` | 7 pruebas correctas: 5 de dominio y 2 de configuración/sincronización del movimiento |
| `pnpm verify:assets` | 60 verificaciones SHA-256 originales y 12 del nuevo media correctas |
| `pnpm build` | Build estático correcto; dos avisos de comentarios PURE de Zod, dependencia transitiva |

## Responsive y revisión visual

Se cargaron y capturaron hero y cata en 320×740, 390×844, 430×932, 768×1024, 820×1180, 1024×768, 844×390, 1366×768 y 1440×900. Sin desbordamiento horizontal en esa matriz. Titular bajo el encabezado, CTAs de 52 px y destinos de cata visibles. Inspección visual de las composiciones móvil/tablet/escritorio y de los cinco capítulos de escritorio. Móvil y tablet se apilan; solo 1366/1440 con altura suficiente activan el recorrido sticky.

La copa permanece a izquierda entre nariz y boca; cambian el texto a derecha y el acercamiento. La botella y el racimo conservan su identidad. El texto y los formularios no reciben parallax. En móvil se midió desplazamiento de la capa de producto con posición documental del titular constante. Póster y vídeo comparten recorte. Las capturas de cata conservan a las personas y la mesa como contexto del formulario.

## Navegación, accesibilidad y controles

- Navegación suave a capítulos y cata, hash directo, recarga con hash y vuelta atrás. El foco llega al destino visible. Cancelación de navegación mediante rueda y comprobación con PageUp; inversión recupera el capítulo anterior.
- Muestreo durante scrub: capítulo a opacidad 0.0256 sigue inert; al volver a origen a opacidad 1 resulta accesible. El estado procede del tiempo renderizado, no del destino solicitado.
- Menú con teclado: Tab dentro del diálogo, Escape cierra y devuelve foco; enlace a boca cierra menú y enfoca destino.
- Tres cambios completos móvil/escritorio: 2 vídeos, 1 cámara, 5 capítulos y 254 elementos, sin duplicación de escenas. La variante elegida de vídeo se mantiene.
- Movimiento reducido inicial y dinámico: sin pin/parallax ni reproducción automática, todos los capítulos disponibles. Ahorro de datos simulado: sin solicitudes MP4. Sin JavaScript: contenido completo y póster, sin solicitudes MP4 ni elementos video con src.
- Reflujo a 720×450, equivalente al espacio CSS de 1440×900 al 200%: sin overflow ni pin, inputs de 16 px. No equivale a probar el zoom nativo de todos los navegadores.
- Compra: cantidad 13 rechazada; cantidad 2 abre resumen demo, sin pedido. Cata: fecha vacía rechazada, fecha válida devuelve consulta demo sin reserva.

## Vídeo y fallbacks

Solo dos elementos video persistentes y como máximo uno reproduciendo. Cata carga al acercarse; antes de llegar solo se solicita el MP4 de viñedo. Un único tamaño por sesión, sin solicitudes de ambas variantes. La primera imagen es un póster HTML; el vídeo aparece tras frame decodificado mediante fundido de 320 ms.

Cada ambiente se reprodujo durante **tres vueltas completas** en la web a 1440×900, duración 7.25 s, fuente 24 fps. Se detectaron tres reinicios por mediaTime en requestVideoFrameCallback. Viñedo: 510 callbacks; cata: 516; contador de calidad final de cada toma: 526 frames, 0 dropped. Se inspeccionaron pares de capturas alrededor del final/inicio (`*-seam-end.png`, `*-seam-start.png`), sin salto de composición visible. Estos resultados no certifican fluidez en otros equipos ni convierten la fuente en 60 fps.

- Pausa manual conservada al ir a cata; activar reanuda únicamente el ambiente visible.
- Autoplay rechazado mediante NotAllowedError simulado: póster intacto y botón Activar; reintento permitido reproduce.
- Resolución de play retrasada 1.2 s seguida de pausa: no reactiva el vídeo.
- MP4 retrasado 3.5 s: póster de hero decodificado, vídeo oculto, titular y navegación a cata utilizables.
- Error de red del MP4: póster y Activar ambiente, sin negro.
- Importación de ScrollTrigger bloqueada: los cinco capítulos vuelven a flujo normal, sin inert; CTA a cata operativo.
- visibilitychange con document.hidden simulado: pausa ambos vídeos; al volver solo reanuda cata visible. El entorno no cambió document.hidden de manera fiable al abrir otra pestaña; por eso no se declara probado el ocultamiento real del sistema operativo.

## Rendimiento de laboratorio

Contexto Chromium nuevo, 1440×900, servidor local sin limitación de CPU/red. PerformanceObserver y métricas CDP Performance, tras 3 s de carga y recorrido nativo de 5 s hasta 4600 px. No es Lighthouse ni información de usuarios reales.

| Métrica | Resultado de esta toma |
| --- | --- |
| Último LCP observado | 148 ms (servidor local) |
| Suma de layout shifts sin entrada reciente | 0.001061 |
| Tareas largas >50 ms | 0 |
| Intervalos rAF durante recorrido | 825 muestras; mediana 6.1 ms, p95 6.2 ms; ninguno >50 ms |
| LayoutCount acumulado antes/después | 17 / 31 |
| RecalcStyleCount acumulado antes/después | 85 / 996 |
| TaskDuration acumulada antes/después | 0.163 / 0.770 s |
| Heap JS antes/después | 1.48 / 2.17 MB |
| Nodos CDP antes/después | 817 / 809 |

La cadencia rAF del entorno de escritorio no es una certificación de presentación ni de GPU. El aumento de memoria durante una toma no demuestra una fuga ni garantiza su ausencia en sesiones largas. Los recálculos de estilo incluyen las actualizaciones GSAP; no se observó layout en cada frame. No se ha medido INP de campo. Sin errores pageerror en la toma normal; los bloqueos de red de las pruebas negativas generan los errores esperados. En contextos reutilizados hubo advertencias de preload de fuentes; las tres fuentes terminaron cargadas, con familias correctas y sin fallo de recurso.

## Archivos de implementación

Nuevos: `src/config/motion-v2.ts`, `src/components/AmbientVideo.astro`, `src/components/AmbientControl.astro`, `src/scripts/ambient.ts`, `tests/motion.test.ts` y los seis archivos en `public/media/ladera/`.

Modificados: `src/scripts/motion.ts`, `src/scripts/controls.ts`, `src/components/SceneStage.astro`, `src/components/NarrativeChapter.astro`, `src/components/TastingForm.astro`, `src/pages/index.astro`, `src/styles/global.css`, `scripts/verify_assets.py`. Documentación: `README.md`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `docs/MOTION_V2.md`, este informe y avisos de histórico en informes V1. Referencias anteriores conservadas en `docs/baseline-v1/`. Sin dependencias añadidas.

## Límites de la revisión

Pruebas de navegador realizadas en **Chromium con tamaños emulados**. WebKit emulado, Safari iPhone y Chrome Android físicos no se han ejecutado. Quedan para esos dispositivos los gestos reales de trackpad/touch, zoom nativo, barra dinámica/safe areas, ocultamiento real de pestaña, batería, temperatura y sesiones largas. La carga lenta probada retrasa el MP4; no representa todos los recursos bajo una conexión móvil limitada. No se afirma compatibilidad física certificada ni puntuación Lighthouse. La entrega es local, con compra y reserva explícitamente demo.
