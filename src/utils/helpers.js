// Utility Helper Functions

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as +1 (XXX) XXX-XXXX
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Format date for display
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get page title based on pathname
 */
export const getPageTitle = (pathname) => {
  if (pathname.includes('/onboarding')) return 'Vendor Management';
  if (pathname.includes('/pending')) return 'Vendor Management';
  if (pathname.includes('/vendor/details/')) return 'Vendor Details';
  if (pathname.includes('/verification')) return 'Verification';
  return 'Dashboard';
};

/**
 * Check if pathname matches vendor routes
 */
export const isVendorPage = (pathname) => {
  return pathname.includes('/vendor');
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

/**
 * Generate serial number for table rows
 */
export const generateSerialNo = (index, currentPage = 1, pageSize = 10) => {
  return (currentPage - 1) * pageSize + index + 1;
};

