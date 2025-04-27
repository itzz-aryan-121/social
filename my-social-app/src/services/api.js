import axios from 'axios';

const API_BASE_URL = 'http://localhost:7001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Posts API
export const posts = {
  getAllPosts: () => api.get('/posts'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
};

// Comments API
export const comments = {
  getPostComments: (postId) => api.get(`/comments/post/${postId}`),
  addComment: (postId, content) => api.post('/comments', { postId, content }),
  updateComment: (id, content) => api.put(`/comments/${id}`, { content }),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

// Groups API
export const groups = {
  getAllGroups: () => api.get('/groups'),
  getGroup: (id) => api.get(`/groups/${id}`),
  createGroup: (groupData) => api.post('/groups', groupData),
  updateGroup: (id, groupData) => api.put(`/groups/${id}`, groupData),
  deleteGroup: (id) => api.delete(`/groups/${id}`),
  joinGroup: (id) => api.post(`/groups/${id}/join`),
  leaveGroup: (id) => api.post(`/groups/${id}/leave`),
};

// Moderation API
export const moderation = {
  reportContent: (contentType, contentId, reason) => 
    api.post('/moderation/report', { contentType, contentId, reason }),
  getReports: () => api.get('/moderation/reports'),
  resolveReport: (reportId, action) => 
    api.post(`/moderation/reports/${reportId}/resolve`, { action }),
};

export default api; 