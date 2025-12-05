import apiClient from './axios';

/**
 * Authentication API Service
 */

/**
 * Login admin
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} Login response
 */
export const loginAdmin = async (email, password) => {
  const response = await apiClient.post('/api/admins/login', {
    email,
    password,
  });
  return response.data;
};

