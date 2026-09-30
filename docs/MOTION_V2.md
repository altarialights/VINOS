# Ladera V2: contrato de movimiento vigente

Actualización 2.2: añade dos recortes de vegetación transparente en primer plano. En móvil, fondo 8px, sujeto 16px y primer plano 20/24px (adicional al desplazamiento de su composición); en escritorio, primeros planos con recorrido total de -5% y -7% vertical y ±2% horizontal. Sin oscilaciones automáticas. Se conservan los modos reducido/estático y la limpieza del controlador. Ver `DEPTH_V2_2.md` y `DEPTH_ASSETS.md`.

Actualización 2.1: a petición del usuario, el flujo móvil/tablet tiene un único paisaje continuo detrás de los capítulos, con fundido del ambiente del hero hacia ese paisaje. Origen se compacta, el racimo precede a su texto y nariz/boca comparten una única copa; desde 640px esta copa acompaña ambos textos en una columna sticky local, sin fijar el recorrido completo. Los enlaces editoriales sustituyen los botones de bloque entre capítulos. En escritorio, salida y entrada de texto ocupan el 56% de la transición cada una, con solape del 12%, eliminando el intervalo vacío de V2.0. Una máscara tonal enlaza narrativa, compra y cata. Configuración: `version: 2.1.0`. Validación de este ajuste: `CONTINUITY_V2_1.md`.

Autoridad: `ladera-video-handoff/INTEGRAR_EN_CODEX.md`, `PROMPT_CODEX_LADERA_V2.md` y `QA_STATUS.md`. Los contratos originales de `ladera-handoff/` permanecen intactos como archivo de la entrega V1. Su `motion.json` ya no controla la aplicación. Los datos editoriales, identidad, assets de producto y tipografías de V1 siguen vigentes.

La configuración ejecutable vigente es `src/config/motion-v2.ts`. La implementación anterior y su documentación se conservaron en `docs/baseline-v1/` para revisar los cambios locales (la carpeta de trabajo no es un repositorio Git).

## Antes y después

| V1 | V2 |
| --- | --- |
| Transiciones concentradas al final del 22% de cada tramo | Transiciones de 53–57% de intervalos de distinta duración; labels y pausas explícitas |
| `scrub: true` | `scrub: 0.7` |
| Cámara inmóvil durante la lectura | Cámara continua, `ease: none`, escala 1.02→1.055 y desplazamientos totales -1.6%/-1% |
| Copa de x25% a x75% | Misma copa en x25%; ambos textos a derecha; acercamiento 1→1.045 |
| Botella que abandona la pantalla | Pequeña variación de pose y disolución gradual |
| Rama rígida como principal animación | Rama con profundidad discreta; movimiento orgánico en el clip |
| Capítulo accesible según scroll solicitado | `inert`, `aria-hidden`, interacción y nav según timeline realmente renderizada |
| Enlaces con salto instantáneo | Desplazamiento de 850 ms interrumpible, foco al llegar al texto visible |
| Móvil estático | Fondo 8 px, producto 16 px, racimo 20 px como recorrido total, solo en secciones visibles |
| Cambio tardío a sticky tras imports | Geometría inicial reservada antes de parsear el contenido; fallback legible si el módulo falla |

## Responsabilidades

- `SceneStage`: un único escenario con un único vídeo de viñedo persistente. En móvil su área corresponde exclusivamente al hero; el resto utiliza el póster final.
- `.scene-camera`: transform de cámara; `.scene-depth`: profundidad por plano; `.subject-layer`: pose y opacidad de producto. Cada superficie tiene un propietario de transform.
- `AmbientVideo.astro` + `ambient.ts`: dos vídeos HTML, uno por escenario, sin islas ni dependencias nuevas. Reproducción temporal normal sin asociar `currentTime` al scroll.
- `motion.ts`: navegación, timeline desktop y parallax apilado. Compra/cata siempre en flujo. Sin interceptar rueda/touch para imponer desplazamientos.

Escritorio enriquecido: ancho >=1100 y alto >=700, sin movimiento reducido. Tablets 768×1024, 820×1180 y 1024×768 usan flujo normal y parallax ligero. Las pantallas horizontales bajas también se apilan. El recorrido ocupa 5.1 alturas de viewport de scroll más el viewport del escenario.

## Media y estado

Se copian únicamente los seis archivos de `media/` a `public/media/ladera/`. Los vídeos conservan H.264, 24 fps, 7.25 segundos, proporción 3:2, ausencia de audio y bucle hacia adelante de la entrega. Los pósteres son los fotogramas finales suministrados; imagen y vídeo comparten el mismo `object-position` y `object-fit: cover`.

El HTML inicial contiene un póster real y URLs de vídeo en `data-*`, sin `src`. El controlador elige una sola variante por sesión (mobile hasta 767px, desktop por encima) y la conserva al cambiar orientación o ancho. La carga comienza después del contenido inicial; cata se prepara a 500px de proximidad. Solo reproduce el ambiente con mayor presencia visible.

Estados: poster, loading, playing, paused, fallback. Un frame decodificado precede al fundido de 320ms. Si autoplay o red fallan, se conserva el póster y se ofrece Activar ambiente. Una pausa manual se conserva al salir y volver. Pestaña oculta y secciones fuera de pantalla se pausan; una resolución tardía de `play()` no revoca ese estado. Reduced motion y saveData muestran póster sin reproducción automática. No se persisten preferencias ni datos personales.

Referencias consultadas: [ScrollTrigger y scrub numérico](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [autoplay y play()](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [fotograma decodificado](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback).
