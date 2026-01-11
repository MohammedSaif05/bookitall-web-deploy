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

/**
 * Upload category image
 * @param {File} imageFile - Image file to upload
 * @returns {Promise} Upload response with imageUrl
 */
export const uploadCategoryImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await apiClient.post('/api/admin/categories/upload-category-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Add category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.image - Image URL
 * @param {number} categoryData.order - Category order
 * @returns {Promise} API response
 */
export const addCategory = async (categoryData) => {
  const response = await apiClient.post('/api/admin/categories/add-prod-category', categoryData);
  
  return response.data;
};

/**
 * Update category
 * @param {string} categoryId - Category ID (_id)
 * @param {Object} categoryData - Category data (all fields optional)
 * @param {string} [categoryData.name] - Category name
 * @param {string} [categoryData.image] - Image URL
 * @param {number} [categoryData.order] - Category order
 * @param {boolean} [categoryData.isActive] - Category active status
 * @returns {Promise} API response
 */
export const updateCategory = async (categoryId, categoryData) => {
  const response = await apiClient.put(`/api/admin/categories/${categoryId}`, categoryData);
  
  return response.data;
};

