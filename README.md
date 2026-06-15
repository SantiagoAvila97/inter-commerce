# InterCommerce

SPA de e-commerce construida como prueba técnica. Consume [DummyJSON](https://dummyjson.com/docs/products) y cubre catálogo con filtros en URL, detalle de producto y carrito persistente.

## Uso de IA en el desarrollo

Desarrollé esta prueba con apoyo de herramientas de IA (Cursor) para acelerar scaffolding, UI y revisión de código. Todas las decisiones de arquitectura, la validación funcional, los tests y los ajustes finales fueron revisados y ejecutados por mí.

## Arquitectura

```
src/
├── business/     # Lógica de negocio pura (totales, mutaciones del carrito)
├── components/   # UI pura y composición
├── hooks/        # Custom hooks, providers y orquestación
├── pages/        # Vistas por ruta
├── providers/    # QueryClient y providers globales
├── services/     # Cliente HTTP y servicios de API
├── types/        # Contratos TypeScript del dominio
└── utils/        # Helpers (URL, formato, storage)
```

### Decisiones clave

| Tema | Elección | Motivo |
|------|----------|--------|
| Stack | Vite + React + TS strict | SPA rápida sin complejidad SSR |
| Server state | TanStack Query v5 | Caché, reintentos e infinite scroll |
| Carrito UI | Drawer + ruta `/cart` | UX mobile-first sin perder contexto |
| Filtros | URLSearchParams (`q`, `category`, `page`) | Persistencia al compartir/recargar |

ADRs detallados en [`docs/decisions/`](docs/decisions/).

## Librerías

- **React Router v7** — routing client-side con rutas dinámicas
- **TanStack Query** — fetching, caché (`staleTime` 60s catálogo / 300s detalle), `useInfiniteQuery`
- **Vitest + RTL** — tests unitarios e integración
- **MSW** — disponible para mocks de red en tests extendidos

## Instalación

```bash
git clone <repo-url>
cd inter-commerce
cp .env.example .env
npm install
npm run dev
```

La app corre en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | ESLint |
| `npm run test` | Tests (Vitest) |
| `npm run test:coverage` | Tests con cobertura |

## Endpoints consumidos

- `GET /products?limit&skip` — listado paginado
- `GET /products/search?q&limit&skip` — búsqueda
- `GET /products/category/{slug}?limit&skip` — filtro por categoría
- `GET /products/{id}` — detalle
- `GET /products/categories` — categorías

## Preguntas de profundidad técnica

### 1. Hydration / caché con Next.js (SSR)

Prefetch en servidor con `queryClient.prefetchQuery`, serializar con `dehydrate(queryClient)` y en cliente usar `HydrationBoundary` + `hydrate(queryClient)`. Las query keys deben coincidir entre server y client. El carrito en LocalStorage se hidrata solo en cliente (`useEffect`) para evitar mismatch.

### 2. Sanitización XSS en descripciones HTML

Nunca renderizar HTML crudo sin sanitizar. Usar **DOMPurify** antes de `dangerouslySetInnerHTML`, o renderizar texto plano escapado (enfoque actual). CSP estricta como capa adicional.

### 3. Carrito multi-tienda

Refactorizar el store a `Record<StoreId, CartState>` con selectores `useCart(storeId)`. Persistencia keyed: `inter-commerce:cart:{storeId}`. Acciones reciben `storeId` explícito; totales se calculan por tienda.

## Deploy

Compatible con Vercel, Netlify o AWS Amplify:

```bash
npm run build
```

Publicar el directorio `dist/`. Configurar fallback SPA (`/* → /index.html`).
