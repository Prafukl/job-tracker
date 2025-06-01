// src/App.js - Updated with Knowledge Base route

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
// Import the new Knowledge Base component
import KnowledgeBaseArticle from './component/KnowledgeBaseArticle';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // If still loading auth state, we can show a loading screen
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  // If not logged in, redirect to home page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Login page component
const Login = () => {
  const { currentUser } = useAuth();
  
  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  // Return an empty div - header will display the login modal
  return (
    <div className="login-container">
      {/* We'll trigger the login modal through the Header component */}
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
          index: true, // This means the default route "/"
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
        {
          path: "interview-prep",
          element: <ProtectedRoute><InterviewPrep /></ProtectedRoute>,
        },
        {
          path: "companies",
          element: <CompanyDirectory />, // Not protected, visible to all users
        },
        // Add the new Knowledge Base route
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