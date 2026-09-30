# LADERA · Corrección de experiencia y movimiento · V2

Implementa este encargo sobre el proyecto existente. No te limites a explicar los cambios. Mantén Astro, TypeScript, Tailwind, pnpm y GSAP. No conectes todavía Turso, pagos ni reservas reales. No publiques.

## Prioridad y alcance

Esta instrucción sustituye las reglas de movimiento del handoff anterior: transitionFraction=0.22, trayectorias laterales largas de copa/racimo y ausencia de animación móvil dejan de ser obligatorias. Conserva los originales, identidad, logo, tipografías, titular UN LUJO EN NAVALUENGA y contenido aprobado. Versiona la nueva configuración de movimiento y documenta el cambio; no dejes contratos contradictorios.

Queremos una experiencia editorial cinematográfica con profundidad y movimiento suave. El usuario considera el resultado actual demasiado rápido, rígido y parecido a imágenes que se deslizan. La solución no consiste en ralentizar indiscriminadamente todos los elementos o convertir toda la página en vídeo.

## Evidencia de revisión

Se han leído el HTML/CSS servido por http://localhost:4321 y estos archivos del proyecto:
- src/scripts/motion.ts
- src/components/SceneStage.astro
- ladera-handoff/spec/motion.json
- src/pages/index.astro

No se ha podido observar la pestaña real ni medir frames: el navegador conectado estaba separado del navegador del usuario. Por tanto, los siguientes son hallazgos de código, no una certificación visual:
1. Cada transición está concentrada en 0.22 unidades al final de cada capítulo. Con seis alturas de viewport y cinco unidades de timeline, corresponde aproximadamente a 22% de un viewport de scroll por transición. Hay largos tramos inmóviles seguidos de cambios bruscos.
2. scrub:true sigue directamente el scroll, sin tiempo de recuperación configurable.
3. La copa pasa de x=25% a x=75% en ese tramo corto. El desplazamiento ocupa media pantalla sin justificar una cámara física.
4. La rama se transforma como una lámina rígida. El fondo es una imagen plana que solo cambia en las transiciones; no contiene movimiento natural.
5. El modo enriquecido se activa únicamente con ancho >=1100px y alto >=700px. Móvil y gran parte de tablet reciben contenido estático; el parallaxMaxPx definido no se usa.
6. Los enlaces de capítulos llaman a scrollTo con behavior:'instant'.
7. La activación de capítulos, inert y aria-hidden se calcula con self.progress del trigger, no a partir de la presentación renderizada de la timeline. Al añadir scrub numérico hay que corregir esta sincronización.
8. El modo enhanced se aplica tras importaciones asíncronas y las imágenes no se esperan mediante decode. Hay riesgo de salto inicial o aparición de capas sin preparar; reproducir y corregir.
9. Los assets publicados son WebP. Cambiar su extensión no resolverá estos problemas.

## Método de trabajo

Inspecciona primero AGENTS.md, package.json, implementación actual y handoff. Usa skills de frontend, Impeccable, accesibilidad o GSAP si realmente están disponibles. No inventes nombres de comandos ni instales skills de procedencia desconocida. Las skills no pueden sustituir la revisión visual.

Trabaja sobre una rama o cambios locales revisables. No borres el proyecto ni regeneres assets aprobados. No reutilices el HTML con base64 como web final. Revisa en navegador la versión actual antes de modificarla y registra evidencias. Si no tienes navegador, declara el bloqueo y continúa con lo verificable; no declares QA visual completado.

## Nueva coreografía

Separa tres responsabilidades mediante wrappers anidados:
- Escena: encuadre y profundidad asociados al scroll.
- Sujeto: pose y composición de botella/racimo/copa.
- Ambiente: movimiento orgánico opcional independiente del scroll.

Cada wrapper tiene un único propietario de transform. No dejes que CSS, GSAP y otro motor escriban sobre el mismo transform. Un solo controlador por experiencia, con montaje/desmontaje limpio. Usa transform y opacity; no recalcules layout continuamente.

La cámara y la profundidad evolucionan suavemente durante todo el tramo, incluso mientras se lee. Los textos permanecen quietos el tiempo necesario. No confundas legibilidad con congelar toda la escena.

