// Application Constants

export const ROUTES = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  VENDOR_ONBOARDING: '/dashboard/vendor/onboarding',
  VENDOR_PENDING: '/dashboard/vendor/pending',
  VENDOR_DETAILS: (id) => `/dashboard/vendor/details/${id}`,
  VERIFIED_VENDOR_DETAILS: (id) => `/dashboard/vendor/verified/${id}`,
  VERIFICATION: '/dashboard/verification',
  SERVICE_APPROVALS: '/dashboard/services/approvals',
};

export const VENDOR_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const STORAGE_KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  VENDORS: {
    LIST: '/api/vendors',
    PENDING: '/api/vendors/pending',
    VERIFIED: '/api/vendors/verified',
    DETAIL: (id) => `/api/vendors/${id}`,
    UPDATE_STATUS: (id) => `/api/vendors/${id}/status`,
  },
  VERIFICATION: {
    VERIFY_IFSC: (ifscCode) => `/api/verification/verify-ifsc/${ifscCode}`,
  },
};

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
};

export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    icon: 'Store',
    children: [
      {
        id: 'verified',
        label: 'Verified Vendors',
        path: ROUTES.VENDOR_ONBOARDING,
        icon: 'FaUserCheck',
      },
      {
        id: 'pending',
        label: 'Pending',
        path: ROUTES.VENDOR_PENDING,
        icon: 'FaClock',
      },
    ],
  },
];

