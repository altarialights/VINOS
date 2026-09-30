# Encargo ejecutable para Codex · LADERA 1.0

Construye una web de vino cinematográfica, moderna y comercial a partir de ESTE paquete de producción. Quiero una implementación real, no otro mockup ni una landing genérica.

## Preparación
Si recibes LADERA_ENTREGA.html y preparar_ladera.py, ejecuta el extractor: `python preparar_ladera.py LADERA_ENTREGA.html --out ladera-handoff`. Extrae únicamente en una carpeta de trabajo nueva; el script verifica las huellas y no sobrescribe archivos distintos sin --overwrite. Lee README.md, docs/DESIGN_CONTRACT.md, docs/QA_ACCEPTANCE.md y docs/BACKEND_CONTRACT.md. Abre preview/index.html mediante un servidor local antes de implementar.

Inspecciona el repositorio y sus instrucciones. Si no existe proyecto, créalo. Usa Astro, TypeScript estricto, Tailwind CSS, pnpm y GSAP/ScrollTrigger para la coreografía de escritorio cuando aporte valor. Consulta documentación oficial para compatibilidad de versiones. No mezcles configuraciones de distintas versiones de Astro o Tailwind. No usar Supabase. Turso se conectará en una segunda fase: prepara interfaces y adaptadores, sin credenciales ni base de datos ahora.

## Skills
Consulta las skills realmente disponibles. Si hay Impeccable o una skill acreditada de diseño frontend, responsive, accesibilidad o animación, aplícala a la revisión. No inventes skills ni comandos y no instales dependencias desconocidas atribuyéndoles ese nombre. La skill debe mejorar la ejecución respetando este contrato visual. Su ausencia no bloquea el trabajo.

## Fuente de verdad
Los archivos spec/content.json, spec/motion.json, spec/tokens.css y spec/assets.json fijan los datos, parámetros y assets. El prototipo montado con ellos es la referencia compositiva. Las imágenes antiguas del chat son inspiración de dirección de arte, NO assets de producción.

No regeneres paisaje, botella, copa, racimo o rama. No crees versiones distintas para cada sección. Usa los mismos masters y sus exportaciones móviles. No sustituyas el SVG del logo ni las fuentes locales. No espejes la botella, no cambies etiqueta, luces o proporciones. No conviertas screenshots completos en fondos de página. Tipografía, formularios y botones siempre HTML real.

## Objetivo y contenido
Titular EXACTO: UN LUJO EN NAVALUENGA. Marca de demostración: Ladera. Recorrido: portada → origen → uva → en nariz → en boca → compra → cata. El sitio debe despertar deseo y permitir llegar directamente a compra/reserva sin recorrer la narrativa completa.

Ladera, Garnacha 2023 y las notas incluidas son datos ilustrativos; no son una ficha de una bodega real. No inventes precios, stock, premios, altitudes, parcelas, certificaciones, direcciones ni horarios. No utilices paisajes generados como prueba documental de una localización. Centraliza todos los contenidos para cambiarlos después.

## Arquitectura visual
Un componente SceneStage controla las capas reutilizadas. Un componente NarrativeChapter representa contenido semántico y accesible. Header, WineProfile, PurchasePanel y TastingForm separados. Usa CSS variables y configuración tipada, no valores desperdigados.

Mantén DOM simple. Astro para contenido; islas solo para controles que lo requieran. No hidratar toda la web como SPA. Importar animación cuando se necesite. Si usas React por una necesidad concreta, explica cuál. El prototipo tiene JavaScript mínimo para demostrar las posiciones; puedes sustituir su motor por GSAP respetando el resultado.

## Coreografía
Respeta motion.json. Scroll nativo y transform/opacity como base. Cinco estados con pausas visuales para leer. Encadenar timelines dentro de un tramo narrativo acotado en escritorio; compra/cata fuera del pin. Ningún scroll-jacking, cursor artificial, giro obligatorio del móvil o espera por loader ficticio.

La cámara es aparente 2.5D: pequeñas escalas y desplazamientos. No prometer una órbita 3D con recortes planos. El racimo y la copa conservan forma. No rotar la copa llena como si el vino ignorara la gravedad. El plano de cata es un corte editorial a otro escenario; no intentar morphing del paisaje.