Punto de partida ajustable tras inspección:
- scrub numérico de 0.6–0.9 segundos en escritorio, empezando por 0.7. No es una promesa de fluidez: medir y ajustar respuesta y retraso.
- Transiciones de composición distribuidas en aproximadamente 45–60% del tramo; evitar la concentración actual del 22%.
- Etiquetas explícitas por escena y duraciones configurables. No repartir todos los capítulos automáticamente de forma idéntica.
- No usar easing repetido que provoque frenadas y aceleraciones en cada capa. Cámara continua con ease:none; entradas editoriales suaves donde tengan sentido.
- Ajustar desplazamiento total de scroll al contenido, sin imponer una experiencia interminable. El lector siempre puede saltar a compra/cata.
- Fondo: desplazamiento total orientativo 1–3% y escala 1.02–1.06; profundidad media 2–4%; primer plano 4–7%, siempre comprobando márgenes de imagen. No son movimientos por frame.
- No agrandar texturas por encima de lo que soporta su resolución ni descubrir sus bordes.

Mantén una sola copa en nariz/boca, preferiblemente en la misma zona visual. Cambia el contenido y realiza un acercamiento sutil; elimina el viaje de media pantalla. La botella no debe parecer una pegatina que sale disparada. El racimo entra a una composición estable, sin convertirse en otro objeto.

No inclines una copa llena como si el líquido fuera sólido. No deformes la etiqueta o inventes órbitas 3D a partir de una foto. No finjas movimiento orgánico haciendo oscilar todo el paisaje o girando la rama entera de forma perceptible.

Define continuidad narrativa:
1. Hero: luz, paisaje, botella, titular y CTAs legibles desde el principio.
2. Origen: cámara revela más paisaje y la botella pierde protagonismo gradualmente.
3. Uva: detalle del racimo con el mismo color y dirección de luz.
4. Nariz/boca: copa estable, contenido claro y cambio de énfasis sutil.
5. Compra: termina el tramo narrativo con naturalidad; selector y CTA en flujo normal.
6. Cata: corte editorial coherente hacia la escena de mesa. No simular un viaje continuo entre geometrías distintas.

## Sincronización, scroll y accesibilidad

Actualiza capítulo activo, controles, inert y aria-hidden según el tiempo/estado realmente renderizado de la timeline, especialmente con scrub numérico. Las zonas clicables deben coincidir con el texto visible. Asegura estado inicial correcto y reproducción inversa al subir.

Navegación por labels de timeline: desplazamiento suave de duración acotada, interrumpible con rueda/touch/teclado, sin competir con scroll CSS u otro motor. Con reduced motion: navegación inmediata. Enfoca el destino cuando esté visible, respetando teclado e historial. Verifica enlaces directos, atrás/adelante y recarga con hash.

Reserva geometría del modo inicial para evitar convertir de golpe una página apilada en una pista sticky tras cargar GSAP. Usa detección coherente CSS/JS y fallback legible ante fallo de importación. Decodifica las capas necesarias para la primera escena antes de revelarlas, sin bloquear la lectura ni esperar todos los recursos de la página. Carga progresivamente los siguientes.

Limpia triggers, timelines, observers y listeners al cambiar breakpoint o desmontar. Evita refresh en bucle y saltos por las barras del navegador móvil. No ocultes errores de layout desactivando globalmente resize.

## Móvil y tablet

Diseño propio desde 320px. No convertir la versión móvil en una sucesión de carteles idénticos. Mantén narrativa, jerarquía y variación de encuadres.

Móvil: flujo nativo, sin un pin que atrape todo el recorrido. Parallax ligero por sección, orientativamente 8–20px, con un movimiento mayor del primer plano que del fondo. Si una capa no aporta profundidad, no animarla por obligación. El texto y formularios no deben moverse mientras se leen o utilizan. Parar animaciones fuera de pantalla.

Tablet: reglas explícitas según ancho Y altura; comprobar 768x1024, 820x1180 y 1024x768. No asumir que tablet equivale a escritorio pequeño. Si el layout no cabe, utilizar flujo normal con movimiento ligero.

Safe areas, altura estable, targets >=44px, inputs >=16px, sin dependencias de hover ni giros obligatorios. Evitar recortes, scroll horizontal y CTAs tapados. Con prefers-reduced-motion: sin pin/parallax/loops automáticos, contenido completo. Añadir control accesible para pausar movimiento ambiental continuo.

