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

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
            />
            <Navbar />
            <div className="flex flex-grow w-full">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/"
                  element={
                    <div className="flex flex-grow w-full">
                      <Sidebar />
                      <HomePage />
                    </div>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-grow w-full">
                        <Sidebar />
                        <ProfilePage />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post/:postId"
                  element={
                    <div className="flex flex-grow w-full">
                      <Sidebar />
                      <PostDetailPage />
                    </div>
                  }
                />
                <Route
                  path="/create-post"
                  element={
                    <ProtectedRoute>
                      <div className="flex flex-grow w-full">
                        <Sidebar />
                        <CreatePostPage />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups"
                  element={
                    <div className="flex flex-grow w-full">
                      <Sidebar />
                      <GroupPage />
                    </div>
                  }
                />
                <Route
                  path="/group/:groupId"
                  element={
                    <div className="flex flex-grow w-full">
                      <Sidebar />
                      <GroupDetailPage />
                    </div>
                  }
                />
                <Route
                  path="/moderation"
                  element={
                    <ProtectedRoute allowedRoles={["moderator", "admin"]}>
                      <div className="flex flex-grow w-full">
                        <Sidebar />
                        <ModeratorDashboard />
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
