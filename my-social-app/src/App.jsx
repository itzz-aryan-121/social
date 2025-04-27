// App.js - Main application component
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import GroupPage from "./pages/GroupPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import CreateGroupPage from "./pages/CreateGroupPage";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/profile/:userId" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          {user && user._id ? (
            <Navigate to={`/profile/${user._id}`} replace />
          ) : (
            <div>Loading...</div>
          )}
        </ProtectedRoute>
      } />
      <Route path="/groups" element={
        <ProtectedRoute>
          <GroupPage />
        </ProtectedRoute>
      } />
      <Route path="/groups/create" element={
        <ProtectedRoute>
          <CreateGroupPage />
        </ProtectedRoute>
      } />
      <Route path="/groups/:groupId" element={
        <ProtectedRoute>
          <GroupDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/posts/:postId" element={
        <ProtectedRoute>
          <PostDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/create-post" element={
        <ProtectedRoute>
          <CreatePostPage />
        </ProtectedRoute>
      } />
      <Route path="/moderator" element={
        <ProtectedRoute>
          <ModeratorDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
