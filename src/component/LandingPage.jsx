// src/component/LandingPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });

    // Header background on scroll
    const handleScroll = () => {
      const header = document.querySelector('.landing-header');
      if (header) {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
          header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <nav className="landing-nav container">
          <Link to="/" className="landing-logo">
            🚀 JobTracker
          </Link>
          <ul className="landing-nav-links">
            <li><button onClick={() => scrollToSection('features')}>Features</button></li>
            <li><button onClick={() => scrollToSection('benefits')}>Benefits</button></li>
            <li><button onClick={() => scrollToSection('demo')}>Demo</button></li>
            <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
          </ul>
          {currentUser ? (
            <Link to="/dashboard" className="landing-cta-button">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="landing-cta-button">
              Get Started Free
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container">
          <div className="landing-hero-content fade-in-up">
            <h1>Land Your Dream Job Faster</h1>
            <p>The ultimate job search companion that helps you track applications, analyze progress, and access career resources all in one powerful platform.</p>
            <div className="landing-hero-buttons">
              {currentUser ? (
                <Link to="/dashboard" className="landing-btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/login" className="landing-btn-primary">
                  Start Tracking Jobs
                </Link>
              )}
              <button onClick={() => scrollToSection('demo')} className="landing-btn-secondary">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features" id="features">
        <div className="container">
          <div className="landing-section-header scroll-reveal">
            <h2>Everything You Need to Succeed</h2>
            <p>Comprehensive tools designed to streamline your job search and accelerate your career growth.</p>
          </div>

          <div className="landing-features-grid">
            <div className="landing-feature-card scroll-reveal">
              <div className="landing-feature-icon">📊</div>
              <h3>Smart Analytics Dashboard</h3>
              <p>Track your application progress with detailed analytics, success rates, and monthly trends to optimize your job search strategy.</p>
            </div>

            <div className="landing-feature-card scroll-reveal">
              <div className="landing-feature-icon">📝</div>
              <h3>Application Management</h3>
              <p>Organize all your job applications in one place. Track status updates, set follow-up reminders, and never miss an opportunity.</p>
            </div>

            <div className="landing-feature-card scroll-reveal">
              <div className="landing-feature-icon">🎯</div>
              <h3>Interview Preparation</h3>
              <p>Access custom question sets and practice materials to ace your interviews and boost your confidence.</p>
            </div>

            <div className="landing-feature-card scroll-reveal">
              <div className="landing-feature-icon">🎥</div>
              <h3>Career Development Videos</h3>
              <p>Learn from expert tutorials covering resume writing, networking, salary negotiation, and career advancement strategies.</p>
            </div>

            <div className="landing-feature-card scroll-reveal">
              <div className="landing-feature-icon">🏢</div>
              <h3>Company Directory</h3>
              <p>Research companies, explore career opportunities, and discover insights about potential employers.</p>
            </div>

            <div className="landing-feature-card scroll-reveal">
              <div className="landing-feature-icon">💡</div>
              <h3>Knowledge Hub</h3>
              <p>Access curated career tools, resources, and articles to stay ahead in your professional development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="landing-benefits" id="benefits">
        <div className="container">
          <div className="landing-benefits-content">
            <div className="landing-benefits-text scroll-reveal">
              <h2>Why JobTracker Changes Everything</h2>
              <p>Stop losing track of opportunities and start taking control of your career journey with data-driven insights and organized workflows.</p>
              
              <ul className="landing-benefits-list">
                <li>Increase your application success rate by 40%</li>
                <li>Never miss a follow-up or deadline again</li>
                <li>Get personalized insights on your job search performance</li>
                <li>Access exclusive career development resources</li>
                <li>Stay organized with all applications in one dashboard</li>
                <li>Track your progress with detailed analytics</li>
              </ul>

              {currentUser ? (
                <Link to="/dashboard" className="landing-cta-button">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/login" className="landing-cta-button">
                  Start Your Journey
                </Link>
              )}
            </div>

            <div className="landing-stats-grid scroll-reveal">
              <div className="landing-stat">
                <h3>40%</h3>
                <p>Higher Success Rate</p>
              </div>
              <div className="landing-stat">
                <h3>60%</h3>
                <p>Faster Job Placement</p>
              </div>
              <div className="landing-stat">
                <h3>10k+</h3>
                <p>Happy Job Seekers</p>
              </div>
              <div className="landing-stat">
                <h3>95%</h3>
                <p>User Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="landing-demo" id="demo">
        <div className="container">
          <div className="landing-demo-content scroll-reveal">
            <h2>See JobTracker in Action</h2>
            <p>Experience the power of organized job searching with our intuitive interface and comprehensive features.</p>
            
            <div className="landing-demo-mockup">
              <div className="landing-mockup-screen">
                <div className="landing-mockup-header">
                  <div className="landing-mockup-dot"></div>
                  <div className="landing-mockup-dot"></div>
                  <div className="landing-mockup-dot"></div>
                </div>
                <h3 style={{ marginBottom: '1rem' }}>📊 Your Job Search Dashboard</h3>
                <div className="landing-mockup-stats">
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-stat-number">24</div>
                    <div className="landing-mockup-stat-label">Applications</div>
                  </div>
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-stat-number">8</div>
                    <div className="landing-mockup-stat-label">Interviews</div>
                  </div>
                  <div className="landing-mockup-stat">
                    <div className="landing-mockup-stat-number">3</div>
                    <div className="landing-mockup-stat-label">Offers</div>
                  </div>
                </div>
                <div className="landing-mockup-recent">
                  <strong>Recent Applications:</strong><br />
                  • Software Engineer at TechCorp - Applied 2 days ago<br />
                  • Product Manager at StartupXYZ - Interview scheduled<br />
                  • Data Analyst at BigCorp - Offer received! 🎉
                </div>
              </div>
            </div>

            {currentUser ? (
              <Link to="/dashboard" className="landing-btn-primary">
                Open Your Dashboard
              </Link>
            ) : (
              <Link to="/login" className="landing-btn-primary">
                Try It Now - It's Free!
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta">
        <div className="container scroll-reveal">
          <h2>Ready to Transform Your Job Search?</h2>
          <p>Join thousands of successful job seekers who found their dream careers with JobTracker.</p>
          {currentUser ? (
            <Link to="/dashboard" className="landing-btn-primary">
              Continue to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="landing-btn-primary">
              Get Started Today - Free Forever
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="contact">
        <div className="container">
          <div className="landing-footer-content">
            <div className="landing-footer-section">
              <h3>🚀 JobTracker</h3>
              <p>Your ultimate job search companion. Track, analyze, and succeed in your career journey.</p>
            </div>
            
            <div className="landing-footer-section">
              <h3>Product</h3>
              <button onClick={() => scrollToSection('features')}>Features</button>
              <Link to="/login">Get Started</Link>
              <button onClick={() => scrollToSection('demo')}>Demo</button>
              <Link to="/tutorials">Tutorials</Link>
            </div>
            
            <div className="landing-footer-section">
              <h3>Company</h3>
              <a href="#about">About Us</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
              <a href="#blog">Blog</a>
            </div>
            
            <div className="landing-footer-section">
              <h3>Support</h3>
              <a href="#help">Help Center</a>
              <a href="#docs">Documentation</a>
              <a href="#community">Community</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>
          
          <div className="landing-footer-bottom">
            <p>&copy; 2024 JobTracker. All rights reserved. Built with ❤️ for job seekers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;