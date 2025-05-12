import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/register" element={<RegisterPageWrapper />} />
        <Route path="/login" element={<LoginPageWrapper />} />
      </Routes>
    </Router>
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
  return <LoginPage navigateToRegister={() => navigate('/register')} />;
};

export default App;