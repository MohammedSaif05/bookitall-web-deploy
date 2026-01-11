import apiClient from './axios';

/**
 * Categories API Service
 */

/**
 * Get all categories
 * @returns {Promise} Categories list response
 */
export const getCategories = async () => {
  const response = await apiClient.get('/api/categories');
  
  if (response.data.success && Array.isArray(response.data.data)) {
    return { data: response.data.data };
  }
  
  return { data: [] };
};

