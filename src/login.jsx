import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ROUTES } from './utils/constants';
import './App.css';
import logoImg from './assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Accept any credentials for development
    // TODO: Replace with actual API call when backend is ready
    // Default credentials: admin@bookitall.com / admin
    if (email && password) {
      // Store login state using AuthContext
      login({ email }, null);
      navigate(ROUTES.DASHBOARD);
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

          <button type="submit" className="login-submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


