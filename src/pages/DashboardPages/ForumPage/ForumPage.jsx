import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User, Tag } from 'lucide-react';

const ForumPage = () => {
    const [posts, setPosts] = useState([]);
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
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Fitness Forum
            </h1>

            {/* Create Post Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6">Create New Post</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={newPost.author}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={newPost.category}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="general">General Discussion</option>
                            <option value="workout">Workout Routines</option>
                            <option value="nutrition">Nutrition</option>
                            <option value="motivation">Motivation</option>
                            <option value="progress">Progress Updates</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={newPost.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={newPost.content}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                        ></textarea>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Create Post
                    </button>
                </form>
                {message && (
                    <div className="mt-4 p-4 rounded-md bg-green-50 text-green-800">
                        {message}
                    </div>
                )}
            </div>

            {/* Display Posts */}
            {/* <div className="space-y-6">
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
            </div> */}
        </div>
    );
};

export default ForumPage;
