# Controles y profundidad · V2.2

30/09/2026. Implementado a petición del usuario, conservando la continuidad editorial V2.1 y todos los assets originales.

## Resultado

Botones principales de 56px con forma de cápsula, flecha en un detalle circular, contraste marfil/bosque y respuesta al pulsar. Secundarios con relleno translúcido y contorno fino. Menú y cierres circulares, selector de formato segmentado y redondeado, campos con radio de 18px y diálogos con radio de 28px. Foco visible y nombres accesibles conservados. Las formas redondeadas sustituyen por autorización expresa la antigua convención de 2px.

Dos recortes nuevos generados con `image_gen`, con alfa real y exportaciones WebP adaptadas. Paisaje al fondo, producto original en medio y hojas/sarmientos delante. En teléfono enmarcan la botella desde arriba/derecha y abajo/izquierda; en escritorio acompañan el escenario persistente. Los textos y controles quedan por encima del primer plano de escritorio, y los recortes móviles se mantienen dentro de la zona visual del producto. La rama izquierda se elevó después de la inspección para dejar espacio al párrafo.

Archivos y prompts exactos: [DEPTH_ASSETS.md](DEPTH_ASSETS.md). Los PNG originales generados se guardan en `design/generated/` y los cuatro archivos que usa la web en `public/assets/depth/`. No se publican los masters PNG. Las dos exportaciones móviles suman 81112 bytes.

## Verificación

Producción local `http://localhost:4322/`, Chromium/Playwright. Inspección visual de hero en móvil, tablet y escritorio; nariz de escritorio, compra y diálogo móviles. Segunda ronda confirma el ajuste de la rama y cata móvil.

- Matriz 320×740, 390×844, 430×932, 768×1024, 820×1180, 1024×768, 844×390, 1366×768 y 1440×900: sin overflow horizontal y radios de botón correctos.
- Textos de la etiqueta, titular y CTAs visibles; recortes con alfa, sin rectángulos de fondo. Los recortes no reciben eventos ni son anunciados por lectores de pantalla.
- Parallax móvil observado: transform del primer plano cambia al desplazar 200px; reduced motion elimina sus transforms, desactiva el modo fijado y pausa ambos vídeos.
- Menú: Escape cierra y devuelve foco. Compra: cantidad 0 rechazada; 2 cajas de 3 producen resumen demo de 6 botellas, sin pedido. Cata: campos de 16px y radios de 18px, botón de consulta accesible.
- Sin errores JavaScript en la toma de producción. `pnpm check`: 0 errores, 0 avisos, 0 hints en 24 archivos. `pnpm build`: correcto, con los avisos de anotación PURE de Zod ya conocidos.
- `pnpm verify:assets`: 60 comprobaciones originales y 12 de media V2 correctas. El exportador comprueba canal alfa y píxeles totalmente transparentes en los nuevos masters.

Evidencias en `docs/qa-v2/after/depth-first-*` y `depth-final-*`. No se han repetido las medidas de rendimiento de V2.0 ni se atribuyen a esta versión. Dispositivos físicos y WebKit siguen sin certificar. No se ha publicado.

## Código

Nuevo `DepthForeground.astro` y exportador `scripts/prepare-depth-assets.mjs`. Modificados `SceneStage.astro`, `NarrativeChapter.astro`, `Arrow.astro`, `motion.ts`, `motion-v2.ts`, `global.css` y `tokens.css`. Sin nuevas dependencias: el exportador usa Sharp que ya forma parte de Astro. Documentación y tokens de diseño actualizados para recoger la autorización de controles redondeados.
