import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiBell,
  FiUser,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import AuthContext from "../contexts/AuthContext";
import ThemeContext from "../contexts/ThemeContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-amber-50 dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="h-9 w-auto text-amber-600 dark:text-amber-400" />
              <span className="ml-3 text-xl font-semibold text-amber-800 dark:text-amber-300 tracking-tight">
                RealEcho
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search stories of resilience..."
                className="py-2 pl-12 pr-4 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-amber-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 w-72 shadow-sm transition-all duration-300 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 dark:text-amber-400" />
            </form>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 hover:scale-105 focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium shadow-md transition-all duration-300 ease-in-out"
                >
                  Share Your Story
                </Link>
                <button
                  onClick={toggleProfile}
                  className="relative p-2 rounded-full text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
                  aria-label="Profile menu"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover border-2 border-amber-300 dark:border-amber-500 transition-all duration-200"
                    />
                  ) : (
                    <FiUser className="h-6 w-6" />
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-4 top-16 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-amber-200 dark:ring-gray-700 overflow-hidden opacity-0 translate-y-2 animate-slide-in">
                    <div className="py-2">
                      <div className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 border-b border-amber-100 dark:border-gray-700">
                        <p className="font-semibold text-amber-800 dark:text-amber-300">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to={`/profile/${user?._id}`}
                        className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Your Profile
                      </Link>
                      {(user?.role === "admin" ||
                        user?.role === "moderator") && (
                        <Link
                          to="/moderation"
                          className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Moderation Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-amber-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-105 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-200 ease-in-out"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 hover:scale-105 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-md transition-all duration-300 ease-in-out"
                >
                  Join the Community
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-amber-50 dark:bg-gray-900 shadow-md opacity-0 translate-y-2 animate-slide-in">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search stories of resilience..."
                className="w-full py-2 pl-12 pr-4 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-amber-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all duration-300 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 dark:text-amber-400" />
            </form>

            <button
              onClick={toggleDarkMode}
              className="flex w-full items-center px-4 py-2 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
            >
              {darkMode ? (
                <FiSun className="h-5 w-5 mr-3" />
              ) : (
                <FiMoon className="h-5 w-5 mr-3" />
              )}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-2 rounded-lg text-white bg-amber-600 hover:bg-amber-700 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 shadow-md transition-all duration-300 ease-in-out"
                >
                  Share Your Story
                </Link>
                <Link
                  to={`/profile/${user?._id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-2 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
                >
                  <FiUser className="h-5 w-5 mr-3" />
                  Profile
                </Link>
                {(user?.role === "admin" || user?.role === "moderator") && (
                  <Link
                    to="/moderation"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-2 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
                  >
                    Moderation Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
                >
                  <FiLogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-2 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-800 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 transition-all duration-200 ease-in-out"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-2 rounded-lg text-white bg-amber-600 hover:bg-amber-700 hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 shadow-md transition-all duration-300 ease-in-out"
                >
                  Join the Community
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
