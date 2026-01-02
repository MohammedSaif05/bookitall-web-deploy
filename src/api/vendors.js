import apiClient from './axios';

/**
 * Vendor API Service
 */

// Mock data - Remove when API is ready
const mockPendingVendors = [
  {
    id: 1,
    businessName: 'New Restaurant',
    businessType: 'Restaurant',
    businessCategory: 'Food & Beverage',
    location: 'Boston, MA',
    mobileNumber: '+1 234-567-8906',
    status: 'Pending',
  },
  {
    id: 2,
    businessName: 'Grand Hotel',
    businessType: 'Hotel',
    businessCategory: 'Hospitality',
    location: 'Seattle, WA',
    mobileNumber: '+1 234-567-8907',
    status: 'Pending',
  },
  {
    id: 3,
    businessName: 'Ocean Tours',
    businessType: 'Travel Agency',
    businessCategory: 'Travel & Tourism',
    location: 'San Diego, CA',
    mobileNumber: '+1 234-567-8908',
    status: 'Pending',
  },
  {
    id: 4,
    businessName: 'Party Planners',
    businessType: 'Event Management',
    businessCategory: 'Events',
    location: 'Austin, TX',
    mobileNumber: '+1 234-567-8909',
    status: 'Pending',
  },
  {
    id: 5,
    businessName: 'Mountain Adventures',
    businessType: 'Sports',
    businessCategory: 'Recreation',
    location: 'Portland, OR',
    mobileNumber: '+1 234-567-8910',
    status: 'Pending',
  },
];

const mockVerifiedVendors = [
  {
    id: 1,
    businessName: 'ABC Restaurant',
    businessType: 'Restaurant',
    businessCategory: 'Food & Beverage',
    location: 'New York, NY',
    mobileNumber: '+1 234-567-8901',
    status: 'Verified',
  },
  {
    id: 2,
    businessName: 'XYZ Hotel',
    businessType: 'Hotel',
    businessCategory: 'Hospitality',
    location: 'Los Angeles, CA',
    mobileNumber: '+1 234-567-8902',
    status: 'Verified',
  },
  {
    id: 3,
    businessName: 'Sunset Tours',
    businessType: 'Travel Agency',
    businessCategory: 'Travel & Tourism',
    location: 'Miami, FL',
    mobileNumber: '+1 234-567-8903',
    status: 'Verified',
  },
  {
    id: 4,
    businessName: 'City Events',
    businessType: 'Event Management',
    businessCategory: 'Events',
    location: 'Chicago, IL',
    mobileNumber: '+1 234-567-8904',
    status: 'Verified',
  },
  {
    id: 5,
    businessName: 'Adventure Sports',
    businessType: 'Sports',
    businessCategory: 'Recreation',
    location: 'Denver, CO',
    mobileNumber: '+1 234-567-8905',
    status: 'Verified',
  },
];

/**
 * Get all vendors
 * @param {Object} params - Query parameters (unused in mock, will be used in real API)
 */
export const getAllVendors = async () => {
  // TODO: Replace with actual API call
  // export const getAllVendors = async (params = {}) => {
  //   return apiClient.get(API_ENDPOINTS.VENDORS.LIST, { params });
  // }
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [...mockPendingVendors, ...mockVerifiedVendors] });
    }, 500);
  });
};

/**
 * Get pending vendors list (lightweight - only essential fields)
 * @returns {Promise} Pending vendors list response
 */
export const getPendingVendors = async () => {
  const response = await apiClient.get('/api/vendors/pending-list');
  
  // Transform API response to match table structure
  if (response.data.success && Array.isArray(response.data.data)) {
    const transformedData = response.data.data.map((vendor, index) => ({
      id: vendor.userId, // Use userId as the identifier
      userId: vendor.userId,
      serialNo: index + 1,
      businessName: vendor.businessName || 'N/A',
      businessType: vendor.businessType || 'N/A',
      businessCategory: vendor.businessCategory || 'N/A',
      location: vendor.location || vendor.city || 'N/A',
      mobileNumber: vendor.mobileNumber || vendor.mobileNo || 'N/A',
      status: 'Pending',
    }));
    
    return { data: transformedData };
  }
  
  return { data: [] };
};