Al cambiar tamaño/reduced-motion, revertir animaciones y limpiar contextos/listeners. Recalcular tras fuentes/imágenes listas, cambios estructurales o orientación, nunca en un bucle cada frame. Evitar refrescos bruscos por la barra de Safari. No desactivar resize de manera global ocultando bugs.

## Móvil y tablet
Mobile-first desde 320px. Implementa el diseño apilado del prototipo y las reglas mobile de motion.json. No reduzcas simplemente el layout desktop. Mantén titular arriba, pieza visual centrada, texto y CTAs accesibles. En móvil no se fija todo el recorrido: desplazamientos decorativos de hasta 12px y contenido en flujo normal.

No desbordamiento horizontal, recortes del titular o botones fuera de alcance. Imágenes con object-fit/position adecuados, safe-area, inputs >=16px, targets >=44px. Si el contenido no cabe en un viewport, que la sección crezca. No ocultarlo. Probar también teléfonos en horizontal y tablets verticales. No depender de hover.

## Funciones reales del frontend
Menú, navegación por secciones, perfil de cata, formato, cantidad, validación de fecha/personas, modales accesibles y mensajes demo deben funcionar. Si hay precios/stock nulos, nunca confirmar compra ficticia. Con un checkoutUrl autorizado se podrá redirigir; en demo explica que falta conectar la tienda. No añadir formularios largos para fingir una tienda funcional.

La cata permite elegir fecha y asistentes y consultar el adaptador. Mientras no haya backend, mostrar resultado explícitamente simulado y NO enviar correo, WhatsApp ni reservas. Dónde encontrarlo usa retailers configurados; si lista vacía, mostrar estado vacío honesto. Preparar loading, error, vacío y éxito real futuro.

No guardar datos personales en almacenamiento local. Si incorporas contacto real después, usar datos suministrados y autorización explícita para enviar.

## Rendimiento y accesibilidad
Picture/srcset con variantes del mismo asset; no descargar ambos tamaños por CSS display:none. Imagen LCP prioritaria según lo que realmente mida el navegador. Lazy load/preparación próxima de capítulos secundarios. Reservar dimensiones para evitar CLS. Fuentes locales y pocos pesos. No cargar los 6 masters completos en el inicio de producción por comodidad.

El HTML de entrega incluye todas las imágenes en base64 para transporte y revisión: NO publicarlo como web final ni copiar sus costes de carga. En el proyecto, usar ficheros externos cacheables. Limitar el tamaño de las texturas a la necesidad real. Evitar filtros grandes, vídeos obligatorios y secuencias pesadas. No mantener requestAnimationFrame activo cuando no hay cambios.

Accesibilidad: heading único h1, estructura h2, textos alternativos, foco visible, Escape y focus management en menú/diálogos, contraste suficiente, semántica de controles, errores asociados a campos. Con prefers-reduced-motion, sin pin ni parallax; contenido completo y estático. Con JS desactivado, todo el contenido esencial y enlaces deben estar presentes.

No añadir música por defecto: no se ha solicitado sonido para esta web de vino. Si se pide después, opt-in y con derechos, sin reproducir automáticamente.

## Forma de ejecutar
1. Inspecciona y resume decisiones, luego trabaja sin detenerte en un plan.
2. Construye primero portada → origen → uva con los assets definitivos en móvil/escritorio.
3. Revisa en navegador y corrige composición/movimiento antes de replicar el sistema.
4. Completa matices, compra y cata sin abandonar el alcance restante.
5. Implementa adaptadores demo y documenta conexiones futuras.
6. Ejecuta tipos/build y pruebas de flujos críticos. Revisa todos los tamaños del checklist.
7. Entrega código completo, instrucciones pnpm, informe real de validación y pendientes concretos.

Comprueba hashes del paquete antes de reutilizar los assets. No interpretes una instrucción de verificación como permiso para cambiar los originales. Si hace falta un nuevo export técnico, conserva el master y actualiza su manifiesto.

No prometas FPS ni una puntuación de Lighthouse sin medición. Separa pruebas Chromium emulado de Safari/Android físicos. No publiques ni despliegues sin una instrucción del usuario. El resultado debe quedar ejecutable y revisado localmente, con una dirección de arte propia y coherente.

## Estado inicial de QA
Lee docs/VALIDATION_STATUS.md. La referencia todavía requiere inspección visual en navegador. Corrige cualquier solapamiento o fallo responsive sin regenerar activos. Las pruebas de iOS/Android físico siguen pendientes; no las presentes como realizadas.
