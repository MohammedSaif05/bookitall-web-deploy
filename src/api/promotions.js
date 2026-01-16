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
 * @param {Object} params - Query parameters (status)
 * @returns {Promise} Promotion requests list response
 */
export const getPromotionRequests = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.status) {
    queryParams.append('status', params.status);
  }
  
  const queryString = queryParams.toString();
  const url = `/api/admin/promotions/requests${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiClient.get(url);
  
  if (response.data.success && Array.isArray(response.data.data)) {
    return { data: response.data.data };
  }
  
  return { data: [] };
};

/**
 * Approve promotion request
 * @param {string} requestId - Promotion request ID
 * @returns {Promise} Approval response
 */
export const approvePromotionRequest = async (requestId) => {
  const response = await apiClient.post(
    `/api/admin/promotions/${requestId}/approve`
  );
  
  return response.data;
};

/**
 * Upload promotion images
 * @param {string} requestId - Promotion request ID
 * @param {File[]} images - Array of image files (max 4)
 * @returns {Promise} Upload response
 */
export const uploadPromotionImages = async (requestId, images) => {
  const formData = new FormData();
  formData.append('requestId', requestId);
  
  // Append each image file
  images.forEach((image) => {
    formData.append('promotionImages', image);
  });
  
  const response = await apiClient.post(
    `/api/admin/promotions/${requestId}/upload-images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};

/**
 * Get promotion assets (uploaded images)
 * @param {string} requestId - Promotion request ID
 * @param {string} vendorId - Vendor ID
 * @returns {Promise} Promotion assets response
 */
export const getPromotionAssets = async (requestId, vendorId) => {
  const response = await apiClient.get(
    `/api/vendor/promotions/${requestId}/assets?vendorId=${vendorId}`
  );
  
  if (response.data.success && Array.isArray(response.data.data)) {
    return { data: response.data.data };
  }
  
  return { data: [] };
};

