import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Dumbbell,
  Calendar,
  DollarSign,
  Mail,
  Clock,
  MessageSquare,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (user?.email) {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${user.email}`);
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user'); // Default to user role if fetch fails
      }
    };

    fetchUserRole();
  }, [user?.email]);

  const adminRoutes = [
    {
      name: 'All Subscribers',
      path: '/dashboard/newsletter-subscribers',
      icon: Mail,
    },
    {
      name: 'All Trainers',
      path: '/dashboard/allApprovedTrainers',
      icon: Users,
    },
    {
      name: 'Applied Trainer',
      path: '/dashboard/applied-trainer',
      icon: Dumbbell,
    },
    {
      name: 'Balance',
      path: '/dashboard/balance',
      icon: DollarSign,
    },
    {
      name: 'Add New Class',
      path: '/dashboard/AddNewClass',
      icon: Calendar,
    },
  ];

  const trainerRoutes = [
    {
      name: 'Manage Slots',
      path: '/dashboard/ManageSlots',
      icon: Clock,
    },
    {
      name: 'Add New Slot',
      path: '/dashboard/addNewSlot',
      icon: Calendar,
    },
  ];

  const sharedAdminTrainerRoutes = [
    {
      name: 'Add New Forum',
      path: '/dashboard/ForumPage',
      icon: MessageSquare,
    },
  ];

  const userRoutes = [
    {
      name: 'Activity Log',
      path: '/dashboard/activity-log',
      icon: Activity,
    },
    {
      name: 'Profile Page',
      path: '/dashboard/profile',
      icon: Users,
    },
    {
      name: 'Booked Trainer',
      path: '/dashboard/booked-trainer',
      icon: Dumbbell,
    },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [...adminRoutes, ...sharedAdminTrainerRoutes];
      case 'trainer':
        return [...trainerRoutes, ...sharedAdminTrainerRoutes];
      case 'user':
        return userRoutes;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">Train-Titan</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link to="/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
              <img
                src={user?.photoURL || "/api/placeholder/32/32"}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;