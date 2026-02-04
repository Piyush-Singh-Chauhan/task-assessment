import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Settings', path: '/settings',  },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gradient-to-b from-teal-500 to-emerald-600 text-white h-screen w-64 fixed left-0 top-0 shadow-2xl">
      {/* Logo/Header */}
      <div className="p-6 border-b border-teal-400">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <span className="text-2xl"></span>
          </div>
          <div>
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-teal-400">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="font-semibold">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name || 'User'}</p>
            <p className="text-teal-100 text-xs">Active User</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium mt-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

     

    </div>
  );
};

export default Sidebar;