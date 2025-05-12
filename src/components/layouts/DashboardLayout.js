import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSignOutAlt, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import LoadingSpinner from '../LoadingSpinner';

const DashboardLayout = ({ children, title, navItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, userData, userRole, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-tutorTeal text-white">
          <h1 className="text-2xl font-bold">TutorMe</h1>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-tutorTeal/10 rounded-full flex items-center justify-center">
              <FaUserCircle className="w-6 h-6 text-tutorTeal" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{userData?.fullName || currentUser?.displayName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.onClick()}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'bg-tutorTeal text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-gray-600"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TutorMe. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;