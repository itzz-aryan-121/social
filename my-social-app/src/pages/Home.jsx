import { useState, useEffect } from 'react';
import { posts } from '../services/api';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await posts.getAllPosts();
      setAllPosts(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchPosts}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <CreatePost onPostCreated={fetchPosts} />
      <div className="space-y-6 mt-8">
        {allPosts.map((post) => (
          <Post key={post._id} post={post} onUpdate={fetchPosts} />
        ))}
        {allPosts.length === 0 && (
          <p className="text-center text-gray-500">No posts yet. Be the first to share!</p>
        )}
      </div>
    </div>
  );
};

export default Home; 