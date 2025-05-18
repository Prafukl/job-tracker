// src/component/Header.jsx
import React, { useState, useEffect } from 'react';
import '../Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { currentUser, login, register, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Auto-open login modal when on the login page and not logged in
  useEffect(() => {
    if (location.pathname === '/login' && !currentUser && !showLoginModal && !showRegisterModal) {
      setShowLoginModal(true);
      setIsLoginForm(true);
    }
  }, [location.pathname, currentUser, showLoginModal, showRegisterModal]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsLoginForm(true);
    setIsMenuOpen(false);
    clearFields();
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setIsLoginForm(false);
    setIsMenuOpen(false);
    clearFields();
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setError('');
    setSuccessMessage('');
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
    clearFields();
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    setSuccessMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return setError('Please fill in all fields');
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        closeModal();
        // Navigate to dashboard after successful login
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !displayName) {
      return setError('Please fill in all fields');
    }
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password, displayName);
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        closeModal();
        // Navigate to dashboard after successful registration
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">JobTrack</div>
          
          <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                          {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/joblist" onClick={() => setIsMenuOpen(false)}>Applications</Link>
                <Link to="/notes" onClick={() => setIsMenuOpen(false)}>Notes</Link>
                {/* <Link to="" onClick={() => setIsMenuOpen(false)}>Resources</Link> */}
              </>
            ) : (
              // Don't show navigation links to non-logged in users
              <></>
            )}
            
            <div className="auth-buttons">
              {currentUser ? (
                <>
                  <span style={{color: 'white', marginRight: '10px'}}>
                    Hello, {currentUser.displayName || 'User'}
                  </span>
                  <button className="login-btn" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button className="login-btn" onClick={openLoginModal}>Login</button>
                  <button className="register-btn" onClick={openRegisterModal}>Register</button>
                </>
              )}
            </div>
          </nav>
          
          <button 
            className={`menu-button ${isMenuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      {(showLoginModal || showRegisterModal) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <h2>{isLoginForm ? 'Login' : 'Register'}</h2>
            
            {error && <div className="error-message" style={{color: 'red', marginBottom: '15px'}}>{error}</div>}
            {successMessage && <div className="success-message" style={{color: 'green', marginBottom: '15px'}}>{successMessage}</div>}
            
            <form onSubmit={isLoginForm ? handleLogin : handleRegister}>
              {!isLoginForm && (
                <div className="form-group">
                  <label htmlFor="displayName">Name</label>
                  <input 
                    type="text" 
                    id="displayName" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  required 
                />
              </div>
              
              {!isLoginForm && (
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirm-password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password" 
                    required 
                  />
                </div>
              )}
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : (isLoginForm ? 'Login' : 'Register')}
              </button>
            </form>
            
            <div className="form-switch">
              {isLoginForm ? "Don't have an account?" : "Already have an account?"}
              <button type="button" onClick={switchForm}>
                {isLoginForm ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;