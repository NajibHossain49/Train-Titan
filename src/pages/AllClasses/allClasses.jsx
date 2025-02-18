import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllClassesSection = () => {
  const navigate = useNavigate();
  const [hoveredTrainer, setHoveredTrainer] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const endpoint = searchQuery
          ? `${import.meta.env.VITE_API_URL}/classes/search`
          : `${import.meta.env.VITE_API_URL}/classes`;
        
        const response = await axios.get(endpoint, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            query: searchQuery
          }
        });

        if (response.data.success) {
          setClasses(response.data.classes);
          setTotalPages(Math.ceil(response.data.total / itemsPerPage));
        }
      } catch (err) {
        setError('Failed to fetch classes. Please try again later.');
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to search
    const timeoutId = setTimeout(() => {
      fetchClasses();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    setIsSearching(!!e.target.value);
  };

  const handleTrainerClick = (trainerId) => {
    navigate(`/trainer/${trainerId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-6 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-700 hover:text-gray-900 hover:border-gray-300 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>
    );

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-300"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-2">
            •••
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-full transition-all duration-300 ${
            currentPage === i
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-2">
            •••
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 rounded-full hover:bg-gray-50 border border-gray-200 transition-all duration-300"
        >
          {totalPages}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-6 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-700 hover:text-gray-900 hover:border-gray-300 flex items-center gap-2"
      >
        <span>Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return buttons;
  };

  return (
    <div className="px-4 py-8 md:px-6 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            All Classes
          </h2>
          
          {/* Search Input */}
          <div className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full md:w-64 px-4 py-2 pr-10 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {classes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, classes.length * totalPages)} of {classes.length * totalPages} classes
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-xl text-red-600 bg-red-50 px-6 py-4 rounded-lg">
              {error}
            </div>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-gray-600">
              {isSearching
                ? `No classes match "${searchQuery}"`
                : "No classes are currently available"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={classItem.image}
                      alt={classItem.className}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {classItem.className}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {classItem.details}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Class Trainers
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {classItem.trainer.flat().map((trainer) => (
                          <div
                            key={trainer.id}
                            className="relative group/trainer"
                            onMouseEnter={() => setHoveredTrainer(trainer.id)}
                            onMouseLeave={() => setHoveredTrainer(null)}
                            onClick={() => handleTrainerClick(trainer.id)}
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 group-hover/trainer:border-blue-500 transition-all duration-300 cursor-pointer">
                              <img
                                src={trainer.profile.image}
                                alt={trainer.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {hoveredTrainer === trainer.id && (
                              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap z-10 shadow-lg">
                                {trainer.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-3 flex-wrap">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllClassesSection;