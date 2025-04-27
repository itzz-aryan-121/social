import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, onLike, onUnlike, isLiked }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Link to={`/profile/${post.author._id}`} className="flex items-center">
            <img
              src={post.author.avatar || '/default-avatar.png'}
              alt={post.author.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{post.author.username}</h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </Link>
        </div>

        <Link to={`/posts/${post._id}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.content}</p>
        </Link>

        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={isLiked ? onUnlike : onLike}
              className={`flex items-center space-x-1 ${
                isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill={isLiked ? 'currentColor' : 'none'}
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
              <span>{post.likes.length}</span>
            </button>
            <Link
              to={`/posts/${post._id}`}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              <span>{post.comments.length}</span>
            </Link>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post; 