// PostDetailPage.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import AuthContext from "../contexts/AuthContext";
import CommentSection from "../components/CommentSection";
import RelatedPosts from "../components/RelatedPosts";

const PostDetailPage = () => {
  const { postId } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Simulate fetching post data
  useEffect(() => {
    // In a real app, you would fetch from your API
    const fetchPost = async () => {
      try {
        // Mock data for demonstration
        setTimeout(() => {
          setPost({
            _id: postId,
            title: "My Journey Through Adversity",
            content: `
              <p>There was a time when I thought I'd never recover. The odds seemed stacked against me, and every day was a struggle just to get out of bed. But somehow, I found the strength to keep going.</p>
              <p>It started with small steps - a walk around the block, a conversation with a friend, a moment of peace in the chaos. These small victories added up, day by day, until I realized I wasn't just surviving anymore - I was living again.</p>
              <p>What I learned through this journey is that resilience isn't about never falling down. It's about finding the courage to rise again, even when it seems impossible. And sometimes, the strongest people are those who have been broken the most.</p>
              <p>I'm sharing this story not for sympathy, but in hopes that someone who needs it might find strength in knowing they're not alone. Whatever you're going through, keep going. The dawn always follows the darkest night.</p>
            `,
            author: {
              _id: "user123",
              username: "resilient_soul",
              profilePicture: "/api/placeholder/48/48",
            },
            createdAt: "2025-04-01T12:00:00Z",
            tags: ["Personal", "Growth", "Resilience"],
            likes: 243,
            comments: 57,
            category: "Personal",
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        setError("Failed to load post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = () => {
    if (!isAuthenticated) {
      // Prompt user to login
      return;
    }
    setIsLiked(!isLiked);
    // In a real app, you would send a request to your API
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      // Prompt user to login
      return;
    }
    setIsSaved(!isSaved);
    // In a real app, you would send a request to your API
  };

  const handleReport = () => {
    // Open report modal or redirect to report page
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="animate-pulse text-indigo-600 dark:text-indigo-400">
          Loading story...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-grow px-4 py-6 md:px-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Post Header */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <img
                src={post.author.profilePicture}
                alt={post.author.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <Link
                  to={`/profile/${post.author._id}`}
                  className="font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {post.author.username}
                </Link>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="mr-1 h-3 w-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag.toLowerCase()}`}
                  className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div
              className="prose dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${
                    isLiked
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <FiHeart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{isLiked ? post.likes + 1 : post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <FiMessageSquare className="h-5 w-5" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <FiShare2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full ${
                    isSaved
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <FiBookmark
                    className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={handleReport}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiAlertCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <CommentSection postId={postId} commentCount={post.comments} />
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-8">
          <RelatedPosts tags={post.tags} currentPostId={postId} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
