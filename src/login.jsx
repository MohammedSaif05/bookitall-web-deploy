import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './contexts/AuthContext';
import { ROUTES } from './utils/constants';
import { loginAdmin } from './api/auth';
import './App.css';
import logoImg from './assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await loginAdmin(email, password);

      if (response.success && response.data) {
        const { admin, message } = response.data;
        
        // Store admin data and login state
        login(
          {
            id: admin._id,
            email: admin.email,
          },
          null // Token if provided in response
        );

        toast.success(message || 'Login successful!');
        
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 500);
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Handle error response
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'An error occurred during login. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-logo-wrapper">
        <div className="brand-logo">
          <img src={logoImg} alt="Bookitall logo" className="brand-logo-img" />
        </div>
      </div>

      <div className="login-card">
        <h1 className="login-title">Sign In</h1>
        <p className="login-subtitle">Please enter your login details</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-extra">
            <label className="login-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <button 
            type="submit" 
            className={`login-submit ${loading ? 'login-submit-loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


