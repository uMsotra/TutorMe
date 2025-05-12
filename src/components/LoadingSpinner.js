import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-tutorTeal border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;