import apiClient from './axios';

/**
 * Promotions API Service
 */

/**
 * Get active promotions
 * @param {Object} params - Query parameters (isActive)
 * @returns {Promise} Active promotions list response
 */
export const getActivePromotions = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.isActive !== undefined) {
    queryParams.append('isActive', params.isActive);
  }
  
  const queryString = queryParams.toString();
  const url = `/api/promotions${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  
  if (response.data.success && Array.isArray(response.data.data)) {
    return { data: response.data.data };
  }
  
  return { data: [] };
};

/**
 * Get promotion requests (pending promotions)
 * @returns {Promise} Promotion requests list response
 */
export const getPromotionRequests = async () => {
  // For now, return empty array - will be implemented when API is ready
  // This can be updated to call a different endpoint like /api/promotions?isActive=false
  const response = await apiClient.get('/api/promotions?isActive=false');
  
  if (response.data.success && Array.isArray(response.data.data)) {
    return { data: response.data.data };
  }
  
  return { data: [] };
};

