import type { ProductDimensions, ProductReview } from './product';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  id?: string;
}

export interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  images: string[];
  category: string;
  minimumOrderQuantity: number;
  onAddToCart: (id: number) => void;
}

export interface ProductCardMediaProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface QuantitySelectorProps {
  id: string;
  value: number;
  min?: number;
  max: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ProductGalleryProps {
  images: string[];
  title: string;
}

export interface ProductReviewsProps {
  reviews: ProductReview[];
  averageRating: number;
}

export interface ProductSpecsProps {
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  availabilityStatus: string;
  stock: number;
  tags: string[];
  barcode: string;
}
