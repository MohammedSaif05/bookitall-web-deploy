import apiClient from './axios';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * IFSC Verification API Service
 * 
 * This calls the backend endpoint which proxies the request to the IFSC API.
 * The backend endpoint should be: GET /api/verification/verify-ifsc/:ifscCode
 */

/**
 * Verify IFSC code
 * @param {string} ifscCode - IFSC code to verify
 * @returns {Promise} API response with bank details
 */
export const verifyIfsc = async (ifscCode) => {
  if (!ifscCode || !ifscCode.trim()) {
    throw new Error('IFSC code is required');
  }

  // Clean and uppercase IFSC code
  const cleanIfsc = ifscCode.trim().toUpperCase();

  try {
    const response = await apiClient.get(API_ENDPOINTS.VERIFICATION.VERIFY_IFSC(cleanIfsc));
    
    // Handle nested response structure:
    // { success: true, data: { success: true, message: "...", data: { ifsc, bank_name, ... } } }
    if (response.data.success && response.data.data) {
      const innerData = response.data.data;
      
      if (innerData.success && innerData.data) {
        return {
          status: true,
          message: innerData.message || 'IFSC details found',
          data: innerData.data, // This contains: valid, ifsc, bank_name, branch_name, city, state
        };
      } else {
        throw new Error(innerData.message || 'IFSC code not found or invalid');
      }
    } else {
      throw new Error(response.data.message || 'IFSC code not found or invalid');
    }
  } catch (error) {
    if (error.response) {
      // API returned an error response
      const errorMessage = error.response.data?.message || 'IFSC code not found or invalid';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Failed to verify IFSC code');
    }
  }
};

