# LADERA · Paquete de producción 1.0

Este paquete fija el concepto «UN LUJO EN NAVALUENGA». Es un handoff y una previsualización funcional de dirección de arte; no una tienda publicada ni una promesa de rendimiento en dispositivos físicos.

## Empezar
1. Lee PROMPT_CODEX.md.
2. Abre preview/index.html mediante un servidor local; puedes usar `python -m http.server 4173` desde la raíz y entrar en `/preview/`.
3. Lee docs/DESIGN_CONTRACT.md y docs/QA_ACCEPTANCE.md.
4. Implementa con los assets y contratos de spec/. No regeneres las imágenes.

## Archivos de autoridad
- assets/: 6 imágenes maestras exportadas a WebP, 6 versiones móviles, 3 fuentes locales con licencia y un SVG vectorizado.
- spec/content.json: copy, estructura y datos pendientes.
- spec/motion.json: coreografía y encuadres.
- spec/tokens.css: tipografía, colores y medidas.
- spec/assets.json: dimensiones, alfa, procedencia y SHA-256 de las imágenes.
- preview/: previsualización con estos mismos recursos; no usa una captura de pantalla como web.
- docs/: diseño, conexiones y criterios de aceptación.

Las imágenes de escenas anteriores en el chat son referencias de intención. Esta versión ensamblada es la fuente de verdad para posiciones, assets y tipografía. No mezclarla con capturas antiguas.

Ladera es ficticia. La añada, la variedad y las notas son ejemplos. Las escenas generadas no documentan una bodega o una parcela real. Precio, stock, direcciones y catas quedan pendientes.

El archivo HTML de entrega contiene este árbol completo embebido. El extractor comprueba sus huellas y reconstruye los archivos sin descargar recursos ni instalar dependencias.
