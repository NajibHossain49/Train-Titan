import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User, Tag, ThumbsUp, ThumbsDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Community = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const fetchPosts = async (page) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/postsForum`, {
                params: { page, limit: 6 }
            });

            setPosts(response.data.posts);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleVote = async (postId, voteType) => {


        // Check if user is logged in
        if (!user || !user.email) {
            toast.error('You need to log in to vote!');
            return;
        }

        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/postsForum/${postId}/vote`, {
                voteType,
                userEmail: user.email,
            });



            setPosts(currentPosts =>
                currentPosts.map(post => {
                    if (post._id === postId) {
                        const updatedPost = {
                            ...post,
                            upvotes: voteType === 'upvote'
                                ? (post.upvotes || 0) + 1
                                : (post.upvotes || 0),
                            downvotes: voteType === 'downvote'
                                ? (post.downvotes || 0) + 1
                                : (post.downvotes || 0)
                        };

                        return updatedPost;
                    }
                    return post;
                })
            );
        } catch (error) {
            console.error(`Error voting for Post ID: ${postId}`, error);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Community Forum
            </h1>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Recent Posts</h2>
                {posts.map(post => (
                    <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {post.title}
                            </h3>
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                {post.category}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {post.author}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(post.timestamp).toLocaleString()}
                                </span>
                                <span className="flex items-center">
                                    <Tag className="w-4 h-4 mr-1" />
                                    {post.category}
                                </span>
                            </div>

                            {/* Voting Section */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleVote(post._id, 'upvote')}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>{post.upvotes || 0}</span>
                                </button>
                                <button
                                    onClick={() => handleVote(post._id, 'downvote')}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>{post.downvotes || 0}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-gray-200 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-gray-200 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Community;