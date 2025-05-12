import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const LoginPage = ({ navigateToRegister }) => {
  return (
    <div className="min-h-screen bg-tutorWhite flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-tutorTeal mb-4">Login to TutorMe</h1>
        <p className="text-lg text-gray-600 mb-6">Access your personalized tutoring sessions.</p>
        <button
          onClick={navigateToRegister}
          className="bg-tutorTeal text-tutorWhite font-semibold py-3 px-8 rounded-full hover:bg-tutorTeal/80 transition-all duration-300 shadow-md flex items-center space-x-2 mx-auto"
        >
          <span>Go to Register</span>
          <FaArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LoginPage;