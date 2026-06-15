# Flujo de datos: DummyJSON → TanStack Query → UI

Diagrama basado en la estructura real de `src/` en InterCommerce.

```mermaid
flowchart TB
  subgraph API["DummyJSON API"]
    EP1["GET /products?limit&skip"]
    EP2["GET /products/search?q&limit&skip"]
    EP3["GET /products/category/{slug}?limit&skip"]
    EP4["GET /products/{id}"]
    EP5["GET /products/categories"]
  end

  subgraph Services["services/"]
    HC["httpClient.ts<br/>apiRequest()"]
    PS["productService.ts<br/>getProducts · getProductById · getCategories"]
    HC --> PS
  end

  subgraph Providers["providers/"]
    QP["AppProviders.tsx<br/>QueryClientProvider<br/>retry: 2 · staleTime: 60s"]
  end

  subgraph Hooks["hooks/"]
    UCF["useCatalogFilters.ts<br/>URLSearchParams: q, category, page"]
    UP["useProducts.ts<br/>useInfiniteProducts · useProduct · useCategories"]
    QK["productQueryKeys<br/>['products', 'infinite', filters]"]
    UCF --> UP
    QK --> UP
  end

  subgraph Pages["pages/"]
    CP["CatalogPage.tsx"]
    PDP["ProductDetailPage.tsx"]
  end

  subgraph Components["components/"]
    SK["Skeleton / ErrorState / EmptyState"]
    GR["ProductGrid → ProductCard → ProductCardMedia"]
    PG["ProductGallery · ProductSpecs · ProductReviews"]
  end

  subgraph User["Usuario / Navegador"]
    URL["URL /?q=&category=&page="]
    RT["Ruta /product/:id"]
    ACT["Buscar · Filtrar · Cargar más"]
  end

  %% --- Catálogo ---
  ACT --> UCF
  URL --> UCF
  UCF -->|"filters { q, category }"| CP
  CP -->|"useInfiniteProducts(filters)"| UP
  CP -->|"useCategories()"| UP

  UP -->|"queryKey + queryFn"| QP
  QP -->|"cache hit → data"| CP
  QP -->|"cache miss / stale"| PS

  PS -->|"listado general"| EP1
  PS -->|"si hay q"| EP2
  PS -->|"si hay category"| EP3
  PS -->|"categorías del filtro"| EP5

  EP1 & EP2 & EP3 & EP5 -->|"JSON ProductsResponse"| HC
  HC -->|"Product[] tipado"| PS
  PS -->|"pages[] acumuladas"| UP
  UP -->|"isLoading / isError / data"| CP

  CP -->|"products = flatMap(pages)"| GR
  CP -->|"isLoading"| SK
  CP -->|"isError → refetch()"| SK
  CP -->|"fetchNextPage()"| UP

  %% --- Detalle ---
  RT --> PDP
  PDP -->|"useProduct(id)"| UP
  UP --> PS
  PS -->|"getProductById(id)"| EP4
  EP4 -->|"JSON Product"| HC
  UP -->|"data: Product"| PDP
  PDP --> PG
  PDP -->|"isLoading / NotFoundError"| SK

  %% --- Errores ---
  HC -.->|"404 NotFoundError<br/>5xx ServerError<br/>timeout NetworkError"| UP
  UP -.->|"isError + error"| SK

  classDef api fill:#fff1e8,stroke:#ff6600,color:#0a1218
  classDef service fill:#eff6ff,stroke:#3b82f6,color:#0a1218
  classDef query fill:#f0fdf4,stroke:#16a34a,color:#0a1218
  classDef ui fill:#faf5ff,stroke:#9333ea,color:#0a1218
  class EP1,EP2,EP3,EP4,EP5 api
  class HC,PS service
  class QP,UP,QK,UCF query
  class CP,PDP,GR,PG,SK ui
```

## Lectura rápida del flujo

### Catálogo (`/`)

1. **URL / filtros** — `useCatalogFilters` lee y escribe `q`, `category` y `page` en la URL.
2. **Hook** — `CatalogPage` llama `useInfiniteProducts({ q, category })` y `useCategories()`.
3. **TanStack Query** — Resuelve por `productQueryKeys`; si no hay caché válida, ejecuta `queryFn`.
4. **Service** — `productService.getProducts()` elige endpoint según filtros y delega en `apiRequest`.
5. **HTTP** — `httpClient` hace `fetch` a DummyJSON, parsea JSON y tipa la respuesta.
6. **UI** — Query devuelve `data.pages`; la página aplana a `products[]` y renderiza `ProductGrid` / `ProductCard`. Estados: skeleton, error o vacío.

### Detalle (`/product/:id`)

1. **Ruta** — `ProductDetailPage` obtiene `id` de la URL.
2. **Hook** — `useProduct(id)` con `staleTime` 300 s y sin reintentos en 404.
3. **Service** — `getProductById` → `GET /products/{id}`.
4. **UI** — `ProductGallery`, specs y reseñas; `ErrorState` o 404 si falla.

### Nota: carrito (client state)

El carrito **no pasa por TanStack Query**. Tras agregar desde catálogo/detalle, los datos del producto ya están en memoria y `useCart` + `cartBusiness` manejan el estado local (LocalStorage).
