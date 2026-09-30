# Primer plano generado · V2.2

Dos assets nuevos creados el 30/09/2026 con la herramienta integrada `image_gen` (sin CLI/API externa). Son vegetación decorativa; no sustituyen ni alteran botella, copa, racimo, paisaje, logo o tipografías originales.

## Archivos

- Masters PNG RGBA: `design/generated/vine-right-v1.png`, `design/generated/vine-left-v1.png`.
- WebP transparentes: `public/assets/depth/vine-right-desktop.webp`, `vine-right-mobile.webp`, `vine-left-desktop.webp`, `vine-left-mobile.webp`.
- Exportador reproducible: `node scripts/prepare-depth-assets.mjs`. Solo adapta resolución/formato, conserva el canal alfa y los PNG originales. Los PNG no se publican.
- Desktop: 960×960, derecha 159262 bytes e izquierda 97542 bytes. Móvil: 480×480, derecha 48504 bytes e izquierda 32608 bytes. Tamaño móvil combinado: 81112 bytes.

## Composición

Paisaje/vídeo al fondo, botella/racimo/copa originales en el plano medio, vegetación nueva delante. En móvil se ancla a la composición de la botella; en escritorio acompaña la escena persistente. Los textos y controles quedan libres. Sin pointer events ni exposición al lector de pantalla. Parallax más amplio para el primer plano, con limpieza al cambiar de modo y alternativa inmóvil bajo reduced motion. Dos imágenes únicas por tamaño, reutilizadas por los dos layouts; caché del navegador.

## Prompt derecho

Use case: photorealistic-natural. Create ONE production-ready PNG foreground cutout with TRUE transparent alpha background for a premium Spanish vineyard wine website, not a mockup. A graceful natural grapevine shoot with four broad green vine leaves, a slender curved woody stem and one delicate curled tendril. Photorealistic botanical photography, warm late afternoon light from upper right, subdued deep forest greens and a little translucent amber rim light, tactile fine veins, refined quiet look. Composition: square canvas, branch enters from the UPPER RIGHT corner and curves down along the right edge; leaves occupy mostly the rightmost half and upper quarter, center and left remain genuinely transparent. One leaf reaches inward, natural irregular silhouette; no rectangular photo background. Full plant only, no wine bottle, grapes, text, logo, frame, checkerboard drawing, scenery, ground or cast shadow on a backdrop. Subtle optical softness on the closest leaf, main leaves sharp enough for a web foreground. This asset will overlap the edge of a landscape and sit in front of an existing wine bottle without covering its label. Transparent background is essential.

## Prompt izquierdo

Use case: photorealistic-natural. Create ONE production-ready transparent PNG foreground botanical cutout for a luxury Spanish vineyard wine website. TRUE transparent alpha background, no backdrop. A close grapevine twig entering from the LOWER LEFT corner, carrying two broad softly curved olive-green vine leaves and a fine curled tendril, warm subtle amber sunlight from upper right. Photoreal botanical photography, foreground slightly out of focus with natural soft optical edges, deeper forest green than bright yellow, no strong saturated highlights. Composition square: the cluster stays in the leftmost third and bottom-left quadrant, slender tendril extends slightly toward center, all central and right areas genuinely transparent. Natural leaf silhouette, not a geometric mask. An intimate quiet foreground passing close to the camera, used as a parallax overlay at the edge of a wine landscape. No bottle, grapes, lettering, branding, flowers, rocks, landscape, rectangle, black background, white background or drawn checkerboard. Keep negative space and true transparency.
