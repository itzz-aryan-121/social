// pages/HomePage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { postsApi } from '../services/api';
import Post from '../components/Post';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest");
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsApi.getAll();
      // Ensure posts is always an array
      const postsData = response.data;
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postsApi.like(postId);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: [...post.likes, user._id] }
          : post
      ));
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await postsApi.unlike(postId);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: post.likes.filter(id => id !== user._id) }
          : post
      ));
    } catch (error) {
      toast.error('Failed to unlike post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Posts</h1>
        <Link
          to="/create-post"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Post
              key={post._id}
              post={post}
              onLike={() => handleLike(post._id)}
              onUnlike={() => handleUnlike(post._id)}
              isLiked={post.likes.includes(user._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
