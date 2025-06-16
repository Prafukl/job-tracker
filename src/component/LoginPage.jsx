// src/component/LoginPage.jsx - Dedicated Login Component
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { currentUser, login, register } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/app/dashboard');
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 1000);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.displayName);
        setSuccess('Account created successfully! You can now log in.');
        setIsLoginMode(true);
        setFormData({
          email: formData.email,
          password: '',
          confirmPassword: '',
          displayName: ''
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
    setFormData({
      email: formData.email,
      password: '',
      confirmPassword: '',
      displayName: ''
    });
  };

  //const fillDemoCredentials = () => {
    //setFormData({
     // ...formData,
     // email: 'demo@itsupporthub.org',
     // password: 'demo123'
    //});
  //};

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '3rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            textDecoration: 'none'
          }}>
            <span>🛠️</span>
            <span>IT Support Hub</span>
          </Link>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700', 
            color: '#1e293b', 
            marginBottom: '0.5rem' 
          }}>
            {isLoginMode ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p style={{ color: '#64748b' }}>
            {isLoginMode 
              ? 'Sign in to access your IT management dashboard' 
              : 'Create your account to start managing IT operations'
            }
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            background: '#dcfce7',
            color: '#166534',
            border: '1px solid #bbf7d0'
          }}>
            ✓ {success}
          </div>
        )}
        
        {error && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca'
          }}>
            ✗ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {!isLoginMode && (
            <input
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Full Name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                marginBottom: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required={!isLoginMode}
            />
          )}

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              marginBottom: '1rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            required
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              marginBottom: '1rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            required
          />

          {!isLoginMode && (
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                marginBottom: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required={!isLoginMode}
            />
          )}

          <button 
            type="submit" 
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Switch Mode */}
        <div style={{ textAlign: 'center', color: '#64748b', marginBottom: '1.5rem' }}>
          <span>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            type="button" 
            onClick={switchMode} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3b82f6', 
              fontWeight: '600', 
              cursor: 'pointer', 
              marginLeft: '0.5rem' 
            }}
          >
            {isLoginMode ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        {/* Demo Access */}
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '1.5rem',
          textAlign: 'center' 
        }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: '#64748b', 
            marginBottom: '0.75rem'
          }}>
            Try our platform instantly
          </div>
          <button 
            type="button" 
            onClick={fillDemoCredentials}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            <span>🚀</span>
            <span>Use Demo Account</span>
          </button>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#9ca3af',
            lineHeight: '1.4'
          }}>
            Full access to IT monitoring, tickets, and analytics
          </div>
        </div>

        {/* Back to Landing */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#64748b', 
              fontSize: '0.875rem', 
              textDecoration: 'none' 
            }}
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;