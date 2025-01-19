import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User, Tag, Loader } from 'lucide-react';

const ForumPage = () => {
    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        category: 'general',
        author: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/postsForum`);
            // Ensure we're setting an array
            setPosts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/postsForum`, {
                ...newPost,
                timestamp: new Date().toISOString()
            });

            if (response.status === 200 || response.status === 201) {
                setMessage('Post created successfully!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                setNewPost({
                    title: '',
                    content: '',
                    category: 'general',
                    author: ''
                });
                fetchPosts();
            } else {
                setMessage('Error creating post.');
            }
        } catch (error) {
            setMessage('Error submitting post.');
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700">Loading forum...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    Fitness Forum
                </h1>

                {/* Toast Notification */}
                {showToast && (
                    <div className="fixed top-4 right-4 z-50">
                        <div className="bg--indigo-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 ease-out">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{message}</span>
                        </div>
                    </div>
                )}

                {/* Create Post Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={newPost.author}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={newPost.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                >
                                    <option value="general">General Discussion</option>
                                    <option value="workout">Workout Routines</option>
                                    <option value="nutrition">Nutrition</option>
                                    <option value="motivation">Motivation</option>
                                    <option value="progress">Progress Updates</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newPost.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                placeholder="Post title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Content
                            </label>
                            <textarea
                                name="content"
                                value={newPost.content}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 min-h-[200px]"
                                placeholder="Write your post here..."
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-200 transform hover:-translate-y-1 font-semibold text-lg shadow-md"
                        >
                            Create Post
                        </button>
                    </form>
                </div>

                {/* Display Posts */}
                {/* <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Posts</h2>
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                                        {post.title}
                                    </h3>
                                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {post.category}
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {post.content}
                                </p>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-indigo-500 space-y-2 sm:space-y-0">
                                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                                        <span className="flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            {post.author}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {new Date(post.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="flex items-center">
                                        <Tag className="w-4 h-4 mr-2" />
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-white rounded-xl shadow-md">
                            <p className="text-gray-600">No posts available. Be the first to create a post!</p>
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default ForumPage;