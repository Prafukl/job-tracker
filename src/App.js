// src/App.js - Updated with Landing Page

import React from 'react';
import Header from './component/Header';
import Dashboard from './component/Dashboard';
import Footer from './component/Footer';
import Joblist from './component/Joblist';
import Notes from './component/Notes';
import Knowledge from './component/Knowledge';
import Tutorial from './component/Tutorial';
import InterviewPrep from './component/InterviewPrep';
import CompanyDirectory from './component/CompanyDirectory';
import AdminPanel from './component/AdminPanel';
import KnowledgeBaseArticle from './component/KnowledgeBaseArticle';
import LandingPage from './component/LandingPage';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Login page component
const Login = () => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="login-container">
      <div className="login-message" style={{ 
        textAlign: 'center', 
        padding: '100px 20px',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <h1>Welcome to JobTrack</h1>
        <p style={{ marginTop: '20px', fontSize: '18px' }}>
          Please log in or register to access your job tracking dashboard and applications.
        </p>
        <p style={{ marginTop: '20px', color: '#666' }}>
          Use the Login or Register buttons in the header above to get started.
        </p>
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
          path: "login",
          element: <Login />,
        },
        {
          path: "dashboard",
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        },
        {
          path: "joblist",
          element: <ProtectedRoute><Joblist /></ProtectedRoute>,
        },
        {
          path: "notes",
          element: <ProtectedRoute><Notes /></ProtectedRoute>,
        },
        {
          path: "knowledge",
          element: <ProtectedRoute><Knowledge /></ProtectedRoute>,
        },
        {
          path: "tutorials",
          element: <ProtectedRoute><Tutorial /></ProtectedRoute>,
        },
        {
          path: "interview-prep",
          element: <ProtectedRoute><InterviewPrep /></ProtectedRoute>,
        },
        {
          path: "companies",
          element: <CompanyDirectory />,
        },
        {
          path: "knowledge-base",
          element: <ProtectedRoute><KnowledgeBaseArticle /></ProtectedRoute>,
        },
        {
          path: "admin",
          element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
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