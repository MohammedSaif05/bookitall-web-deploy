import axios from 'axios';

/**
 * IFSC Verification API Service
 */

const IFSC_API_BASE_URL = 'https://ifsc.in/api/v1';
const IFSC_API_KEY = 'f55035261a94b50103de695b1b7692ada9db9bbb28f957d57a46dd35aafa8e90';

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
    const response = await axios.get(`${IFSC_API_BASE_URL}/lookup/${cleanIfsc}`, {
      headers: {
        'X-API-KEY': IFSC_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data;
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

