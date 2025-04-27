import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { posts, comments } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await posts.likePost(post._id);
      onUpdate();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await comments.addComment(post._id, commentText);
      setCommentText('');
      setIsCommenting(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center mb-4">
        <img
          src={post.author.profilePicture || '/default-avatar.png'}
          alt={post.author.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <Link
            to={`/profile/${post.author._id}`}
            className="font-semibold text-gray-800 hover:text-blue-600"
          >
            {post.author.username}
          </Link>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="w-full rounded-lg mb-4"
        />
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            post.likes.includes(user._id)
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{post.likes.length}</span>
        </button>

        <button
          onClick={() => setIsCommenting(!isCommenting)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{post.comments.length}</span>
        </button>
      </div>

      {isCommenting && (
        <form onSubmit={handleComment} className="mt-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setIsCommenting(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Comment
            </button>
          </div>
        </form>
      )}

      {showComments && post.comments.length > 0 && (
        <div className="mt-4 space-y-4">
          {post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3">
              <img
                src={comment.author.profilePicture || '/default-avatar.png'}
                alt={comment.author.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Link
                    to={`/profile/${comment.author._id}`}
                    className="font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {comment.author.username}
                  </Link>
                  <p className="text-gray-800">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {post.comments.length > 0 && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="mt-4 text-sm text-gray-600 hover:text-blue-600"
        >
          {showComments ? 'Hide comments' : 'Show comments'}
        </button>
      )}
    </div>
  );
};

export default Post; 