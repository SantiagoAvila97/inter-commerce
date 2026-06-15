import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  rootMargin?: string;
  /** Reinicia el control anti-cadena cuando cambian filtros */
  resetKey?: string;
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = '0px 0px 120px 0px',
  resetKey = '',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lastFetchScrollRef = useRef(-1);
  const hasUserScrolledRef = useRef(false);

  useEffect(() => {
    lastFetchScrollRef.current = -1;
    hasUserScrolledRef.current = false;
  }, [resetKey]);

  useEffect(() => {
    const markScrolled = () => {
      hasUserScrolledRef.current = true;
    };
    window.addEventListener('scroll', markScrolled, { passive: true });
    return () => window.removeEventListener('scroll', markScrolled);
  }, []);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || !hasNextPage || isFetchingNextPage) {
        return;
      }

      const scrollTop = window.scrollY;

      if (
        lastFetchScrollRef.current >= 0 &&
        scrollTop <= lastFetchScrollRef.current + 80
      ) {
        return;
      }

      if (!hasUserScrolledRef.current && lastFetchScrollRef.current >= 0) {
        return;
      }

      lastFetchScrollRef.current = scrollTop;
      fetchNextPage();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold: 0,
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [handleIntersect, rootMargin, hasNextPage]);

  return sentinelRef;
}
