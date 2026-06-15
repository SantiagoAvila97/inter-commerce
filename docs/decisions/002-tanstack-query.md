# ADR 002: TanStack Query vs SWR

## Contexto

Los requisitos de la prueba técnica exigen gestión de caché del servidor con TanStack Query o SWR.

## Decisión

**TanStack Query v5** para fetching, caché e infinite scroll.

## Justificación

- `useInfiniteQuery` nativo para scroll infinito del catálogo.
- Query keys declarativas ligadas a filtros de URL.
- Configuración explícita de `retry`, `staleTime` y `gcTime`.
- Devtools disponibles para depuración.

## Configuración elegida

- `staleTime`: 60_000 ms (catálogo), 300_000 ms (detalle).
- `retry`: 2 reintentos en errores transitorios.
- `refetchOnWindowFocus`: false (evita parpadeos en filtros activos).