/**
 * Get verified vendors list (lightweight - only essential fields)
 * @returns {Promise} Verified vendors list response
 */
export const getVerifiedVendors = async () => {
  const response = await apiClient.get('/api/vendors/verified-vendors-list');
  
  // Transform API response to match table structure
  if (response.data.success && Array.isArray(response.data.data)) {
    const transformedData = response.data.data.map((vendor, index) => ({
      id: vendor.userId, // Use userId as the identifier
      userId: vendor.userId,
      shopId: vendor.shopId || 'N/A',
      serialNo: index + 1,
      businessName: vendor.businessName || 'N/A',
      businessType: vendor.businessType || 'N/A',
      businessCategory: vendor.businessCategory || 'N/A',
      location: vendor.location || vendor.city || 'N/A',
      mobileNumber: vendor.mobileNumber || vendor.mobileNo || 'N/A',
      status: 'Verified',
    }));
    
    return { data: transformedData };
  }
  
  return { data: [] };
};

/**
 * Get vendor details by userId
 * @param {string} userId - Vendor userId
 * @returns {Promise} Vendor details response
 */
export const getVendorDetailsByUserId = async (userId) => {
  const response = await apiClient.get(`/api/vendors/${userId}`);
  
  if (response.data.success && response.data.data) {
    return { data: response.data.data };
  }
  
  throw new Error('Vendor details not found');
};

/**
 * Get vendor by ID
 */
export const getVendorById = async (id) => {
  // TODO: Replace with actual API call
  // return apiClient.get(API_ENDPOINTS.VENDORS.DETAIL(id));
  
  // Mock implementation
  const allVendors = [...mockPendingVendors, ...mockVerifiedVendors];
  const vendor = allVendors.find((v) => v.id === parseInt(id));
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (vendor) {
        resolve({ data: vendor });
      } else {
        reject(new Error('Vendor not found'));
      }
    }, 300);
  });
};

/**
 * Update vendor status
 */
export const updateVendorStatus = async (id, status) => {
  // TODO: Replace with actual API call
  // return apiClient.patch(API_ENDPOINTS.VENDORS.UPDATE_STATUS(id), { status });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { id, status, updatedAt: new Date().toISOString() } });
    }, 500);
  });
};

/**
 * Reject vendor images
 * @param {string} userId - Vendor userId
 * @param {string} reason - Rejection reason
 * @returns {Promise} API response
 */
export const rejectVendorImages = async (userId, reason) => {
  const response = await apiClient.patch(`/api/vendor/${userId}/reject-images`, {
    userId,
    message: reason,
  });
  
  return response.data;
};

/**
 * Reject vendor document
 * @param {string} userId - Vendor userId
 * @param {string} reason - Rejection reason
 * @returns {Promise} API response
 */
export const rejectVendorDocument = async (userId, reason) => {
  const response = await apiClient.patch(`/api/vendor/${userId}/reject-document`, {
    userId,
    message: reason,
  });
  
  return response.data;
};

/**
 * Reject vendor services
 * @param {string} userId - Vendor userId
 * @param {string} reason - Rejection reason
 * @returns {Promise} API response
 */
export const rejectVendorServices = async (userId, reason) => {
  const response = await apiClient.patch(`/api/vendor/${userId}/reject-services`, {
    userId,
    message: reason,
  });
  
  return response.data;
};

/**
 * Approve vendor for production
 * @param {string} userId - Vendor userId
 * @returns {Promise} API response
 */
export const approveVendorProduction = async (userId) => {
  const response = await apiClient.patch(`/api/vendor/${userId}/approve-vendor-production`, {
    userId,
  });
  
  return response.data;
};

