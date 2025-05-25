// src/component/Header.jsx - Enhanced with Okta-style dropdowns
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Crown,
  ChevronDown,
  BookOpen,
  Target,
  FileText,
  Briefcase,
  BarChart3,
  Lightbulb,
  Play,
  Calendar,
  Settings,
  HelpCircle
} from 'lucide-react';
import '../Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
  
  // Enhanced navigation items with categories and dropdowns
  const navigationCategories = {
    'Applications': {
      icon: <Briefcase size={16} />,
      items: [
        {
          path: '/joblist',
          label: 'All Applications',
          description: 'View and manage all your job applications',
          icon: <FileText size={16} />
        }
      ]
    },
    'Learning': {
      icon: <BookOpen size={16} />,
      items: [
        {
          path: '/tutorials',
          label: 'Video Tutorials',
          description: 'Watch helpful career development videos',
          icon: <Play size={16} />
        },
        {
          path: '/knowledge',
          label: 'Knowledge Tools',
          description: 'Access useful career tools and resources',
          icon: <Lightbulb size={16} />
        },
        {
          path: '/interview-prep',
          label: 'Interview Prep',
          description: 'Practice with custom question sets',
          icon: <Target size={16} />
        }
      ]
    },
    'Organization': {
      icon: <Calendar size={16} />,
      items: [
        {
          path: '/notes',
          label: 'Notes',
          description: 'Keep track of important information',
          icon: <FileText size={16} />
        }
      ]
    }
  };

  // Navigation items that don't need dropdowns
  const simpleNavItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <BarChart3 size={16} /> 
    }
  ];

  // Auto-open login modal when on the login page and not logged in
  useEffect(() => {
    if (location.pathname === '/login' && !currentUser && !showLoginModal && !showRegisterModal) {
      setShowLoginModal(true);
      setIsLoginForm(true);
    }
  }, [location.pathname, currentUser, showLoginModal, showRegisterModal]);

  // Close menus when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-container')) {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (categoryName) => {
    setActiveDropdown(activeDropdown === categoryName ? null : categoryName);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsLoginForm(true);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setActiveDropdown(null);
    clearFields();
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setIsLoginForm(false);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setActiveDropdown(null);
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
      setActiveDropdown(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser && currentUser.email === 'admin@gmail.com';

  // Check if current path is active for dropdown items
  const isPathActive = (path) => location.pathname === path;
  const isCategoryActive = (category) => {
    return category.items.some(item => location.pathname === item.path);
  };

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

          {/* Desktop Navigation with Dropdowns */}
          {currentUser && (
            <nav className="desktop-navigation">
              {/* Simple nav items */}
              {simpleNavItems.map((item) => {
                const isActive = isPathActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveDropdown(null)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Dropdown categories */}
              {Object.entries(navigationCategories).map(([categoryName, category]) => {
                const isActive = isCategoryActive(category);
                const isDropdownOpen = activeDropdown === categoryName;
                
                return (
                  <div key={categoryName} className="nav-dropdown-container">
                    <button
                      className={`nav-dropdown-trigger ${isActive ? 'active' : ''} ${isDropdownOpen ? 'open' : ''}`}
                      onClick={() => handleDropdownToggle(categoryName)}
                      onMouseEnter={() => setActiveDropdown(categoryName)}
                    >
                      {category.icon}
                      <span>{categoryName}</span>
                      <ChevronDown size={14} className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div 
                        className="nav-dropdown-menu"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="dropdown-content">
                          {category.items.map((item) => {
                            const isItemActive = isPathActive(item.path);
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className={`dropdown-item ${isItemActive ? 'active' : ''}`}
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className="dropdown-item-icon">
                                  {item.icon}
                                </div>
                                <div className="dropdown-item-content">
                                  <div className="dropdown-item-title">{item.label}</div>
                                  <div className="dropdown-item-description">{item.description}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
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
                    {/* Simple nav items */}
                    {simpleNavItems.map((item) => {
                      const isActive = isPathActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    {/* Category sections */}
                    {Object.entries(navigationCategories).map(([categoryName, category]) => (
                      <div key={categoryName} className="mobile-nav-category">
                        <div className="mobile-nav-category-header">
                          {category.icon}
                          <span>{categoryName}</span>
                        </div>
                        <div className="mobile-nav-category-items">
                          {category.items.map((item) => {
                            const isActive = isPathActive(item.path);
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className={`mobile-nav-item mobile-nav-sub-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {item.icon}
                                <div className="mobile-nav-item-content">
                                  <span className="mobile-nav-item-title">{item.label}</span>
                                  <span className="mobile-nav-item-description">{item.description}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
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