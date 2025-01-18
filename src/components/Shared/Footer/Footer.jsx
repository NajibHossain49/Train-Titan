import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Heart,
  Dumbbell,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const socialLinks = [
    {
      Icon: Facebook,
      gradient: "hover:bg-blue-600",
      href: "https://www.facebook.com",
    },
    {
      Icon: Twitter,
      gradient: "hover:bg-sky-500",
      href: "https://www.twitter.com",
    },
    {
      Icon: Instagram,
      gradient: "hover:bg-pink-600",
      href: "https://www.instagram.com",
    },
    {
      Icon: Linkedin,
      gradient: "hover:bg-blue-700",
      href: "https://www.linkedin.com/in/md-najib-hossain/",
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "All Trainers", path: "/allTrainer" },
    { name: "All Classes", path: "/allClasses" },
    { name: "Our Community", path: "/community" },

  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter submission
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-br from-gray-600 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Dumbbell className="w-8 h-8 text-blue-400 animate-spin-slow" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Train-Titan
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              Train Hard, Live Strong. Your journey to fitness begins here. 🏋️‍♀️💪
            </p>
            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition duration-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-transparent bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center space-x-2">
                <span className="text-gray-400">📞</span>
                <span>+1 (800) 123-4567</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-gray-400">📧</span>
                <span>info@traintitan.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-gray-400">🏠</span>
                <span>123 Fitness Blvd, Healthy City</span>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, gradient, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full transition-all duration-300 ${gradient} group`}
                >
                  <Icon className="w-5 h-5 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 Train-Titan. All rights reserved.
            </p>
            <div className="flex items-center mt-4 sm:mt-0">
              <Heart className="w-4 h-4 text-red-500 animate-pulse mr-2" />
              <p className="text-sm text-gray-400">
                Strength. Resilience. Results. 💪
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;