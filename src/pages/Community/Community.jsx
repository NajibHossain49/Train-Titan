import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User, Tag } from 'lucide-react';

const Community = () => {
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

            {/* Display Posts */}
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
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {post.author}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(post.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <span className="flex items-center">
                                <Tag className="w-4 h-4 mr-1" />
                                {post.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
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
