# LADERA · Integrar los vídeos de Higgsfield

Ejecuta este encargo sobre el proyecto existente. Esta instrucción autoriza integrar los clips que acompañan el paquete y sustituye el apartado de vídeos pendientes de PROMPT_CODEX_LADERA_V2.md. Sigue las demás correcciones de movimiento de ese documento.

## Resultado esperado

La web debe tener movimiento ambiental real y parallax suave. El vídeo aporta brisa y vida; el scroll aporta cambios de encuadre y profundidad. No sumar una cámara exagerada sobre el vídeo. No convertir toda la página en una película ni ocultar los fallos de las transiciones actuales.

## Archivos

Consulta media-manifest.json para archivos, resolución, duración, pesos, hashes y URLs de respaldo. Utiliza las versiones de media/ en la web, nunca masters/. Los posters pertenecen a los clips finales y evitan diferencias al iniciar la reproducción.

1. Viñedo: ladera-vineyard-desktop.mp4 / ladera-vineyard-mobile.mp4 / ladera-vineyard-poster.webp.
2. Cata: ladera-tasting-desktop.mp4 / ladera-tasting-mobile.mp4 / ladera-tasting-poster.webp.

Copiar media/ a public/media/ladera/, preservando nombres. Los originales ya existentes no deben borrarse. No enlazar la web publicada a URLs temporales de generación ni cargar masters innecesariamente.

## Composición

Dentro de SceneStage, sustituye únicamente el fondo por el vídeo de viñedo. Mantén la botella, racimo, copa, logo, textos y botones como capas independientes. Usa un solo vídeo persistente durante los capítulos del viñedo: no reinicies su reproducción en cada capítulo ni crees cinco decodificadores del mismo clip.

En móvil usa un único ambiente de viñedo para el hero y posters en secciones posteriores si repetir el vídeo empeora rendimiento. No montar un vídeo por tarjeta. La cata tiene su propio vídeo, cargado cuando se aproxima a pantalla. Evita simultaneidad innecesaria de reproducción/decodificación.

El fondo de cata reemplaza solo tasting-art. Conserva formulario y overlay de contraste. No uses opacidad tan baja que borre todo el movimiento, ni filtros que oculten la calidad.

Los vídeos son fondos completos, no recortes transparentes. No cambies arbitrariamente proporción, no estires ni espejes. Usa object-fit:cover y calibra object-position por breakpoint con vista real. Los pósteres deben usar idéntico object-position. Comprueba especialmente las personas de la cata y la dirección del sol.

## Reproducción progresiva

Implementa AmbientVideo.astro y un controlador mínimo compartido. El HTML inicial muestra el poster sin depender de JS. La URL de vídeo permanece en data-* hasta que deba cargarse para evitar descargas anticipadas.

Estados: poster → carga → reproduciendo / pausado / fallback. Selecciona UNA variante según el layout; no descargues simultáneamente desktop y mobile. No cambies src cada vez que varíe un píxel del viewport. Mantén la selección durante la sesión salvo necesidad real y explícita.

Vídeo muted, playsinline, sin audio, sin controles invasivos. Reproducción normal independiente del scroll. No escribir currentTime en cada evento scroll. No ralentizar globalmente la página ni bloquear scroll mientras carga.

Espera un fotograma decodificado antes de revelar el vídeo: requestVideoFrameCallback cuando esté disponible y fallback compatible. Funde poster/vídeo suavemente, aproximadamente 250–400ms. Si play() falla, conservar poster y mostrar un control discreto para reproducir si procede. Nunca dejar negro o un icono roto.

IntersectionObserver y visibilitychange controlan carga y pausa. Una promesa de play que termina tarde no debe reactivar un vídeo que ya salió de pantalla; usar estado deseado y comprobación al completar. El controlador debe limpiar listeners y observers.

Añade botón accesible “Pausar ambiente” / “Activar ambiente”. Una pausa manual no se revoca automáticamente al volver a entrar en pantalla. No guardar preferencias ni datos personales innecesarios. Respetar prefers-reduced-motion desde el inicio y sus cambios: detener vídeo y mostrar poster. Con saveData disponible usar poster; no depender de esa API para que la web funcione.

Cargar hero después del contenido prioritario sin bloquear LCP. El segundo clip se prepara cerca del viewport. Usa MP4 H.264 de este paquete como base compatible; no añadir codecs nuevos sin necesidad. Caché de archivos externos. No base64, canvas a pantalla completa ni secuencia de cientos de imágenes para estos ambientes.

## Coreografía y comprobación

Aplica también PROMPT_CODEX_LADERA_V2.md: ampliar tramo de transición, scrub numérico ajustado tras observarlo, movimiento de cámara repartido, eliminar viaje lateral de la copa y saltos instantáneos de navegación, sincronizar el estado accesible con la timeline renderizada y añadir movimiento ligero móvil.

Los clips no garantizan por sí mismos 60 FPS. Medir build de producción. Revisar loop durante al menos tres vueltas; si la unión muestra un salto, corregir la edición o presentar el poster antes que ocultarlo con parallax fuerte. No usar reproducción invertida de personas para simular un bucle.

Pruebas mínimas: 320/390/430 px, tablet vertical/horizontal, 1366/1440 px; scroll lento/rápido e inverso; salto a cata; pausa manual; ocultar pestaña; autoplay bloqueado; reduced motion; red lenta; carga con hash; teclado; ausencia de JS. Comprobar consola, requests duplicadas, salto de layout y memoria.

Entregar código funcionando y relación de pruebas hechas, diferenciando Chromium/WebKit emulado de Safari iPhone y Chrome Android físicos. No presentar los controles demo como pagos o reservas reales. No publicar sin instrucción del usuario.
