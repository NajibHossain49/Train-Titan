import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TbFidgetSpinner } from 'react-icons/tb';

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);

        if (response.data.success) {
          setSubscribers(response.data.users);
        } else {
          console.error("Failed to fetch subscribers.");
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError) {
      return (
        <div
          className="flex items-center justify-center bg-gray-200 rounded-full w-12 h-12 text-gray-600 font-semibold"
        >
          {getInitials(alt)}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className="w-12 h-12 rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">
      <TbFidgetSpinner className="w-16 h-16 animate-spin text-indigo-500" />
    </div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">All Newsletter Subscribers</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left border">Serial</th> {/* Added Serial column */}
              <th className="p-4 text-left border">Name</th>
              <th className="p-4 text-left border">Email</th>
              <th className="p-4 text-left border">Profile Picture</th>
              <th className="p-4 text-left border">Role</th>
              <th className="p-4 text-left border">Joined At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber, index) => (
              <tr key={subscriber._id} className="hover:bg-gray-50">
                <td className="p-4 border">{index + 1}</td> {/* Serial number based on index */}
                <td className="p-4 border">{subscriber.name}</td>
                <td className="p-4 border">{subscriber.email}</td>
                <td className="p-4 border">
                  <ImageWithFallback
                    src={subscriber.photoURL}
                    alt={subscriber.name}
                  />
                </td>
                <td className="p-4 border">{subscriber.role}</td>
                <td className="p-4 border">
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsletterSubscribers;