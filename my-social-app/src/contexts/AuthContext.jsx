// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            config
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // If token is expired or invalid, logout
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const register = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData
      );

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);

      toast.success("Registration successful! Welcome to Unheard Stories.");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
      return false;
    }
  };

  const login = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);

      toast.success("Welcome back to Unheard Stories!");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("You have been logged out");
  };

  const updateProfile = async (formData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        formData,
        config
      );

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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        formData,
        config
      );

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
    token,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
