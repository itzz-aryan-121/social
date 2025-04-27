// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { authApi } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token, retryCount = 0) => {
    try {
      const response = await authApi.verify();
      // The /me endpoint returns the user object directly
      setUser(response.data);
      setBackendAvailable(true);
    } catch (error) {
      console.error('Auth verification failed:', error);
      
      // If backend is not available (404 or network error) and we haven't retried too many times
      if ((error.response?.status === 404 || !error.response) && retryCount < 3) {
        console.log(`Retrying token verification (attempt ${retryCount + 1})...`);
        // Retry after a delay
        setTimeout(() => verifyToken(token, retryCount + 1), 2000);
        return;
      }
      
      // If backend is available but token is invalid, remove it
      if (error.response && error.response.status !== 404) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Authentication failed. Please log in again.');
      } else {
        // Backend is not available, but we'll keep the token
        setBackendAvailable(false);
        console.warn('Backend is not available. Keeping token for when backend comes back online.');
        
        // Create a temporary user object from the token
        try {
          const decodedToken = jwtDecode(token);
          setUser({
            _id: decodedToken.id || decodedToken.sub,
            username: decodedToken.username || 'User',
            email: decodedToken.email,
            isTemporary: true
          });
        } catch (tokenError) {
          console.error('Error decoding token:', tokenError);
          // If token is invalid, remove it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setBackendAvailable(true);
      toast.success("Welcome back to Unheard Stories!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return {
        success: false,
        error: message
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      toast.success("Registration successful! Welcome to Unheard Stories.");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return {
        success: false,
        error: message
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info("You have been logged out");
  };

  const updateProfile = async (formData) => {
    try {
      const response = await authApi.updateProfile(formData);
      setUser(response.data);
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return false;
    }
  };

  const changePassword = async (formData) => {
    try {
      await authApi.changePassword(formData);
      toast.success("Password changed successfully");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
