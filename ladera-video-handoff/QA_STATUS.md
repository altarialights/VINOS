# Ladera · Estado de los recursos finales
Fecha: 30/09/2026.
Generación: Kling 3.0 Pro, dos escenas, dos pasadas. Consumo confirmado por diferencia de saldo: 49 créditos (342.75 → 293.75).
La primera pasada se descartó por movimiento demasiado tenue. Los masters finales proceden de la segunda.
## Edición
Clips de 8 segundos convertidos a bucles de 7.25 segundos a 24 fps, con fundido cruzado de 0.75 segundos hacia el inicio. Nunca reproducción invertida.
Se ha aplicado una máscara suave de protección de identidad: en cata, personas y mesa permanecen fijas y el movimiento queda en vegetación; en viñedo, el movimiento queda principalmente en el valle, preservando cielo y primer plano. Es una composición tipo cinemagraph.
El movimiento es ambiental. El parallax y las transiciones de la web todavía deben implementarse y verificarse.
## Comprobaciones
Inspección de fotogramas distribuidos de las dos escenas y de su transición de bucle. Comprobación de decodificación, dimensiones, duración, ausencia de audio, H.264 y ubicación de moov antes de mdat (faststart) en los archivos locales finales.
Archivos desktop: 1440×960. Archivos mobile: 768×512. Se conserva proporción 3:2; el recorte responsive se decide con object-position.
Los pósteres salen de los vídeos finales para mantener continuidad.
El manifiesto contiene pesos y hashes de cada copia. Las exportaciones de Windows y Linux pueden diferir en bytes por versión de FFmpeg; no mezclar sus hashes.
## Pendientes
No se ha certificado reproducción a 60 FPS: las fuentes son 24 fps. La animación de interfaz tiene su propia cadencia.
No se ha probado la integración con la web, autoplay en dispositivos físicos, consumo de batería ni la fluidez final en Safari iOS/Chrome Android.
La revisión de fotogramas no sustituye reproducir al menos tres vueltas del bucle en la web a tamaño real.
Usar solo media/ en producción. masters/ conserva originales e intermedios, y no debe publicarse.
