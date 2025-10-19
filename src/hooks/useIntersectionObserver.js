import { useEffect, useRef, useState , useContext } from 'react';

/**
 * Custom hook for intersection observer
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Threshold for intersection (0-1)
 * @param {string} options.rootMargin - Root margin for intersection
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @returns {Array} [ref, isIntersecting, entry]
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isIntersecting, entry];
};

/**
 * Hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, imageSrc, isLoaded]
 */
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver(options);

  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsLoaded(false);
      };
      img.src = src;
    }
  }, [isIntersecting, src, imageSrc]);

  return [ref, imageSrc, isLoaded];
};

/**
 * Hook for lazy loading videos
 * @param {string} src - Video source URL
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, shouldLoad, isVisible]
 */
export const useLazyVideo = (src, options = {}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.5, // Load when 50% visible
    ...options,
  });

  useEffect(() => {
    if (isIntersecting && src && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, src, shouldLoad]);

  return [ref, shouldLoad, isIntersecting];
};

/**
 * Hook for infinite scrolling
 * @param {Function} loadMore - Function to load more items
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} loading - Whether currently loading
 * @returns {Array} [ref, isLoading]
 */
export const useInfiniteScroll = (loadMore, hasMore, loading) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading && !isLoading) {
      setIsLoading(true);
      loadMore().finally(() => {
        setIsLoading(false);
      });
    }
  }, [isIntersecting, hasMore, loading, isLoading, loadMore]);

  return [ref, isLoading];
};

