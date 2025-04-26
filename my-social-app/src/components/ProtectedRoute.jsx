import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50 dark:bg-gray-900 spinner-container">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 spinner"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If route requires specific roles and user doesn't have them, redirect to home
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized, render the protected component
  return children;
};

export default ProtectedRoute;
