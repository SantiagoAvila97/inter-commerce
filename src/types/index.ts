export type {
  Product,
  ProductDimensions,
  ProductReview,
  ProductMeta,
  ProductsResponse,
  ProductCategory,
  ProductCategoriesResponse,
} from './product';
export type { CartItem, CartState, CartTotals, CartItemInput } from './cart';
export { EMPTY_CART, DEFAULT_TAX_RATE } from './cart';
export type { CatalogFilters, CatalogSearchParams, ProductsQueryParams } from './catalog';
export {
  DEFAULT_CATALOG_FILTERS,
  CATALOG_PAGE_SIZE,
} from './catalog';
export {
  ApiError,
  NotFoundError,
  ServerError,
  NetworkError,
  getErrorMessage,
  isNotFoundError,
} from './errors';
export type { HttpStatus, ApiErrorBody } from './errors';
