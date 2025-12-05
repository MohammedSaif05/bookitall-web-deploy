// import apiClient from './axios';
// import { API_ENDPOINTS } from '../utils/constants';

/**
 * Vendor API Service
 * Note: Currently returns mock data. Replace with actual API calls when backend is ready.
 * Uncomment imports above when ready to use real API.
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
 * Get pending vendors
 * @param {Object} params - Query parameters (unused in mock, will be used in real API)
 */
export const getPendingVendors = async () => {
  // TODO: Replace with actual API call
  // export const getPendingVendors = async (params = {}) => {
  //   return apiClient.get(API_ENDPOINTS.VENDORS.PENDING, { params });
  // }
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockPendingVendors });
    }, 500);
  });
};

/**
 * Get verified vendors
 * @param {Object} params - Query parameters (unused in mock, will be used in real API)
 */
export const getVerifiedVendors = async () => {
  // TODO: Replace with actual API call
  // export const getVerifiedVendors = async (params = {}) => {
  //   return apiClient.get(API_ENDPOINTS.VENDORS.VERIFIED, { params });
  // }
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockVerifiedVendors });
    }, 500);
  });
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

