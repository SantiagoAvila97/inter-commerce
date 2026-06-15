# ADR 001: Stack — Vite + React SPA

## Contexto

La prueba técnica exige una SPA consumiendo DummyJSON. Se evaluó CRA (deprecated), Next.js (SSR no requerido) y Vite.

## Decisión

**Vite + React 18 + TypeScript strict** como base del proyecto.

## Justificación

- Arranque y HMR rápidos en desarrollo.
- TypeScript strict habilitado desde el inicio.
- SPA suficiente para catálogo, detalle y carrito sin complejidad SSR.
- Despliegue trivial en Vercel/Netlify.

## Consecuencias

- La hidratación SSR queda documentada como evolución futura (ver README).
- El routing es client-side con React Router v6.
