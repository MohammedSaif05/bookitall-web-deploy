import { useState, useEffect, useCallback } from 'react';
import { getCachedData, setCachedData } from '../utils/cache';

/**
 * Custom hook for API calls with caching
 * @param {Function} apiFunction - The API function to call
 * @param {string} cacheKey - Cache key for storing/retrieving data
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {boolean} immediate - Whether to call API immediately on mount
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useCachedApi = (
  apiFunction,
  cacheKey,
  dependencies = [],
  immediate = true,
  useCache = true
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first (unless force refresh)
        if (useCache && !forceRefresh) {
          const cachedData = getCachedData(cacheKey);
          if (cachedData) {
            setData(cachedData);
            setLoading(false);
            return cachedData;
          }
        }

        // Fetch from API
        const response = await apiFunction();
        const responseData = response.data || response;

        // Cache the response
        if (useCache) {
          setCachedData(cacheKey, responseData);
        }

        setData(responseData);
        return responseData;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        setData(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, cacheKey, useCache]
  );

  useEffect(() => {
    if (immediate) {
      fetchData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback(
    (forceRefresh = true) => {
      return fetchData(forceRefresh);
    },
    [fetchData]
  );

  return { data, loading, error, refetch };
};

