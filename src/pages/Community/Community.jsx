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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const fetchPosts = async (page) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/postsForum`, {
                params: { page, limit: 6 }
            });

            setPosts(response.data.posts);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVote = async (postId, voteType) => {
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 text-center">
                Community Forum
            </h1>

            <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Recent Posts</h2>
                <div className="grid gap-6">
                    {posts.map(post => (
                        <div key={post._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-grow">
                                    {post.title}
                                </h3>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm whitespace-nowrap">
                                    {post.category}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">
                                {post.content}
                            </p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <User className="w-4 h-4 mr-1" />
                                        <span className="truncate max-w-[150px]">{post.author}</span>
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
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto bg-gray-200 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto bg-gray-200 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Community;