import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ModeratorDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("reported");
  const [reportedPosts, setReportedPosts] = useState([]);
  const [reportedComments, setReportedComments] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalUsers: 0,
    activeUsers: 0,
    reportedContent: 0,
  });

  useEffect(() => {
    const fetchModeratorData = async () => {
      if (!currentUser || !["moderator", "admin"].includes(currentUser.role)) {
        return;
      }

      try {
        // In a real app, replace with your actual API endpoints
        const statsResponse = await fetch("/api/moderation/stats", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const statsData = await statsResponse.json();

        if (statsResponse.ok) {
          setStats(statsData);
        }

        const reportsResponse = await fetch("/api/moderation/reports", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const reportsData = await reportsResponse.json();

        if (reportsResponse.ok) {
          setReportedPosts(reportsData.posts || []);
          setReportedComments(reportsData.comments || []);
        }

        const pendingResponse = await fetch("/api/moderation/pending-users", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const pendingData = await pendingResponse.json();

        if (pendingResponse.ok) {
          setPendingUsers(pendingData || []);
        }
      } catch (error) {
        toast.error("Error fetching moderation data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModeratorData();
  }, [currentUser]);

  const handleApproveContent = async (contentId, type) => {
    try {
      const response = await fetch(`/api/moderation/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ contentId, type }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Content approved");
        // Remove the item from the appropriate list
        if (type === "post") {
          setReportedPosts(
            reportedPosts.filter((post) => post.id !== contentId)
          );
        } else if (type === "comment") {
          setReportedComments(
            reportedComments.filter((comment) => comment.id !== contentId)
          );
        } else if (type === "user") {
          setPendingUsers(pendingUsers.filter((user) => user.id !== contentId));
        }
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      toast.error("Error connecting to server");
      console.error("Error:", error);
    }
  };

  const handleRemoveContent = async (contentId, type) => {
    try {
      const response = await fetch(`/api/moderation/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ contentId, type }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Content removed");
        // Remove the item from the appropriate list
        if (type === "post") {
          setReportedPosts(
            reportedPosts.filter((post) => post.id !== contentId)
          );
        } else if (type === "comment") {
          setReportedComments(
            reportedComments.filter((comment) => comment.id !== contentId)
          );
        } else if (type === "user") {
          setPendingUsers(pendingUsers.filter((user) => user.id !== contentId));
        }
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      toast.error("Error connecting to server");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser || !["moderator", "admin"].includes(currentUser.role)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 flex-grow">
      <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Total Posts
          </h3>
          <p className="text-2xl font-bold">{stats.totalPosts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Total Comments
          </h3>
          <p className="text-2xl font-bold">{stats.totalComments}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Total Users
          </h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Active Users
          </h3>
          <p className="text-2xl font-bold">{stats.activeUsers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Reported Content
          </h3>
          <p className="text-2xl font-bold">{stats.reportedContent}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "reported"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("reported")}
        >
          Reported Content
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "pending"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Approvals
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "logs"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("logs")}
        >
          Activity Logs
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "reported" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Reported Posts</h2>
          {reportedPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                No reported posts found.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {reportedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>By {post.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-2 py-1 rounded-full">
                        {post.reportCount} reports
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
                      <h4 className="text-sm font-medium mb-2">
                        Reported Reasons:
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {post.reports.map((report, index) => (
                          <li key={index}>• {report.reason}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveContent(post.id, "post")}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRemoveContent(post.id, "post")}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4">Reported Comments</h2>
          {reportedComments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No reported comments found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reportedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>By {comment.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        <span className="mx-2">•</span>
                        <span>On post: {comment.postTitle}</span>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-2 py-1 rounded-full">
                        {comment.reportCount} reports
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {comment.content}
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
                      <h4 className="text-sm font-medium mb-2">
                        Reported Reasons:
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {comment.reports.map((report, index) => (
                          <li key={index}>• {report.reason}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleApproveContent(comment.id, "comment")
                        }
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleRemoveContent(comment.id, "comment")
                        }
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "pending" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending User Approvals</h2>
          {pendingUsers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No pending user approvals.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 mr-3 flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {user.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Registered:{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email: {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
                      <h4 className="text-sm font-medium mb-2">User Bio:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.bio || "No bio provided."}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveContent(user.id, "user")}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRemoveContent(user.id, "user")}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              Moderation Activity Logs
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      Moderator
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      Content Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* This would display real log data from your API */}
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Removed Post
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      John Smith
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Post #12845
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Apr 25, 2025
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs">
                        Removed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Approved Comment
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Jane Doe
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Comment #78432
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Apr 24, 2025
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                        Approved
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Approved User
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      John Smith
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      User #4562
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      Apr 23, 2025
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
