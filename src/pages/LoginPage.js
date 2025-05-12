import React, { useState } from 'react';
import { FaArrowRight, FaEnvelope, FaLock, FaFacebook, FaTwitter, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button, Input, Checkbox, Alert } from '../components/ui';

const LoginPage = ({ navigateToRegister, navigateToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await login(formData.email, formData.password);
      
      // We'll redirect to the dashboard route, which will handle role-based routing
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = 'Failed to sign in';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-tutorTeal/5 to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {loading && <LoadingSpinner message="Signing you in..." />}
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-tutorTeal mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Log in to access your personalized learning experience</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl mt-8">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              icon={<FaEnvelope className="h-5 w-5 text-gray-400" />}
            />
            
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={<FaLock className="h-5 w-5 text-gray-400" />}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                label="Remember me"
              />

              <button 
                type="button" 
                onClick={navigateToForgotPassword}
                className="text-sm font-medium text-tutorTeal hover:text-tutorTeal/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={<FaArrowRight />}
            >
              Sign in
            </Button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaFacebook className="h-5 w-5 text-blue-600" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaTwitter className="h-5 w-5 text-blue-400" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button onClick={navigateToRegister} className="text-tutorTeal font-semibold hover:text-tutorTeal/80 transition-colors">
              Register now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;