## Vídeo ambiental opcional: preparar, no inventar

Primero corrige el movimiento con los recursos existentes. Añade un componente AmbientVideo preparado para incorporar clips reales después. Si no existen, utilizar el poster y documentar el pendiente; no poner un MP4 inexistente ni simular que Higgsfield ya lo generó.

Solo se proponen dos clips inicialmente:
A. Viñedo hero/origen, 6–8 segundos, cámara bloqueada, brisa muy suave en vegetación y luz estable. Derivado del paisaje master, sin botella, letras, logos, gente nueva o árboles que cambien de forma. El parallax de cámara se hace en la web, no duplicándolo dentro del vídeo.
B. Mesa/cata, 6–8 segundos, cámara bloqueada, movimiento ambiental discreto. Mantener escena, mobiliario, luz y personas de referencia. Evitar primeros planos de manos y nuevas acciones complejas.

No generar ni contratar estos vídeos automáticamente con servicios de pago. Entrega los requisitos y solicita los clips solo cuando haga falta integrarlos. La web debe seguir funcionando sin ellos.

Integración:
- Vídeo como ambiente; titular, logo, botella, controles y datos siguen en HTML/capas independientes.
- MP4 H.264 compatible; variantes de resolución adecuadas a cada pantalla. WebM adicional solo si se justifica y prueba.
- poster consistente; muted, playsinline, loop únicamente si la unión está comprobada. Capturar rechazo de play y mostrar poster sin error ni pantalla negra.
- No enlazar currentTime al scroll como solución base: buscar frames continuamente puede introducir tirones. La reproducción ambiental y el parallax son independientes.
- No descargar dos variantes simultáneamente. Cargar bajo demanda, pausar fuera de pantalla/documento oculto, respetar reduced motion y ahorro de datos cuando esté disponible.
- Control visible de pausa. No audio automático.
- Objetivo inicial de compresión: alrededor de 1–2 MB móvil y 2–4 MB escritorio por clip corto, ajustable según calidad medida. Nunca sacrificar legibilidad o añadir bloques de compresión por cumplir una cifra arbitraria.
- No suponer bucle perfecto porque el generador lo diga: revisar la unión; componer una transición si hace falta. No usar ping-pong cuando invierta movimientos físicos evidentes.

## Rendimiento, calidad y aceptación

No prometas 60 FPS ni una puntuación Lighthouse. Mide el build de producción, no solamente el servidor de desarrollo. Haz pnpm build, comprobación de tipos y preview según scripts del proyecto.

Verifica:
- 320x740, 390x844, 430x932, teléfonos horizontal, tablets indicadas, 1366x768 y 1440x900.
- Rueda lenta/rápida, trackpad, scroll táctil, PageDown, inversión de dirección y navegación a capítulos.
- Ningún texto legible queda inert mientras debería ser interactivo; nada invisible recibe foco.
- Sin salto inicial, flashes de capítulos, imágenes tardías, huecos al salir del sticky o duplicación de triggers.
- Sin errores de consola, assets 404, scroll horizontal o fuentes/imágenes que cambien dimensiones inesperadamente.
- Reduced motion, JS desactivado, vídeo bloqueado, conexión lenta, pestaña oculta/reabierta, cambio de orientación y zoom 200%.
- Compra, cantidades, validaciones, modales y cata mantienen su comportamiento demo y estados claros.
- Performance panel para investigar tareas largas, frames y trabajo de layout. Registrar resultados, dispositivo y condiciones. Objetivos orientativos: LCP <=2.5s, CLS <=0.1, INP <=200ms donde pueda medirse; laboratorio no equivale a datos de usuarios reales.
- Chromium/WebKit emulado y dispositivos físicos se registran por separado. iPhone Safari y Android Chrome físicos quedan pendientes si no están disponibles.

Entrega implementación completa, archivos modificados, comparación antes/después, grabación breve del scroll si el entorno lo permite, pruebas realmente realizadas y pendientes. No cierres el trabajo con “debería funcionar” ni inventes validación. No toques datos, precios o identidad por resolver la animación.

## Referencias técnicas
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
