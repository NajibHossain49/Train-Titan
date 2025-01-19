import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Users, Dumbbell, Calendar, DollarSign, 
  Mail, Clock, MessageSquare, Activity,
  Menu, X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'All Subscribers', path: '/dashboard/newsletter-subscribers', icon: Mail },
    { name: 'All Trainers', path: '/dashboard/allApprovedTrainers', icon: Users },
    { name: 'Applied Trainer', path: '/dashboard/applied-trainer', icon: Dumbbell },
    { name: 'Balance', path: '/dashboard/balance', icon: DollarSign },
    { name: 'Add New Class', path: '/dashboard/AddNewClass', icon: Calendar },
    { name: 'Manage Slots', path: '/dashboard/ManageSlots', icon: Clock },
    { name: 'Add New Slot', path: '/dashboard/addNewSlot', icon: Calendar },
    { name: 'Add New Forum', path: '/dashboard/ForumPage', icon: MessageSquare },
    { name: 'Activity Log', path: '/dashboard/activity-log', icon: Activity },
  ];

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
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transform transition-transform duration-300 ease-in-out fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto`}
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
        <nav className="p-4">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
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
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
            <img 
              src="/api/placeholder/32/32" 
              alt="Profile" 
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@fitnesspro.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;