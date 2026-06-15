import { useCallback, useState } from 'react';
import type { ProductCardMediaProps } from '@/types/components';
import { getProductImages } from '@/utils';

export function ProductCardMedia({ images, thumbnail, title }: ProductCardMediaProps) {
  const galleryImages = getProductImages({ images, thumbnail });
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = galleryImages.length > 1;
  const currentImage = galleryImages[activeIndex] ?? galleryImages[0];

  const stopNavigation = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const showPrevious = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      stopNavigation(event);
      setActiveIndex((index) => (index === 0 ? galleryImages.length - 1 : index - 1));
    },
    [galleryImages.length, stopNavigation],
  );

  const showNext = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      stopNavigation(event);
      setActiveIndex((index) => (index === galleryImages.length - 1 ? 0 : index + 1));
    },
    [galleryImages.length, stopNavigation],
  );

  const goToImage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
      stopNavigation(event);
      setActiveIndex(index);
    },
    [stopNavigation],
  );

  if (!currentImage) {
    return <div className="product-card__image-wrap" />;
  }

  const imageFrame = (
    <div className="product-card__image-frame">
      <img
        src={currentImage}
        alt={
          hasMultipleImages
            ? `${title} — imagen ${activeIndex + 1} de ${galleryImages.length}`
            : title
        }
        className="product-card__image"
        loading="lazy"
      />
    </div>
  );

  if (!hasMultipleImages) {
    return <div className="product-card__image-wrap">{imageFrame}</div>;
  }

  return (
    <div className="product-card__image-wrap product-card__slider">
      {imageFrame}
      <div className="product-card__slider-controls">
        <button
          type="button"
          className="product-card__slider-btn product-card__slider-btn--prev"
          aria-label="Imagen anterior"
          onClick={showPrevious}
        >
          ‹
        </button>
        <button
          type="button"
          className="product-card__slider-btn product-card__slider-btn--next"
          aria-label="Siguiente imagen"
          onClick={showNext}
        >
          ›
        </button>
      </div>
      <div className="product-card__slider-dots" role="tablist" aria-label={`Imágenes de ${title}`}>
        {galleryImages.map((image, index) => (
          <button
            key={image}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Ver imagen ${index + 1}`}
            className={`product-card__slider-dot${index === activeIndex ? ' product-card__slider-dot--active' : ''}`}
            onClick={(event) => goToImage(event, index)}
          />
        ))}
        <span className="product-card__slider-count" aria-hidden="true">
          {activeIndex + 1}/{galleryImages.length}
        </span>
      </div>
    </div>
  );
}
