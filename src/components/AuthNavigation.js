import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const AuthNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Courses', href: '/courses' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <nav className="bg-tutorTeal text-tutorWhite shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-extrabold text-tutorWhite">
                TutorMe
              </h1>
            </Link>
            <div className="hidden md:flex items-center ml-10 space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="text-tutorWhite hover:text-tutorGray transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-tutorWhite/20 flex items-center justify-center">
                    <FaUser className="text-tutorWhite" />
                  </div>
                  <span>{currentUser.displayName || 'User'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-tutorWhite py-1 px-3 rounded-full transition-colors flex items-center space-x-1"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-tutorWhite hover:text-tutorGray transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-tutorWhite text-tutorTeal font-semibold py-2 px-4 rounded-full hover:bg-tutorWhite/90 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-tutorWhite hover:text-tutorGray">
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-2 text-tutorWhite hover:text-tutorGray"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {currentUser ? (
              <div className="pt-4 border-t border-tutorWhite/20 mt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-tutorWhite/20 flex items-center justify-center">
                    <FaUser className="text-tutorWhite" />
                  </div>
                  <span>{currentUser.displayName || 'User'}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-tutorWhite hover:text-tutorGray flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t border-tutorWhite/20 mt-4">
                <Link
                  to="/login"
                  className="block py-2 text-tutorWhite hover:text-tutorGray"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="block mt-2 bg-tutorWhite text-tutorTeal font-semibold py-2 px-4 rounded-full hover:bg-tutorWhite/90 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthNavigation;