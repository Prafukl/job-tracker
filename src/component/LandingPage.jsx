// src/component/LandingPage.jsx - Simplified IT Support Hub Landing Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Github, 
  Star, 
  GitFork, 
  Download, 
  Users, 
  ExternalLink,
  Menu,
  X,
  Monitor,
  Shield,
  Network,
  Cloud,
  Headphones,
  Settings,
  BarChart3,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Play,
  Coffee,
  Code,
  Heart
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [githubStats] = useState({
    stars: '2.3k',
    forks: '456',
    contributors: '89'
  });

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
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <nav className="landing-nav container">
          <Link to="/" className="landing-logo">
            <span className="logo-icon">🛠️</span>
            <span className="logo-text">IT Support Hub</span>
          </Link>
          
          <ul className="landing-nav-links">
            <li><button onClick={() => scrollToSection('features')}>Features</button></li>
            <li><button onClick={() => scrollToSection('architecture')}>Architecture</button></li>
            <li><button onClick={() => scrollToSection('community')}>Community</button></li>
            <li><button onClick={() => scrollToSection('contributing')}>Contributing</button></li>
            <li><a href="https://docs.itsupporthub.org" target="_blank" rel="noopener noreferrer">Docs</a></li>
          </ul>

          <div className="landing-header-actions">
            <a 
              href="https://github.com/your-username/it-support-hub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-button"
            >
              <Github size={20} />
              <span className="github-stats">
                <Star size={14} />
                <span>{githubStats.stars}</span>
              </span>
            </a>
            
            {currentUser ? (
              <Link to="/app/dashboard" className="landing-cta-button">
                Open Platform
              </Link>
            ) : (
              <Link to="/app/login" className="landing-cta-button">
                Get Started
              </Link>
            )}

            <button className="mobile-menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <button onClick={() => { scrollToSection('features'); toggleMenu(); }}>Features</button>
              <button onClick={() => { scrollToSection('architecture'); toggleMenu(); }}>Architecture</button>
              <button onClick={() => { scrollToSection('community'); toggleMenu(); }}>Community</button>
              <button onClick={() => { scrollToSection('contributing'); toggleMenu(); }}>Contributing</button>
              <a href="https://docs.itsupporthub.org" target="_blank" rel="noopener noreferrer">Documentation</a>
              <a href="https://github.com/your-username/it-support-hub" target="_blank" rel="noopener noreferrer" className="mobile-github">
                <Github size={20} />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container">
          <div className="landing-hero-content">
            <div className="hero-badge fade-in-up">
              <span>⚡</span>
              <span>Open Source • MIT Licensed • Community Driven</span>
            </div>
            
            <h1 className="fade-in-up">
              All-in-One Platform for
              <span className="gradient-text"> IT Support Engineer </span>
            </h1>
            
            <p className="hero-subtitle fade-in-up">
              Transform your IT operations with our comprehensive open source platform. 
              Built by IT Support Engineer, for Helpdesk, Service desk, Network Engineer, IT infrastructure 
              Manage infrastructure, one unified interface.
            </p>

            <div className="hero-buttons fade-in-up">
              {currentUser ? (
                <Link to="/app/dashboard" className="btn-primary">
                  <Monitor size={20} />
                  <span>Open Platform</span>
                </Link>
              ) : (
                <Link to="/app/login" className="btn-primary">
                  <Play size={20} />
                  <span>Try Live Demo</span>
                </Link>
              )}
              
              <a 
                href="https://github.com/your-username/it-support-hub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Github size={20} />
                <span>View on GitHub</span>
              </a>
            </div>

            {/* GitHub Stats */}
            <div className="hero-stats fade-in-up">
              <div className="stat">
                <Star size={16} />
                <span>{githubStats.stars} stars</span>
              </div>
              <div className="stat">
                <GitFork size={16} />
                <span>{githubStats.forks} forks</span>
              </div>
              <div className="stat">
                <Users size={16} />
                <span>{githubStats.contributors} contributors</span>
              </div>
              <div className="stat">
                <Download size={16} />
                <span>50k+ downloads</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual fade-in-up">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <span className="terminal-title">IT Support Hub - Live Dashboard</span>
              </div>
              <div className="terminal-content">
                <div className="terminal-line">
                  <span className="prompt">$</span>
                  <span className="command">npm install -g it-support-hub</span>
                </div>
                <div className="terminal-line">
                  <span className="output">✓ Installing IT Support Hub...</span>
                </div>
                <div className="terminal-line">
                  <span className="output">✓ Setting up monitoring services...</span>
                </div>
                <div className="terminal-line">
                  <span className="output">✓ Configuring security center...</span>
                </div>
                <div className="terminal-line">
                  <span className="prompt">$</span>
                  <span className="command">it-support-hub start</span>
                </div>
                <div className="terminal-line">
                  <span className="output success">🚀 IT Support Hub running on http://localhost:3000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features" id="features">
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2>Everything IT Professionals Need</h2>
            <p>A comprehensive suite of tools designed to streamline IT operations, enhance security, and improve service delivery.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card scroll-reveal">
              <div className="feature-icon service-management">
                <Headphones size={32} />
              </div>
              <h3>Service Management</h3>
              <p>Complete ITSM suite with ticket management, service desk, and change management workflows.</p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={16} />
                  <span>SLA tracking & escalation</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>ITIL-compliant processes</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Self-service portal</span>
                </li>
              </ul>
            </div>

            <div className="feature-card scroll-reveal">
              <div className="feature-icon infrastructure">
                <Monitor size={32} />
              </div>
              <h3>Infrastructure Monitoring</h3>
              <p>Real-time monitoring, network diagnostics, and comprehensive asset management capabilities.</p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={16} />
                  <span>Real-time dashboards</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Automated alerting</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Performance analytics</span>
                </li>
              </ul>
            </div>

            <div className="feature-card scroll-reveal">
              <div className="feature-icon security">
                <Shield size={32} />
              </div>
              <h3>Security & Identity</h3>
              <p>Advanced security monitoring, IAM, and compliance management for enterprise environments.</p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={16} />
                  <span>Threat detection</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Access management</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Compliance reporting</span>
                </li>
              </ul>
            </div>

            <div className="feature-card scroll-reveal">
              <div className="feature-icon cloud">
                <Cloud size={32} />
              </div>
              <h3>Cloud Management</h3>
              <p>Multi-cloud support for AWS, Azure, and GCP with cost optimization and resource management.</p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={16} />
                  <span>Multi-cloud dashboard</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Cost optimization</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Resource provisioning</span>
                </li>
              </ul>
            </div>

            <div className="feature-card scroll-reveal">
              <div className="feature-icon analytics">
                <BarChart3 size={32} />
              </div>
              <h3>Analytics & Reporting</h3>
              <p>Advanced reporting capabilities with customizable dashboards and automated insights.</p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={16} />
                  <span>Custom dashboards</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Automated reports</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Trend analysis</span>
                </li>
              </ul>
            </div>

            <div className="feature-card scroll-reveal">
              <div className="feature-icon knowledge">
                <BookOpen size={32} />
              </div>
              <h3>Knowledge Management</h3>
              <p>Comprehensive knowledge base with tutorials, documentation, and community-driven content.</p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={16} />
                  <span>Searchable knowledge base</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Video tutorials</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Community contributions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="landing-architecture" id="architecture">
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2>Built for Scale & Performance</h2>
            <p>Modern architecture designed for enterprise environments with security and scalability in mind.</p>
          </div>

          <div className="architecture-content">
            <div className="tech-stack scroll-reveal">
              <h3>Technology Stack</h3>
              <div className="tech-grid">
                <div className="tech-item">
                  <div className="tech-icon">⚛️</div>
                  <span>React 19</span>
                </div>
                <div className="tech-item">
                  <div className="tech-icon">🔥</div>
                  <span>Firebase</span>
                </div>
                <div className="tech-item">
                  <div className="tech-icon">🎨</div>
                  <span>TailwindCSS</span>
                </div>
                <div className="tech-item">
                  <div className="tech-icon">📊</div>
                  <span>Chart.js</span>
                </div>
                <div className="tech-item">
                  <div className="tech-icon">🔒</div>
                  <span>Firebase Auth</span>
                </div>
                <div className="tech-item">
                  <div className="tech-icon">☁️</div>
                  <span>Cloud Functions</span>
                </div>
              </div>
            </div>

            <div className="deployment-options scroll-reveal">
              <h3>Deployment Options</h3>
              <div className="deployment-grid">
                <div className="deployment-card">
                  <div className="deployment-icon">🐳</div>
                  <h4>Docker</h4>
                  <p>Single-command deployment with Docker Compose</p>
                  <code>docker-compose up -d</code>
                </div>
                <div className="deployment-card">
                  <div className="deployment-icon">☸️</div>
                  <h4>Kubernetes</h4>
                  <p>Production-ready Kubernetes manifests</p>
                  <code>kubectl apply -f k8s/</code>
                </div>
                <div className="deployment-card">
                  <div className="deployment-icon">☁️</div>
                  <h4>Cloud Native</h4>
                  <p>Deploy to AWS, Azure, or GCP</p>
                  <code>npm run deploy</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="landing-community" id="community">
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2>Join Our Growing Community</h2>
            <p>Connect with IT professionals worldwide and contribute to the future of IT management tools.</p>
          </div>

          <div className="community-stats scroll-reveal">
            <div className="stat-card">
              <div className="stat-number">2,300+</div>
              <div className="stat-label">GitHub Stars</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">456</div>
              <div className="stat-label">Contributors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50k+</div>
              <div className="stat-label">Downloads</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">150+</div>
              <div className="stat-label">Organizations</div>
            </div>
          </div>

          <div className="community-channels scroll-reveal">
            <div className="channel-card">
              <div className="channel-icon">
                <Github size={40} />
              </div>
              <h3>GitHub</h3>
              <p>Source code, issues, and releases</p>
              <a href="https://github.com/your-username/it-support-hub" target="_blank" rel="noopener noreferrer" className="channel-link">
                Visit Repository <ExternalLink size={16} />
              </a>
            </div>

            <div className="channel-card">
              <div className="channel-icon">💬</div>
              <h3>Discord</h3>
              <p>Real-time chat and community support</p>
              <a href="https://discord.gg/itsupporthub" target="_blank" rel="noopener noreferrer" className="channel-link">
                Join Discord <ExternalLink size={16} />
              </a>
            </div>

            <div className="channel-card">
              <div className="channel-icon">📧</div>
              <h3>Mailing List</h3>
              <p>Updates, releases, and announcements</p>
              <a href="mailto:community@itsupporthub.org" className="channel-link">
                Subscribe <ExternalLink size={16} />
              </a>
            </div>

            <div className="channel-card">
              <div className="channel-icon">📖</div>
              <h3>Documentation</h3>
              <p>Comprehensive guides and API docs</p>
              <a href="https://docs.itsupporthub.org" target="_blank" rel="noopener noreferrer" className="channel-link">
                Read Docs <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contributing Section */}
      <section className="landing-contributing" id="contributing">
        <div className="container">
          <div className="contributing-content">
            <div className="contributing-text scroll-reveal">
              <h2>Contribute to IT Support Hub</h2>
              <p>
                Help us build the future of IT management tools. Whether you're a developer, 
                designer, or IT professional, there are many ways to contribute to our open source project.
              </p>

              <div className="contribution-types">
                <div className="contribution-type">
                  <Code size={24} />
                  <div>
                    <h4>Code Contributions</h4>
                    <p>Fix bugs, add features, or improve performance</p>
                  </div>
                </div>
                <div className="contribution-type">
                  <BookOpen size={24} />
                  <div>
                    <h4>Documentation</h4>
                    <p>Improve guides, tutorials, and API documentation</p>
                  </div>
                </div>
                <div className="contribution-type">
                  <Settings size={24} />
                  <div>
                    <h4>Integrations</h4>
                    <p>Build connectors for monitoring tools and services</p>
                  </div>
                </div>
                <div className="contribution-type">
                  <Heart size={24} />
                  <div>
                    <h4>Community Support</h4>
                    <p>Help other users and share your expertise</p>
                  </div>
                </div>
              </div>

              <div className="getting-started">
                <h3>Getting Started</h3>
                <div className="start-steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <span>Fork the repository on GitHub</span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span>Set up your development environment</span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span>Pick an issue or propose a new feature</span>
                  </div>
                  <div className="step">
                    <span className="step-number">4</span>
                    <span>Submit your pull request</span>
                  </div>
                </div>
              </div>

              <div className="contribute-buttons">
                <a 
                  href="https://github.com/your-username/it-support-hub/blob/main/CONTRIBUTING.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <BookOpen size={20} />
                  <span>Contributing Guide</span>
                </a>
                <a 
                  href="https://github.com/your-username/it-support-hub/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Settings size={20} />
                  <span>View Issues</span>
                </a>
              </div>
            </div>

            <div className="contributing-visual scroll-reveal">
              <div className="code-editor">
                <div className="editor-header">
                  <div className="editor-tabs">
                    <span className="tab active">src/component/Dashboard.jsx</span>
                    <span className="tab">CONTRIBUTING.md</span>
                  </div>
                </div>
                <div className="editor-content">
                  <div className="code-line">
                    <span className="line-number">1</span>
                    <span className="code">import React from 'react';</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">2</span>
                    <span className="code">import &#123; Monitor, Shield, Network &#125; from 'lucide-react';</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">3</span>
                    <span className="code"></span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">4</span>
                    <span className="code">const Dashboard = () =&gt; &#123;</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">5</span>
                    <span className="code">  return (</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">6</span>
                    <span className="code">    &lt;div className="dashboard"&gt;</span>
                  </div>
                  <div className="code-line highlight">
                    <span className="line-number">7</span>
                    <span className="code">      &#123;/* New feature: Real-time alerts */&#125;</span>
                  </div>
                  <div className="code-line highlight">
                    <span className="line-number">8</span>
                    <span className="code">      &lt;AlertsPanel /&gt;</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">9</span>
                    <span className="code">    &lt;/div&gt;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta">
        <div className="container scroll-reveal">
          <div className="final-cta-content">
            <h2>Ready to Transform Your IT Operations?</h2>
            <p>
              Join thousands of IT professionals who are already using IT Support Hub 
              to streamline their operations and improve service delivery.
            </p>
            
            <div className="final-cta-buttons">
              {currentUser ? (
                <Link to="/app/dashboard" className="btn-primary large">
                  <Monitor size={24} />
                  <span>Open Platform</span>
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <Link to="/app/login" className="btn-primary large">
                  <Play size={24} />
                  <span>Try Live Demo</span>
                  <ArrowRight size={20} />
                </Link>
              )}
              
              <a 
                href="https://github.com/your-username/it-support-hub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary large"
              >
                <Github size={24} />
                <span>View on GitHub</span>
                <ExternalLink size={20} />
              </a>
            </div>

            <div className="final-cta-note">
              <Coffee size={16} />
              <span>Free and open source forever. No vendor lock-in.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">🛠️</span>
                <span className="logo-text">IT Support Hub</span>
              </div>
              <p>Open source platform for IT professionals. Built with ❤️ by the community.</p>
              <div className="footer-social">
                <a href="https://github.com/your-username/it-support-hub" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
                <a href="https://discord.gg/itsupporthub" target="_blank" rel="noopener noreferrer">
                  <div className="social-icon">💬</div>
                </a>
                <a href="mailto:community@itsupporthub.org">
                  <div className="social-icon">📧</div>
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3>Product</h3>
              <button onClick={() => scrollToSection('features')}>Features</button>
              <a href="https://docs.itsupporthub.org" target="_blank" rel="noopener noreferrer">Documentation</a>
              <a href="https://github.com/your-username/it-support-hub/releases" target="_blank" rel="noopener noreferrer">Releases</a>
              <Link to="/app/login">Live Demo</Link>
            </div>
            
            <div className="footer-section">
              <h3>Community</h3>
              <a href="https://github.com/your-username/it-support-hub" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://discord.gg/itsupporthub" target="_blank" rel="noopener noreferrer">Discord</a>
              <a href="https://github.com/your-username/it-support-hub/discussions" target="_blank" rel="noopener noreferrer">Discussions</a>
              <button onClick={() => scrollToSection('contributing')}>Contributing</button>
            </div>
            
            <div className="footer-section">
              <h3>Resources</h3>
              <a href="https://docs.itsupporthub.org/getting-started" target="_blank" rel="noopener noreferrer">Getting Started</a>
              <a href="https://docs.itsupporthub.org/api" target="_blank" rel="noopener noreferrer">API Reference</a>
              <a href="https://github.com/your-username/it-support-hub/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing Guide</a>
              <a href="https://github.com/your-username/it-support-hub/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 IT Support Hub. Open source under MIT License. Built with ❤️ by the community.</p>
            <div className="footer-bottom-links">
              <a href="https://github.com/your-username/it-support-hub/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">License</a>
              <a href="https://github.com/your-username/it-support-hub/security" target="_blank" rel="noopener noreferrer">Security</a>
              <a href="https://github.com/your-username/it-support-hub/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer">Code of Conduct</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;