// src/App.js - IT Support Platform Routes (Using Existing Components)

import React from 'react';
import Header from './component/Header';
import Dashboard from './component/Dashboard';
import Footer from './component/Footer';
import Joblist from './component/Joblist'; // Using existing component for tickets
import Notes from './component/Notes';
import Knowledge from './component/Knowledge';
import Tutorial from './component/Tutorial';
import InterviewPrep from './component/InterviewPrep';
import CompanyDirectory from './component/CompanyDirectory';
import AdminPanel from './component/AdminPanel';
import KnowledgeBaseArticle from './component/KnowledgeBaseArticle';
import LandingPage from './component/LandingPage';
// import LoginPage from './component/LoginPage'; // Commented out until file is created
import { createBrowserRouter, RouterProvider, Outlet, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/app/login" />;
  }
  
  return children;
};

// Simple Login component with actual login form
const Login = () => {
  const { currentUser, login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  if (currentUser) {
    return <Navigate to="/app/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(email, password, displayName);
        setIsLoginMode(true);
        setEmail('');
        setPassword('');
        setDisplayName('');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1e293b'
        }}>
          <span>🛠️</span>
          <span>IT Support Hub</span>
        </div>
        
        <h1 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          {isLoginMode ? 'Welcome Back' : 'Get Started'}
        </h1>
        
        <p style={{ 
          color: '#64748b', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          {isLoginMode ? 'Sign in to access your dashboard' : 'Create your account to get started'}
        </p>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {!isLoginMode && (
            <input
              type="text"
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required={!isLoginMode}
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
            />
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          />
          
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: '#64748b' }}>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
              setEmail('');
              setPassword('');
              setDisplayName('');
            }}
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

        <div style={{ 
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1rem',
          textAlign: 'center'
        }}>
          <button 
            type="button"
            onClick={() => {
              setEmail('demo@itsupporthub.org');
              setPassword('demo123');
            }}
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
              marginBottom: '1rem'
            }}
          >
            🚀 Use Demo Account
          </button>
          
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

// App Layout for protected routes (with Header and Footer)
const AppLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

// Landing Layout (without Header and Footer since LandingPage has its own)
const LandingLayout = () => <Outlet />;

// Create router with landing page and app routes
const AppRouter = () => {
  const router = createBrowserRouter([
    // Landing page route (standalone)
    {
      path: "/",
      element: <LandingLayout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        }
      ]
    },
    // Login route (standalone - no header/footer)
    {
      path: "/app/login",
      element: <Login />,
    },
    // App routes (with header/footer)
    {
      path: "/app",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/app/login" />,
        },
        {
          path: "dashboard",
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        },
        // Service Management Routes (using existing components)
        {
          path: "tickets",
          element: <ProtectedRoute><Joblist /></ProtectedRoute>, // Using Joblist as ticket management
        },
        {
          path: "service-desk",
          element: <ProtectedRoute><Knowledge /></ProtectedRoute>, // Using Knowledge as service desk
        },
        {
          path: "change-management",
          element: <ProtectedRoute><Notes /></ProtectedRoute>, // Using Notes for change management
        },
        // Infrastructure & Monitoring Routes (using existing components)
        {
          path: "system-monitoring",
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>, // Using Dashboard for monitoring
        },
        {
          path: "network-diagnostics",
          element: <ProtectedRoute><InterviewPrep /></ProtectedRoute>, // Repurposing InterviewPrep
        },
        {
          path: "inventory",
          element: <ProtectedRoute><CompanyDirectory /></ProtectedRoute>, // Using CompanyDirectory as inventory
        },
        {
          path: "backup-recovery",
          element: <ProtectedRoute><Notes /></ProtectedRoute>, // Using Notes for backup info
        },
        // Security & Identity Routes (using existing components)
        {
          path: "security-center",
          element: <ProtectedRoute><AdminPanel /></ProtectedRoute>, // Using AdminPanel for security
        },
        {
          path: "iam-management",
          element: <ProtectedRoute><AdminPanel /></ProtectedRoute>, // Using AdminPanel for IAM
        },
        {
          path: "user-management",
          element: <ProtectedRoute><AdminPanel /></ProtectedRoute>, // Using AdminPanel for users
        },
        // Cloud & Modern Infrastructure (using existing components)
        {
          path: "cloud-services",
          element: <ProtectedRoute><Knowledge /></ProtectedRoute>, // Using Knowledge for cloud info
        },
        // Knowledge & Training Routes (existing components)
        {
          path: "knowledge",
          element: <ProtectedRoute><Knowledge /></ProtectedRoute>,
        },
        {
          path: "tutorials",
          element: <ProtectedRoute><Tutorial /></ProtectedRoute>,
        },
        {
          path: "knowledge-base",
          element: <ProtectedRoute><KnowledgeBaseArticle /></ProtectedRoute>,
        },
        // Organization & Collaboration (existing components)
        {
          path: "notes",
          element: <ProtectedRoute><Notes /></ProtectedRoute>,
        },
        {
          path: "companies",
          element: <CompanyDirectory />,
        },
        {
          path: "reports",
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>, // Using Dashboard for reports
        },
        // Admin Routes
        {
          path: "admin",
          element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
        },
        // Legacy route support
        {
          path: "joblist",
          element: <ProtectedRoute><Joblist /></ProtectedRoute>,
        },
        {
          path: "interview-prep",
          element: <ProtectedRoute><InterviewPrep /></ProtectedRoute>,
        }
      ],
    },
    // Redirect old routes to new structure (backward compatibility)
    {
      path: "/login",
      element: <Navigate to="/app/login" replace />,
    },
    {
      path: "/dashboard",
      element: <Navigate to="/app/dashboard" replace />,
    },
    {
      path: "/joblist",
      element: <Navigate to="/app/joblist" replace />,
    },
    {
      path: "/tickets",
      element: <Navigate to="/app/tickets" replace />,
    },
    {
      path: "/notes",
      element: <Navigate to="/app/notes" replace />,
    },
    {
      path: "/knowledge",
      element: <Navigate to="/app/knowledge" replace />,
    },
    {
      path: "/tutorials",
      element: <Navigate to="/app/tutorials" replace />,
    },
    {
      path: "/interview-prep",
      element: <Navigate to="/app/interview-prep" replace />,
    },
    {
      path: "/companies",
      element: <Navigate to="/app/companies" replace />,
    },
    {
      path: "/knowledge-base",
      element: <Navigate to="/app/knowledge-base" replace />,
    },
    {
      path: "/admin",
      element: <Navigate to="/app/admin" replace />,
    }
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;