import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // In a real app, replace with your actual API endpoints
        const groupResponse = await fetch(`/api/groups/${groupId}`);
        const groupData = await groupResponse.json();

        if (!groupResponse.ok) {
          throw new Error(groupData.message || "Failed to fetch group details");
        }

        setGroup(groupData);

        // Check if current user is a member of this group
        if (currentUser) {
          setIsMember(
            groupData.members.some((member) => member.id === currentUser.id)
          );
        }

        // Fetch posts and members for this group
        const postsResponse = await fetch(`/api/groups/${groupId}/posts`);
        const postsData = await postsResponse.json();

        if (postsResponse.ok) {
          setPosts(postsData);
        }

        const membersResponse = await fetch(`/api/groups/${groupId}/members`);
        const membersData = await membersResponse.json();

        if (membersResponse.ok) {
          setMembers(membersData);
        }
      } catch (error) {
        toast.error(error.message || "Error fetching group details");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, currentUser]);

  const handleJoinLeave = async () => {
    if (!currentUser) {
      toast.info("Please login to join groups");
      return;
    }

    try {
      const endpoint = isMember
        ? `/api/groups/${groupId}/leave`
        : `/api/groups/${groupId}/join`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsMember(!isMember);
        toast.success(
          isMember ? "Left group successfully" : "Joined group successfully"
        );

        // Update members list
        if (isMember) {
          setMembers(members.filter((member) => member.id !== currentUser.id));
        } else {
          setMembers([...members, currentUser]);
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

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Group not found</h2>
        <p className="mb-8">
          The group you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/groups"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 flex-grow">
      {/* Group Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="h-48 bg-gray-300 dark:bg-gray-700 relative">
          {group.coverImage ? (
            <img
              src={group.coverImage}
              alt={`${group.name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
              <span className="text-white text-4xl font-bold">
                {group.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {group.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{members.length} members</span>
                <span className="mx-2">•</span>
                <span>
                  Created on {new Date(group.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {currentUser && (
              <button
                onClick={handleJoinLeave}
                className={`mt-4 md:mt-0 px-6 py-2 rounded-lg transition duration-200 ${
                  isMember
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isMember ? "Leave Group" : "Join Group"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "posts"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "members"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "about"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" && (
        <div>
          {currentUser && isMember && (
            <Link
              to="/create-post"
              state={{ groupId: group.id }}
              className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Share your story with the group...
            </Link>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">No stories yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to share in this group!
              </p>
              {currentUser && isMember && (
                <Link
                  to="/create-post"
                  state={{ groupId: group.id }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Create Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  to={`/post/${post.id}`}
                  key={post.id}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
                            <span className="text-white font-medium">
                              {post.author.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.likes || 0} likes</span>
                      <span className="mx-2">•</span>
                      <span>{post.comments || 0} comments</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "members" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Members ({members.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Link
                to={`/profile/${member.id}`}
                key={member.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 mr-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500">
                      <span className="text-white font-medium">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role === "admin" && "Admin"}
                    {member.role === "moderator" && "Moderator"}
                    {member.joinedAt &&
                      `Joined ${new Date(
                        member.joinedAt
                      ).toLocaleDateString()}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === "about" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">About this Group</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Description
              </h3>
              <p className="mt-1">{group.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Created
              </h3>
              <p className="mt-1">
                {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Rules
              </h3>
              {group.rules && group.rules.length > 0 ? (
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {group.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  No specific rules have been set for this group.
                </p>
              )}
            </div>
            {group.admins && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                  Admins
                </h3>
                <div className="mt-2 space-y-2">
                  {group.admins.map((admin) => (
                    <Link
                      key={admin.id}
                      to={`/profile/${admin.id}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 mr-3">
                        {admin.avatar ? (
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
                            <span className="text-white text-sm font-medium">
                              {admin.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{admin.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailPage;
