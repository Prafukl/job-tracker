// src/App.js - Updated with IT Support route

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
import KnowledgeBaseArticle from './component/KnowledgeBaseArticle';
// Import the new IT Support page
import ITSupportPage from './component/ITSupportPage';
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

// Common Layout with Header and Footer
const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

// Create router with auth protection for routes
const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" />,
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
        // Add the new IT Support route
        {
          path: "tutorials/it-support",
          element: <ProtectedRoute><ITSupportPage /></ProtectedRoute>,
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
        }
      ],
    },
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