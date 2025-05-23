// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {

  const { isAuthenticated, authInitialized } = useAuth();

  
  if (!authInitialized) {
    return <div>Loading...</div>; // ⏳ Wait for token check
  }

  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;