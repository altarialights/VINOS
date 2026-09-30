# Ladera

Web editorial y comercial de demostración, en español. El visitante descubre el paisaje, la uva y los matices del vino y puede saltar directamente a compra o cata.

La fuente de verdad es el paquete suministrado: `ladera-handoff/spec/content.json`, `motion.json`, `tokens.css` y `assets.json`. Ladera, Garnacha 2023 y su perfil son ilustrativos. Los paisajes generados no acreditan una localización real. No existen precios, stock, horarios ni puntos de venta verificados.

Contrato del usuario: conservar assets y dirección de arte; construir Astro, TypeScript estricto, Tailwind y pnpm; sin SPA, Supabase, credenciales, despliegue o backend en esta fase. Turso se conectará posteriormente mediante un adaptador de servidor.

La compra nunca confirma un pedido en demo. La cata consulta un adaptador sin enviar reservas, correo ni WhatsApp. No se guardan datos personales. Los enlaces y contenido esencial funcionan sin JavaScript. Móvil y movimiento reducido usan flujo normal; escritorio dispone de cinco estados en un tramo acotado con scroll nativo.

Actualización V2 autorizada: `ladera-video-handoff/INTEGRAR_EN_CODEX.md` y `PROMPT_CODEX_LADERA_V2.md` sustituyen el movimiento anterior. La configuración actual es `src/config/motion-v2.ts`. Se integran únicamente los clips/pósteres finales de `media/`; producto, identidad y copy permanecen intactos. Dos ambientes progresivos con control accesible de pausa, copa estable, cámara continua, navegación suave y parallax móvil discreto. Ver `docs/MOTION_V2.md`.

Refinamiento V2.2 autorizado expresamente por el usuario: controles redondeados de acabado sobrio inspirado en Apple y nuevos assets generados para profundidad en tres planos. Sustituye la antigua restricción de esquinas cuadradas. La vegetación nueva es un primer plano decorativo; los assets originales del producto y la dirección de luz permanecen intactos. Ver `docs/DEPTH_ASSETS.md`.
