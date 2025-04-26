// pages/HomePage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/posts');
        // const data = await response.json();

        // Mock data for development
        setTimeout(() => {
          const mockPosts = [
            {
              id: "1",
              title: "The Forgotten Village",
              content:
                "Deep in the mountains, there lies a village that time forgot...",
              author: { id: "101", username: "storyteller" },
              createdAt: "2025-04-24T18:25:43.511Z",
              likes: 42,
              comments: 12,
              tags: ["folklore", "mystery"],
            },
            {
              id: "2",
              title: "Whispers in the Night",
              content:
                "The old house at the end of the lane always had stories to tell...",
              author: { id: "102", username: "nightwriter" },
              createdAt: "2025-04-25T09:15:22.300Z",
              likes: 38,
              comments: 8,
              tags: ["personal", "supernatural"],
            },
            {
              id: "3",
              title: "The Last Train Home",
              content:
                "No one knows where it goes after midnight, but those who board never return the same...",
              author: { id: "103", username: "midnighttalker" },
              createdAt: "2025-04-25T12:40:18.700Z",
              likes: 65,
              comments: 24,
              tags: ["urban legend", "spooky"],
            },
          ];

          setPosts(mockPosts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load stories");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    if (!user) {
      toast.info("Sign in to like stories");
      return;
    }

    // In a real app, this would be an API call
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full p-8">
        <div className="text-center">
          <div className="animate-pulse text-xl text-gray-600 dark:text-gray-400 mb-2">
            Gathering untold stories...
          </div>
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Unheard Stories
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-400">
          Discover tales that whisper from forgotten corners
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("latest")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "latest"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => setFilter("popular")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "popular"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => setFilter("folklore")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "folklore"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          Folklore
        </button>
        <button
          onClick={() => setFilter("supernatural")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "supernatural"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          Supernatural
        </button>
      </div>

      {user && (
        <div className="mb-6">
          <Link
            to="/create-post"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Share Your Story
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
          >
            <div className="p-6">
              <Link to={`/post/${post.id}`}>
                <h2 className="text-xl font-serif font-semibold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                By{" "}
                <Link
                  to={`/profile/${post.author.id}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {post.author.username}
                </Link>{" "}
                • {new Date(post.createdAt).toLocaleDateString()}
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
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
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
                  </button>
                  <Link
                    to={`/post/${post.id}`}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
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
                  </Link>
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
        ))}
      </div>
    </div>
  );
};

export default HomePage;
