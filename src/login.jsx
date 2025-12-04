import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logoImg from "./assets/logo.png"; // TEMP: replace with your real logo path

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default login credentials
    const defaultEmail = "admin@bookitall.com";
    const defaultPassword = "admin";
    
    // Accept default credentials or any credentials for development
    if (email && password) {
      // Store login state (simple approach)
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
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


