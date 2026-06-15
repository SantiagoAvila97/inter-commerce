import { useCallback, useRef, useState } from 'react';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ZOOM_SCALE = 2.25;

export function ProductImageZoom({ src, alt, className = '' }: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const updateOrigin = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      updateOrigin(event.clientX, event.clientY);
    },
    [updateOrigin],
  );

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setIsZooming(true);
      updateOrigin(event.clientX, event.clientY);
    },
    [updateOrigin],
  );

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`product-image-zoom${isZooming ? ' product-image-zoom--active' : ''}${className ? ` ${className}` : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="product-image-zoom__image"
        style={
          isZooming
            ? {
                transform: `scale(${ZOOM_SCALE})`,
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }
            : undefined
        }
        draggable={false}
      />
    </div>
  );
}
