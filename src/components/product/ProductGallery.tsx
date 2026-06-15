import { useEffect, useState } from 'react';
import { ProductImageZoom } from '@/components/product/ProductImageZoom';
import type { ProductGalleryProps } from '@/types/components';

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  if (!selectedImage) {
    return null;
  }

  if (images.length <= 1) {
    return (
      <div className="product-gallery product-gallery--single">
        <div className="product-gallery__main product-gallery__main--solo">
          <ProductImageZoom src={selectedImage} alt={title} />
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__thumbs" role="tablist" aria-label="Imágenes del producto">
        {images.map((image, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
              className={`product-gallery__thumb${isSelected ? ' product-gallery__thumb--active' : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <img src={image} alt="" loading="lazy" />
            </button>
          );
        })}
      </div>
      <div className="product-gallery__main">
        <ProductImageZoom src={selectedImage} alt={title} />
      </div>
    </div>
  );
}
