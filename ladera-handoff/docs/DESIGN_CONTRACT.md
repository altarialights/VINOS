# Contrato visual y de continuidad

## Autoridad, por orden
1. Corrección explícita posterior del usuario.
2. spec/content.json, spec/motion.json y spec/tokens.css.
3. Assets de esta versión, con sus huellas.
4. preview/index.html y las comprobaciones de QA.
5. Referencias anteriores del chat, solo como inspiración.

## Invariantes
Titular literal: UN LUJO EN NAVALUENGA. Marca provisional: LADERA. Una sola botella, racimo, copa y rama. No cambiar el fondo entre origen, uva y matices. No espejar assets: invertiría texto e iluminación. Reutilizar el SVG del wordmark, nunca escribir un logo nuevo con otra tipografía.

La etiqueta fotografiada pertenece al producto maestro. No recolocarla, animarla separada ni redibujarla en cada sección. Cuando llegue una marca real, sustituir el packshot completo y el logo de interfaz como una nueva versión aprobada.

## Escenario
Fuente de luz cálida desde arriba/derecha. Verde bosque profundo, granito y marfil. Mismos árboles y líneas de horizonte porque se utiliza el mismo fichero. El plano de cata es un corte editorial a otro encuadre, no una continuación geométricamente exacta del paisaje. No prometer un travelling 3D usando imágenes planas.

Planos por z-index: paisaje 0; oscurecimiento legible 1; botella/racimo/copa 2; rama 3; velo de lectura local 4; contenido HTML 5; navegación 20. Los elementos decorativos llevan pointer-events:none. El halo fotográfico de los recortes está evaluado sobre el fondo oscuro; no usar estos assets sobre blanco sin nueva revisión.

## Composición
Desktop: márgenes clamp(20px,5vw,80px), cabecera 76px; contenido a izquierda en portada/origen/boca y a derecha en uva/nariz. Titulares bold sin tracking positivo: -0.055em, line-height .98. Cuerpo serif con ancho máximo 34 caracteres aprox. Controles sans, mínimo 16px de texto y 48px de alto.

Móvil: cabecera compacta, título arriba, pieza visual central, copy y acciones debajo. No usar un fondo con todo el contenido rasterizado. No fijar la altura total del hero a 100vh si eso corta botones: el hero puede superar el primer viewport. Menos capas visibles; ninguna traducción horizontal del texto.

Tablet vertical: proteger el espacio del texto; si no cabe la composición horizontal, usar el apilado. El tamaño de pantalla por sí solo no garantiza potencia de GPU.

## Movimiento
Usar motion.json como origen de parámetros. Los cinco estados comparten la misma escena; existen mesetas para leer. Scroll nativo. El tramo pegajoso se limita a la narrativa de escritorio. Compra y reserva siempre en flujo normal. No interceptar rueda/touchmove. No scroll-jacking, no cursor especial, no movimiento por giroscopio.

En móvil, animación muy leve por scroll dentro de bloques normales. Reducir movimiento elimina pin, desplazamientos y escalados; muestra todos los textos. No utilizar un requestAnimationFrame eterno cuando no hay cambios. Detener trabajo con pestaña oculta y cancelar listeners/observers al desmontar.

No filtros de blur animados de pantalla completa, sombras grandes animadas, vídeo obligatorio o centenas de frames. Transform y opacity para las transiciones base. No utilizar will-change en toda la página: activarlo solo para elementos concretos cuando haga falta y medir memoria.

## Límites de fidelidad
Los assets nuevos fueron generados para este kit y ya están congelados. Pueden diferir sutilmente del boceto original, pero a partir de aquí no cambian durante el movimiento. La copa es un recorte fotográfico, no una simulación óptica. No inclinarla mucho: el vino está integrado en la foto. No escalar fotos por encima de una resolución visual aceptable; evitar transformaciones que expongan bordes sin fondo.

## Identidad y contenidos
Fuentes incluidas: DejaVu Sans regular/bold y DejaVu Serif regular, con licencia adjunta. No sustituir por fuentes del sistema al entregar. SVG del logo convertido a trazados. Las notas de nariz/boca se leen como descriptores, nunca como ingredientes añadidos.

No inventar precio, descuentos, testimonios, altitud, denominación de origen, analíticas, producción, stock, mapa ni horarios. Ningún copy sobre capacidades internas debe aparecer en el recorrido de un cliente real. Los avisos de demo se muestran solo en demo y al simular acciones.
