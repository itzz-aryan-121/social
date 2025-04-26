// pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stories");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // In a real app, these would be API calls
        // const profileResponse = await fetch(`/api/users/${userId}`);
        // const profileData = await profileResponse.json();
        // const postsResponse = await fetch(`/api/users/${userId}/posts`);
        // const postsData = await postsResponse.json();

        // Mock data for development
        setTimeout(() => {
          const mockProfile = {
            id: userId,
            username:
              userId === "101"
                ? "storyteller"
                : userId === "102"
                ? "nightwriter"
                : "midnighttalker",
            bio: "Collector of untold stories and forgotten tales",
            avatar: `/images/avatars/user${userId.slice(-1)}.jpg`,
            joinedDate: "2024-10-15T10:30:00.000Z",
            followers: 128,
            following: 75,
            location: "Whispering Woods",
            website: "https://untoldtales.com",
          };

          const mockPosts = [
            {
              id: "1",
              title: "The Forgotten Village",
              content:
                "Deep in the mountains, there lies a village that time forgot...",
              createdAt: "2025-04-24T18:25:43.511Z",
              likes: 42,
              comments: 12,
              tags: ["folklore", "mystery"],
            },
            {
              id: "4",
              title: "Echoes from the Past",
              content:
                "The antique store had many secrets, but none as strange as the old gramophone...",
              createdAt: "2025-04-20T14:12:33.110Z",
              likes: 27,
              comments: 5,
              tags: ["historical", "mystery"],
            },
          ];

          setProfile(mockProfile);
          setPosts(mockPosts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const isOwnProfile = user && user.id === userId;

  const handleFollow = () => {
    if (!user) {
      toast.info("Sign in to follow users");
      return;
    }

    // In a real app, this would be an API call
    setProfile((prev) => ({
      ...prev,
      followers: prev.followers + 1,
    }));
    toast.success(`You are now following ${profile.username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full p-8">
        <div className="text-center">
          <div className="animate-pulse text-xl text-gray-600 dark:text-gray-400 mb-2">
            Finding the storyteller...
          </div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 max-w-4xl mx-auto w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        <div className="p-6 relative">
          <div className="absolute -top-12 left-6">
            <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-800 overflow-hidden">
              {/* In a real app, this would be an actual image */}
              <div className="h-full w-full flex items-center justify-center text-2xl text-gray-600 dark:text-gray-400">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mt-14 sm:mt-0 sm:ml-28">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-white">
                  {profile.username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Joined {new Date(profile.joinedDate).toLocaleDateString()}
                </p>
              </div>

              {!isOwnProfile && user && (
                <button
                  onClick={handleFollow}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Follow
                </button>
              )}

              {isOwnProfile && (
                <Link
                  to="/settings"
                  className="mt-4 sm:mt-0 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {profile.bio}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {profile.location && (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profile.location}
                </div>
              )}

              {profile.website && (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-6 text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-semibold">{posts.length}</span> Stories
              </div>
              <div>
                <span className="font-semibold">{profile.followers}</span>{" "}
                Followers
              </div>
              <div>
                <span className="font-semibold">{profile.following}</span>{" "}
                Following
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("stories")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stories"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => setActiveTab("liked")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "liked"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Liked Stories
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "groups"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Groups
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "stories" && (
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <Link to={`/post/${post.id}`}>
                        <h3 className="text-xl font-serif font-semibold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-4">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            {post.likes}
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            {post.comments}
                          </div>
                        </div>
                        <Link
                          to={`/post/${post.id}`}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Read full story
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No stories shared yet
                </div>
              )}
            </div>
          )}

          {activeTab === "liked" && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No liked stories to display
            </div>
          )}

          {activeTab === "groups" && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Not a member of any story circles yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
