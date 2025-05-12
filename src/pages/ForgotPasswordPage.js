import React, { useState } from 'react';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from '../components/ui';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (error) {
      let errorMessage = 'Failed to reset password';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-tutorTeal/5 to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {loading && <LoadingSpinner message="Sending reset instructions..." />}
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-tutorTeal mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl mt-8">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}
          
          {message && (
            <Alert variant="success" className="mb-6">
              {message}
            </Alert>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              icon={<FaEnvelope className="h-5 w-5 text-gray-400" />}
              helpText="We'll send password reset instructions to this email"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              Send Reset Instructions
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate('/login')} 
            className="inline-flex items-center text-tutorTeal font-semibold hover:text-tutorTeal/80"
          >
            <FaArrowLeft className="mr-2" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;