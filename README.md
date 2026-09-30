# Ladera

Implementación local V2.2 del paquete de producción y `ladera-video-handoff`. Astro 6, TypeScript estricto, Tailwind 4 mediante su plugin de Vite y GSAP/ScrollTrigger con importación dinámica. No utiliza React ni hidrata la página como SPA. Continuidad editorial: `docs/CONTINUITY_V2_1.md`. Controles redondeados, tres planos y assets generados: `docs/DEPTH_V2_2.md` y `docs/DEPTH_ASSETS.md`.

## Ejecutar

Requisitos: Node.js >=22.12 y pnpm 10.

```sh
pnpm install
pnpm dev
```

Desarrollo: `http://localhost:4321/`.

```sh
pnpm check
pnpm test
pnpm verify:assets
pnpm build
pnpm preview --port 4322
```

Producción local: `http://localhost:4322/`. `dist/` contiene la web estática. No se ha publicado.

## Estructura

- `ladera-handoff/`: extracción íntegra e inalterada; referencia en `preview/`.
- `public/assets/`: copias externas cacheables de los masters, variantes, logo y fuentes originales.
- `public/media/ladera/`: los seis clips y pósteres definitivos verificados; no contiene `masters/`.
- `src/components/`: Header, SceneStage, NarrativeChapter, WineProfile, PurchasePanel, TastingForm y componentes auxiliares.
- `src/lib/content.ts`: contenido del paquete y mensajes de interfaz.
- `src/lib/commerce.ts`: contratos y adaptador demo sin backend.
- `src/config/motion-v2.ts`: contrato tipado vigente de tiempos, cámara y parallax; sustituye el movimiento V1.
- `src/scripts/motion.ts`: timeline con scrub numérico, limpieza y navegación suave por labels.
- `src/scripts/ambient.ts`: carga progresiva, frame decodificado, pausa y fallback de los dos ambientes.
- `src/scripts/controls.ts`: diálogos nativos, foco y flujos de compra/cata.
- `docs/VALIDATION_V2.md`: resultados reales y limitaciones de esta integración. `VALIDATION.md` conserva el informe V1.
- `docs/MOTION_V2.md`: comparación antes/después y autoridad del nuevo contrato.
- `docs/BACKEND.md`: conexión futura de catálogo, pago y Turso.
- `.impeccable/review/`: capturas de QA.

El contenido editorial se modifica en `ladera-handoff/spec/content.json` solo al aprobar una nueva versión del paquete; el verificador detectará cualquier cambio frente al original. Para una evolución independiente, crear una nueva fuente versionada y cambiar el import de `src/lib/content.ts`. Los parámetros de animación siguen `src/config/motion-v2.ts`; `ladera-handoff/spec/motion.json` se conserva como histórico. El móvil y tablets hasta 1099 px se apilan con parallax ligero. Las pantallas de poca altura evitan el pin; movimiento reducido elimina pin, parallax y reproducción automática.

Compra y cata funcionan como demostraciones explícitas: no crean pedidos ni reservas, no envían mensajes, no almacenan datos personales. El checkout real está bloqueado hasta configurar el adaptador y su lista de dominios autorizados.

## Compatibilidad consultada

- [Instalación de Astro 6](https://v6.docs.astro.build/en/install-and-setup/): Node >=22.12.
- [Tailwind para Astro](https://tailwindcss.com/docs/installation/framework-guides/astro): integración `@tailwindcss/vite` para Tailwind 4.
- [CSS en Astro](https://docs.astro.build/en/guides/styling/): se evita mezclar la integración antigua de Tailwind 3 con Tailwind 4.

Las versiones resueltas están fijadas en `pnpm-lock.yaml`. La licencia de las fuentes está en `public/assets/FONT-LICENSE.txt`.
