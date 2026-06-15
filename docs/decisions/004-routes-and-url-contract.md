# ADR 004: Rutas y contrato de URL

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Catálogo de productos |
| `/product/:id` | Detalle de producto |
| `/cart` | Carrito (página dedicada) |

## Contrato URLSearchParams (catálogo)

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `q` | string | `""` | Búsqueda por texto |
| `category` | string | `""` | Slug de categoría DummyJSON |
| `page` | number | `1` | Página actual (derivada a `skip = (page-1) * limit`) |

## Ejemplos

- `/` — catálogo sin filtros
- `/?q=phone&category=smartphones&page=2` — búsqueda + categoría + paginación
- `/product/1` — detalle del producto 1

## Comportamiento

- Cambiar `q` o `category` resetea `page` a 1.
- Navegación atrás/adelante del browser restaura filtros.
- Compartir URL reproduce el mismo estado del catálogo.
