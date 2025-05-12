import React, { useState } from 'react';
import SocialMediaLinks from '../components/SocialMediaLinks';

import { FaArrowRight, FaBars, FaTimes, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const LandingPage = ({ navigateToLogin, navigateToRegister }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Register', href: '/register' },
    { name: 'Support', href: '#support' },
  ];

  return (
    <div className="min-h-screen bg-tutorWhite flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-tutorTeal to-teal-600 text-tutorWhite shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl md:text-3xl font-extrabold text-tutorWhite">
          TutorMe
        </h1>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-tutorWhite hover:text-tutorTeal/80 transition-all duration-300">
              {link.name}
            </a>
          ))}
          <SocialMediaLinks />
          <button
            onClick={navigateToLogin}
            className="text-tutorWhite hover:text-tutorTeal/80 transition-all duration-300"
          >
            Log In
          </button>
          <button
            onClick={navigateToRegister}
            className="bg-tutorWhite text-tutorTeal font-semibold py-2 px-4 rounded-full hover:bg-tutorWhite/90 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-tutorWhite hover:text-tutorTeal/80">
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-tutorTeal text-tutorWhite py-4">
          <div className="container mx-auto px-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 text-tutorWhite hover:text-tutorTeal/80 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col items-start space-y-2 pt-4">
              <a href="https://facebook.com/tutorme" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 py-2 text-tutorWhite hover:text-tutorTeal/80">
                <FaFacebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a href="https://twitter.com/tutorme" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 py-2 text-tutorWhite hover:text-tutorTeal/80">
                <FaTwitter className="w-5 h-5" />
                <span>Twitter</span>
              </a>
              <a href="https://instagram.com/tutorme" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 py-2 text-tutorWhite hover:text-tutorTeal/80">
                <FaInstagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <button
                onClick={() => {
                  navigateToLogin();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-tutorWhite hover:text-tutorTeal/80"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  navigateToRegister();
                  setIsMenuOpen(false);
                }}
                className="block w-full bg-tutorWhite text-tutorTeal font-semibold py-2 px-4 rounded-full hover:bg-tutorWhite/90 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center py-12 bg-gradient-to-b from-tutorTeal/10 to-tutorWhite">
        <div className="text-center max-w-3xl mx-4 p-8 rounded-xl shadow-lg bg-tutorWhite">
          <h1 className="text-4xl md:text-5xl font-extrabold text-tutorTeal mb-4 tracking-tight">
            Welcome to TutorMe
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
            Empowering Lesotho learners with personalized tutoring and resources to succeed since 2019.
          </p>
          <button
            onClick={navigateToRegister}
            className="bg-tutorTeal text-tutorWhite font-semibold py-3 px-8 rounded-full hover:bg-tutorTeal/80 transition-all duration-300 shadow-md flex items-center space-x-2 mx-auto"
          >
            <span>Join TutorMe</span>
            <FaArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>


      {/* Footer */}
      <footer className="bg-tutorTeal text-tutorWhite text-center py-6">
        <p className="text-sm mb-2">
          © 2025 <span className="font-bold">TutorMe</span>. All rights reserved.
        </p>
        <a href="mailto:support@tutorme.com" className="text-tutorGray hover:text-tutorWhite transition">
          Contact Us
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;