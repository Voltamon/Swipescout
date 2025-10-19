import { debounce, throttle } from 'lodash';

/**
 * Debounce function for search inputs and API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const createDebouncedFunction = (func, delay = 300) => {
  return debounce(func, delay);
};

/**
 * Throttle function for scroll events and frequent updates
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const createThrottledFunction = (func, delay = 100) => {
  return throttle(func, delay);
};

/**
 * Preload images for better user experience
 * @param {Array} imageUrls - Array of image URLs to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
};

/**
 * Preload videos for better user experience
 * @param {Array} videoUrls - Array of video URLs to preload
 * @returns {Promise} Promise that resolves when all videos are loaded
 */
export const preloadVideos = (videoUrls) => {
  return Promise.all(
    videoUrls.map(url => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.onloadeddata = () => resolve(url);
        video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
        video.preload = 'metadata';
        video.src = url;
      });
    })
  );
};

/**
 * Optimize images by resizing and compressing
 * @param {File} file - Image file to optimize
 * @param {Object} options - Optimization options
 * @returns {Promise<Blob>} Optimized image blob
 */
export const optimizeImage = (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, format, quality);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create a memoized function to cache expensive computations
 * @param {Function} fn - Function to memoize
 * @param {Function} keyGenerator - Function to generate cache key
 * @returns {Function} Memoized function
 */
export const memoize = (fn, keyGenerator = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = keyGenerator(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

/**
 * Batch API requests to reduce server load
 * @param {Function} apiFunction - API function to batch
 * @param {number} batchSize - Maximum batch size
 * @param {number} delay - Delay between batches
 * @returns {Function} Batched API function
 */
export const createBatchedApiCall = (apiFunction, batchSize = 10, delay = 100) => {
  let queue = [];
  let timeoutId = null;

  const processBatch = async () => {
    if (queue.length === 0) return;

    const batch = queue.splice(0, batchSize);
    const requests = batch.map(item => item.request);
    
    try {
      const results = await apiFunction(requests);
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => {
        item.reject(error);
      });
    }

    if (queue.length > 0) {
      timeoutId = setTimeout(processBatch, delay);
    }
  };

  return (request) => {
    return new Promise((resolve, reject) => {
      queue.push({ request, resolve, reject });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(processBatch, delay);
    });
  };
};

/**
 * Implement request deduplication to prevent duplicate API calls
 * @param {Function} apiFunction - API function to deduplicate
 * @param {Function} keyGenerator - Function to generate request key
 * @returns {Function} Deduplicated API function
 */
export const createDeduplicatedApiCall = (apiFunction, keyGenerator = (params) => JSON.stringify(params)) => {
  const pendingRequests = new Map();

  return async (params) => {
    const key = keyGenerator(params);

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    const promise = apiFunction(params).finally(() => {
      pendingRequests.delete(key);
    });

    pendingRequests.set(key, promise);
    return promise;
  };
};

/**
 * Create a cache with TTL (Time To Live)
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Object} Cache object with get, set, and clear methods
 */
export const createTTLCache = (ttl = 5 * 60 * 1000) => { // 5 minutes default
  const cache = new Map();

  const isExpired = (timestamp) => {
    return Date.now() - timestamp > ttl;
  };

  return {
    get: (key) => {
      const item = cache.get(key);
      if (!item) return null;

      if (isExpired(item.timestamp)) {
        cache.delete(key);
        return null;
      }

      return item.value;
    },

    set: (key, value) => {
      cache.set(key, {
        value,
        timestamp: Date.now(),
      });
    },

    clear: () => {
      cache.clear();
    },

    size: () => cache.size,
  };
};

/**
 * Optimize bundle size by dynamically importing modules
 * @param {Function} importFunction - Dynamic import function
 * @returns {Promise} Promise that resolves to the imported module
 */
export const lazyImport = (importFunction) => {
  return importFunction();
};

/**
 * Service Worker registration for caching
 * @param {string} swPath - Path to service worker file
 * @returns {Promise} Promise that resolves when SW is registered
 */
export const registerServiceWorker = async (swPath = '/sw.js') => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    throw new Error('Service Worker not supported');
  }
};

/**
 * Measure and log performance metrics
 * @param {string} name - Performance mark name
 * @param {Function} fn - Function to measure
 * @returns {any} Function result
 */
export const measurePerformance = async (name, fn) => {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-duration`;

  performance.mark(startMark);
  
  try {
    const result = await fn();
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const measure = performance.getEntriesByName(measureName)[0];
    console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
    
    return result;
  } catch (error) {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    throw error;
  }
};

