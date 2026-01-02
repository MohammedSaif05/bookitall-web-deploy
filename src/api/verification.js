/**
 * IFSC Verification API Service
 * 
 * Note: This calls the IFSC API directly from the frontend.
 * If CORS errors occur, you'll need to create a backend proxy endpoint.
 */

const IFSC_API_BASE_URL = 'https://ifsc.in/api/v1';
const IFSC_API_KEY = 'f55035261a94b50103de695b1b7692ada9db9bbb28f957d57a46dd35aafa8e90';

/**
 * Verify IFSC code using /validate endpoint
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
    // Direct API call using fetch
    const response = await fetch(`${IFSC_API_BASE_URL}/validate/${cleanIfsc}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': IFSC_API_KEY,
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle CORS errors specifically
    if (
      error.message.includes('CORS') || 
      error.message.includes('Access-Control') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    ) {
      throw new Error('CORS error: The IFSC API does not allow direct calls from the browser. Please create a backend proxy endpoint to call this API.');
    }

    throw error;
  }
};

