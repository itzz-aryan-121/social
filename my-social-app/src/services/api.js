import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:7001/api';

// Auth
export const authApi = {
  verify: async () => {
    try {
      return await axios.get(`${API_URL}/auth/me`);
    } catch (error) {
      console.error('Token verification error:', error);
      throw error; // Re-throw to let the AuthContext handle it
    }
  },
  login: (credentials) => axios.post(`${API_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData),
  updateProfile: (formData) => axios.put(`${API_URL}/auth/profile`, formData),
  changePassword: (formData) => axios.put(`${API_URL}/auth/change-password`, formData),
};

// Posts
export const postsApi = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      // Ensure we always return an array
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Return empty array on error
      return { data: [] };
    }
  },
  getById: (id) => axios.get(`${API_URL}/posts/${id}`),
  create: (data) => axios.post(`${API_URL}/posts`, data),
  update: (id, data) => axios.put(`${API_URL}/posts/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/posts/${id}`),
  like: (id) => axios.post(`${API_URL}/posts/${id}/like`),
  unlike: (id) => axios.post(`${API_URL}/posts/${id}/unlike`),
};

// Comments
export const commentsApi = {
  getByPostId: (postId) => axios.get(`${API_URL}/posts/${postId}/comments`),
  create: (postId, data) => axios.post(`${API_URL}/posts/${postId}/comments`, data),
  update: (postId, commentId, data) => axios.put(`${API_URL}/posts/${postId}/comments/${commentId}`, data),
  delete: (postId, commentId) => axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`),
  like: (postId, commentId) => axios.post(`${API_URL}/posts/${postId}/comments/${commentId}/like`),
  unlike: (postId, commentId) => axios.post(`${API_URL}/posts/${postId}/comments/${commentId}/unlike`),
};

// Groups
export const groupsApi = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      // Ensure we always return an array
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.error('Error fetching groups:', error);
      // Return empty array on error
      return { data: [] };
    }
  },
  getById: async (id) => {
    try {
      return await axios.get(`${API_URL}/groups/${id}`);
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error;
    }
  },
  create: (data) => axios.post(`${API_URL}/groups`, data),
  update: (id, data) => axios.put(`${API_URL}/groups/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/groups/${id}`),
  join: (id) => axios.post(`${API_URL}/groups/${id}/join`),
  leave: (id) => axios.post(`${API_URL}/groups/${id}/leave`),
  getPosts: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/groups/${id}/posts`);
      // Ensure we always return an array
      return { data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      console.error(`Error fetching posts for group ${id}:`, error);
      // Return empty array on error
      return { data: [] };
    }
  },
};

// Users
export const usersApi = {
  getProfile: (userId) => axios.get(`${API_URL}/users/${userId}`),
  getMyProfile: () => axios.get(`${API_URL}/users/me`),
  updateProfile: (data) => axios.put(`${API_URL}/users/profile`, data),
  getPosts: (userId) => axios.get(`${API_URL}/users/${userId}/posts`),
  follow: (userId) => axios.post(`${API_URL}/users/${userId}/follow`),
  unfollow: (userId) => axios.post(`${API_URL}/users/${userId}/unfollow`),
};

// Moderation
export const moderationApi = {
  getReports: () => axios.get(`${API_URL}/moderation/reports`),
  handleReport: (reportId, action) => axios.post(`${API_URL}/moderation/reports/${reportId}/handle`, { action }),
  banUser: (userId) => axios.post(`${API_URL}/moderation/users/${userId}/ban`),
  unbanUser: (userId) => axios.post(`${API_URL}/moderation/users/${userId}/unban`),
};

export const createGroup = async (groupData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(`${API_URL}/groups`, groupData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// Set up axios interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 