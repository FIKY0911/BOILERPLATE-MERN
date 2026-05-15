import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = '/api/auth';

/**
 * Register user
 */
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Login user
 */
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
  await axios.get(`${API_URL}/logout`);
  localStorage.removeItem('token');
};

/**
 * Get Decoded Token
 * This "decrypts" (decodes) the JWT payload to get user info
 */
export const getDecodedToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};
