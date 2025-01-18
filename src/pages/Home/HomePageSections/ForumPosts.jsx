import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown, Clock, User, Tag, ArrowRight, BookOpen, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const LatestForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/latestPostsForum`, {
          params: { limit: 6 },
        });
        setPosts(response.data.posts);
      } catch (err) {
        setError("Failed to load latest posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const CommunityLinks = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Explore Our Community</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {/* <Link
            to="/community/blog"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
          >
            <BookOpen className="w-4 h-4" />
            <span>Blog</span>
            <ArrowRight className="w-4 h-4" />
          </Link> */}
          <Link
            to="/community"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Forum</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <CommunityLinks />
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Latest Community Posts</h2>
        <Link 
          to="/community"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          View All Posts
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">{post.category}</span>
              </div>
              
              <Link
                to={`/forum/${post._id}`}
                // target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
              </Link>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content.slice(0, 100)}...
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{post.upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">{post.downvotes}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestForumPosts;