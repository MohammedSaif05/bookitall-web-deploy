/**
 * Simple in-memory cache utility
 * Stores API responses with timestamps
 */

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

/**
 * Set cached data
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Clear cached data
 * @param {string} key - Cache key (optional, clears all if not provided)
 */
export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.clear();
};

/**
 * Cache keys
 */
export const CACHE_KEYS = {
  VERIFIED_VENDORS_LIST: 'verified_vendors_list',
  PENDING_VENDORS_LIST: 'pending_vendors_list',
  VENDOR_DETAILS: (userId) => `vendor_details_${userId}`,
  VERIFIED_VENDOR_DETAILS: (userId) => `verified_vendor_details_${userId}`,
  SERVICE_APPROVALS_LIST: 'service_approvals_list',
};

