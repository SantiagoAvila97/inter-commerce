import type { ProductReviewsProps } from '@/types/components';
import { formatProductDate, renderStarRating } from '@/utils';

export function ProductReviews({ reviews, averageRating }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <section className="product-reviews surface-panel">
        <header className="product-reviews__header">
          <h2 className="product-reviews__title">Reseñas</h2>
        </header>
        <p className="product-reviews__empty">Este producto aún no tiene reseñas.</p>
      </section>
    );
  }

  return (
    <section className="product-reviews surface-panel">
      <header className="product-reviews__header">
        <h2 className="product-reviews__title">Reseñas</h2>
        <p className="product-reviews__summary">
          <span className="product-reviews__stars" aria-hidden="true">
            {renderStarRating(averageRating)}
          </span>
          <span className="product-reviews__average">{averageRating.toFixed(1)}</span>
          <span className="product-reviews__count">
            ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
          </span>
        </p>
      </header>
      <ul className="product-reviews__list">
        {reviews.map((review) => (
          <li key={`${review.reviewerEmail}-${review.date}`} className="product-review">
            <div className="product-review__header">
              <p className="product-review__author">{review.reviewerName}</p>
              <p className="product-review__meta">
                <span className="product-review__stars" aria-label={`${review.rating} de 5 estrellas`}>
                  {renderStarRating(review.rating)}
                </span>
                <time className="product-review__date" dateTime={review.date}>
                  {formatProductDate(review.date)}
                </time>
              </p>
            </div>
            <p className="product-review__comment">{review.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
