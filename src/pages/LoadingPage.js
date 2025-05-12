import React from 'react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tutorTeal/5 to-gray-50 flex flex-col items-center justify-center">
      <div className="w-24 h-24 relative">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-tutorTeal/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-tutorTeal rounded-full animate-spin"></div>
      </div>
      <h2 className="mt-8 text-xl font-semibold text-gray-700">Loading TutorMe...</h2>
      <p className="mt-2 text-gray-500">Please wait while we prepare your experience</p>
    </div>
  );
};

export default LoadingPage;