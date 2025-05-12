import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoadingPage from './components/LoadingSpinner';

// Wrapper for routes that need authentication
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingPage message="Checking authentication status..." />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Router guard that checks user role
const RoleRoute = ({ children, allowedRole }) => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!loading && userRole) {
      if (userRole !== allowedRole) {
        // Redirect to the appropriate dashboard
        navigate(`/${userRole}-dashboard`);
      }
    }
  }, [userRole, loading, allowedRole, navigate]);
  
  if (loading) {
    return <LoadingPage message="Verifying permissions..." />;
  }
  
  if (!userRole || userRole !== allowedRole) {
    return null; // This will be handled by the useEffect redirect
  }
  
  return children;
};

// Component to redirect based on user role
const DashboardRouter = () => {
  const { userRole, loading } = useAuth();
  
  if (loading) {
    return <LoadingPage message="Loading dashboard..." />;
  }
  
  if (userRole) {
    if (userRole === 'student') {
      return <Navigate to="/student-dashboard" />;
    } else if (userRole === 'tutor') {
      return <Navigate to="/tutor-dashboard" />;
    }
  }
  
  // Default fallback
  return <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPageWrapper />} />
          <Route path="/register" element={<RegisterPageWrapper />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          } />
          <Route 
            path="/student-dashboard/*" 
            element={
              <PrivateRoute>
                <RoleRoute allowedRole="student">
                  <StudentDashboard />
                </RoleRoute>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tutor-dashboard/*" 
            element={
              <PrivateRoute>
                <RoleRoute allowedRole="tutor">
                  <TutorDashboard />
                </RoleRoute>
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const LandingPageWrapper = () => {
  const navigate = useNavigate();
  return <LandingPage navigateToLogin={() => navigate('/login')} navigateToRegister={() => navigate('/register')} />;
};

const RegisterPageWrapper = () => {
  const navigate = useNavigate();
  return <RegisterPage navigateToLogin={() => navigate('/login')} />;
};

const LoginPageWrapper = () => {
  const navigate = useNavigate();
  return <LoginPage 
    navigateToRegister={() => navigate('/register')} 
    navigateToForgotPassword={() => navigate('/forgot-password')}
  />;
};

export default App;