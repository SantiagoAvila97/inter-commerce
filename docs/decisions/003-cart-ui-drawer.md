# ADR 003: Carrito — Drawer lateral

## Contexto

Los requisitos de la prueba técnica permiten drawer o página dedicada para el carrito.

## Decisión

**Drawer lateral** accesible desde el header en todas las rutas, más ruta `/cart` como vista dedicada.

## Justificación

- El usuario no pierde contexto del catálogo al revisar el carrito.
- La ruta `/cart` permite compartir/enlazar el resumen completo.
- Patrón habitual en e-commerce mobile-first.

## Trade-offs

- Requiere gestión de focus trap y cierre con Escape (accesibilidad).
- Una página dedicada duplica UI si no se compone bien; se resuelve con `CartSummary` compartido.
