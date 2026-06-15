import type { Product } from '@/types';

export function getProductImages(product: Pick<Product, 'images' | 'thumbnail'>): string[] {
  if (product.images.length > 0) {
    return product.images;
  }

  if (product.thumbnail) {
    return [product.thumbnail];
  }

  return [];
}

export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  if (discountPercentage <= 0) {
    return price;
  }

  return price * (1 - discountPercentage / 100);
}

export function formatProductDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDimensions(dimensions: Product['dimensions']): string {
  return `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} cm`;
}

export function renderStarRating(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(clamped) + '☆'.repeat(5 - clamped);
}
