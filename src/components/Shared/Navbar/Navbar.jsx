import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import {
  Home,
  BookOpen,
  PlusCircle,
  LogOut,
  Menu,
  User,
  Globe,
  X,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logOut();
  };

  // Base navigation links that are always visible
  const baseNavLinks = [
    {
      path: "/",
      label: "Home",
      icon: <Home className="mr-2" size={20} />,
    },
    {
      path: "/allTrainer",
      label: "All Trainer",
      icon: <Globe className="mr-2" size={20} />,
    },
    {
      path: "/allClasses",
      label: "All Classes",
      icon: <PlusCircle className="mr-2" size={20} />,
    },
    {
      path: "/community",   
      label: "Forum",
      icon: <MessageCircle className="mr-2" size={20} />,  
    },
  ];

  // Additional links for logged-in users
  const authenticatedLinks = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2" size={20} />,
    },
    {
      path: "/profile",    
      label: "User Profile",
      icon: <User className="mr-2" size={20} />, 
    },
  ];

  // Combine links based on authentication status
  const NavLinks = user ? [...baseNavLinks, ...authenticatedLinks] : baseNavLinks;

  return (
    <nav className="bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative Wave Background */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 opacity-80"></div>

        <div className="flex items-center justify-between h-20 relative z-20">
          {/* Logo Section with Unique Design */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-600 p-2 rounded-full mr-3 group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out">
                <BookOpen className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-indigo-500 group-hover:to-purple-600 transition-colors duration-500">
                Train-Titan
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Large Screens) */}
          <div className="hidden lg:flex space-x-4 items-center">
            {NavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-lg flex items-center transition-all duration-300 ease-in-out hover:bg-blue-50 hover:shadow-md active"
                    : "text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg flex items-center transition-all duration-300 ease-in-out hover:bg-blue-50 hover:shadow-md"
                }
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Section for Large Screens */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="relative">
                    <img
                      src={
                        user.photoURL ||
                        "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
                      }
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400 ring-offset-2 group-hover:ring-4 transition-all duration-300"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="absolute z-10 left-1/2 transform -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm p-2 rounded-md shadow-lg whitespace-nowrap transition-opacity duration-300">
                    {user.displayName || user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-full flex items-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <LogOut className="mr-2" size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-2 rounded-full flex items-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <User className="mr-2" size={20} />
                  Login
                </Link>
                <Link
                  to="/Signup"
                  className="text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-4 py-2 rounded-full flex items-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <PlusCircle className="mr-2" size={20} />
                  SignUp
                </Link>
              </div>
            )}
          </div>

          {/* Menu Button for MD and Smaller Screens */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none transition-transform duration-300 transform hover:scale-110"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Menu for MD and Smaller Screens */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto pb-20">
          <div className="px-4 pt-6">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <Link
                to="/"
                className="flex items-center group"
                onClick={toggleMenu}
              >
                <div className="bg-gradient-to-r from-cyan-400 to-blue-600 p-2 rounded-full mr-3">
                  <BookOpen className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Train-Titan
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              {NavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-800 hover:bg-blue-50 block px-4 py-3 rounded-lg flex items-center text-lg transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              {user ? (
                <div>
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        user.photoURL ||
                        "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
                      }
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400 mr-4"
                    />
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        {user.displayName || user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-3 rounded-full flex items-center justify-center"
                  >
                    <LogOut className="mr-3" size={20} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="block w-full text-center text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-3 rounded-full"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/Signup"
                    className="block w-full text-center text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-4 py-3 rounded-full"
                    onClick={toggleMenu}
                  >
                    SignUp
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;