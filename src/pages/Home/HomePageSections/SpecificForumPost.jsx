import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Tag, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Share2,
  MessageCircle,
  Bookmark
} from "lucide-react";

const SpecificForumPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/forum/${id}`);
        setPost(response.data.post);
      } catch (err) {
        setError("Failed to fetch the post. Please try again later.");
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Category and Timestamp */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
          <Tag className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">{post.category}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {new Date(post.timestamp).toLocaleDateString()} at{" "}
            {new Date(post.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-r from-blue-400 to-indigo-400 w-12 h-12 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {post.author.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{post.author}</h3>
          <p className="text-sm text-gray-500">Community Member</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </div>

      {/* Engagement Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Voting */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span className="font-medium">{post.upvotes}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
              <ThumbsDown className="w-5 h-5" />
              <span className="font-medium">{post.downvotes}</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Comment</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bookmark className="w-5 h-5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificForumPost;