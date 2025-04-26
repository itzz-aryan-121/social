import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiHeart,
  FiBookmark,
  FiSettings,
  FiTag,
  FiShield,
  FiMessageCircle,
  FiPlusCircle,
} from "react-icons/fi";
import AuthContext from "../contexts/AuthContext";

const Sidebar = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { to: "/", icon: <FiHome />, label: "Home", showAlways: true },
    { to: "/groups", icon: <FiUsers />, label: "Groups", showAlways: true },
  ];

  // Add items for authenticated users
  if (isAuthenticated) {
    navItems.push(
      {
        to: `/profile/${user?._id}`,
        icon: <FiBookmark />,
        label: "My Stories",
      },
      { to: "/saved", icon: <FiHeart />, label: "Saved Stories" },
      { to: "/messages", icon: <FiMessageCircle />, label: "Messages" },
      { to: "/settings", icon: <FiSettings />, label: "Settings" }
    );

    // Add moderation dashboard for admins/moderators
    if (user?.role === "admin" || user?.role === "moderator") {
      navItems.push({
        to: "/moderation",
        icon: <FiShield />,
        label: "Moderation",
      });
    }
  }

  // Popular tags (could be fetched from API)
  const popularTags = [
    "Personal",
    "Inspiration",
    "Life Lessons",
    "Travel",
    "Growth",
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 bg-amber-50 dark:bg-gray-900 shadow-md">
      <div className="h-full flex flex-col justify-between p-4">
        <div>
          <ul className="space-y-2">
            {navItems.map(
              (item) =>
                (item.showAlways || isAuthenticated) && (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.to)
                          ? "bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
            )}
          </ul>

          <div className="mt-8">
            <h3 className="px-4 text-sm font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">
              Popular Tags
            </h3>
            <div className="px-4 flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag.toLowerCase()}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-amber-100 dark:bg-gray-800 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900"
                >
                  <FiTag className="mr-1 h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="mt-4 p-4 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
              Join Our Community
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
              Share your stories and connect with others.
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                to="/register"
                className="text-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-center px-4 py-2 bg-transparent border border-amber-600 text-amber-600 dark:text-amber-400 rounded-md hover:bg-amber-50 dark:hover:bg-amber-800 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-6">
            <Link
              to="/create-post"
              className="flex items-center justify-center px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
            >
              <FiPlusCircle className="mr-2" />
              <span>Share Your Story</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
