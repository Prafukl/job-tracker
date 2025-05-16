import React, { useState } from 'react';
import '../Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">JobTrack</div>
          
          <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
         
            <a href="/dashboard">Dashboard</a>
            <a href="/applications">Applications</a>
            <a href="">Resources</a>
            
            <div className="auth-buttons">
              <button className="login-btn" onClick={openLoginModal}>Login</button>
              <button className="register-btn" onClick={openRegisterModal}>Register</button>
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

      {/* Login Modal */}
      {(showLoginModal || showRegisterModal) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <h2>{isLoginForm ? 'Login' : 'Register'}</h2>
            
            <form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
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
                    placeholder="Confirm your password" 
                    required 
                  />
                </div>
              )}
              
              <button type="submit" className="submit-btn">
                {isLoginForm ? 'Login' : 'Register'}
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