import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gradient-to-r from-teal-500 to-teal-500 text-white p-4 flex-shrink-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Task Manager</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;