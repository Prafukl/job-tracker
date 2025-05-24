// src/component/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Crown,
  ChevronDown
} from 'lucide-react';
import '../Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
  
  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/joblist', label: 'Applications' },
    { path: '/notes', label: 'Notes' },
    { path: '/knowledge', label: 'Knowledge' },
    { path: '/tutorials', label: 'Tutorials' },
    { path: '/interview-prep', label: 'Interview Prep' },
  ];

  // Auto-open login modal when on the login page and not logged in
  useEffect(() => {
    if (location.pathname === '/login' && !currentUser && !showLoginModal && !showRegisterModal) {
      setShowLoginModal(true);
      setIsLoginForm(true);
    }
  }, [location.pathname, currentUser, showLoginModal, showRegisterModal]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-container')) {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMenuOpen(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsLoginForm(true);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    clearFields();
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setIsLoginForm(false);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
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
      setIsProfileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser && currentUser.email === 'admin@gmail.com';

  return (
    <>
      <header className="okta-header">
        <div className="header-container">
          {/* Logo */}
          <Link to={currentUser ? "/dashboard" : "/login"} className="logo-container">
            <div className="logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">JobTracker</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="desktop-navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="header-right">
            {currentUser ? (
              <>
                {/* User Greeting & Profile Menu */}
                <div className="user-section">
                  <span className="user-greeting">
                    Hello, {currentUser.displayName || 'User'}
                    {isAdmin && <Crown size={16} className="admin-icon" />}
                  </span>
                  <div className="profile-dropdown-container">
                    <button 
                      onClick={toggleProfileMenu}
                      className="profile-dropdown-trigger"
                      aria-expanded={isProfileMenuOpen}
                    >
                      <div className="profile-avatar">
                        {isAdmin ? <Crown size={16} /> : <User size={16} />}
                      </div>
                      <ChevronDown size={16} className={`dropdown-arrow ${isProfileMenuOpen ? 'open' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <div className="profile-dropdown-menu">
                        <div className="dropdown-header">
                          <div className="dropdown-user-info">
                            <div className="dropdown-name">
                              {currentUser.displayName || 'User'}
                            </div>
                            <div className="dropdown-email">{currentUser.email}</div>
                            {isAdmin && <div className="dropdown-role">Administrator</div>}
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout} className="dropdown-logout">
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={toggleMenu}
                  className="mobile-menu-btn"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation menu"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <>
                {/* Authentication Buttons */}
                <div className="auth-actions">
                  <button onClick={openLoginModal} className="btn-secondary">
                    Login
                  </button>
                  <button onClick={openRegisterModal} className="btn-primary">
                    Sign Up
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={toggleMenu}
                  className="mobile-menu-btn"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
            <div className="mobile-menu-content">
              {currentUser ? (
                <>
                  {/* Mobile User Info */}
                  <div className="mobile-user-info">
                    <div className="mobile-avatar">
                      {isAdmin ? <Crown size={20} /> : <User size={20} />}
                    </div>
                    <div className="mobile-user-details">
                      <div className="mobile-user-name">
                        {currentUser.displayName || 'User'}
                      </div>
                      <div className="mobile-user-email">{currentUser.email}</div>
                      {isAdmin && <div className="mobile-admin-tag">Administrator</div>}
                    </div>
                  </div>

                  <div className="mobile-menu-divider"></div>

                  {/* Mobile Navigation Links */}
                  <div className="mobile-nav-items">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mobile-menu-divider"></div>

                  {/* Mobile Sign Out */}
                  <button onClick={handleLogout} className="mobile-signout">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Auth Section */}
                  <div className="mobile-auth">
                    <div className="mobile-auth-header">
                      <h3>Welcome to JobTracker</h3>
                      <p>Access your job tracking dashboard</p>
                    </div>
                    <div className="mobile-auth-actions">
                      <button onClick={openLoginModal} className="mobile-btn-secondary">
                        Login
                      </button>
                      <button onClick={openRegisterModal} className="mobile-btn-primary">
                        Sign Up
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {(showLoginModal || showRegisterModal) && (
        <div className="auth-modal-overlay" onClick={closeModal}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={18} />
            </button>
            
            <div className="modal-content">
              <div className="modal-header">
                <h2>{isLoginForm ? 'Welcome Back' : 'Create Your Account'}</h2>
                <p>{isLoginForm ? 'Sign in to continue to JobTracker' : 'Join thousands of job seekers'}</p>
              </div>
              
              {error && <div className="alert alert-error">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              
              <form onSubmit={isLoginForm ? handleLogin : handleRegister} className="auth-form">
                {!isLoginForm && (
                  <div className="input-group">
                    <label htmlFor="displayName">Full Name</label>
                    <input 
                      type="text" 
                      id="displayName" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your full name" 
                      required 
                      className="form-control"
                    />
                  </div>
                )}
                
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    required 
                    className="form-control"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required 
                    className="form-control"
                  />
                </div>
                
                {!isLoginForm && (
                  <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password" 
                      required 
                      className="form-control"
                    />
                  </div>
                )}
                
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Processing...' : (isLoginForm ? 'Sign In' : 'Create Account')}
                </button>
              </form>
              
              <div className="auth-switch">
                <span>{isLoginForm ? "Don't have an account?" : "Already have an account?"}</span>
                <button type="button" onClick={switchForm} className="switch-link">
                  {isLoginForm ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;