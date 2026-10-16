import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, authInitialized } = useAuth();

  // Show loading indicator during session boot
  if (!authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Restoring session...</span>
        </div>
      </div>
    );
  }

  // Not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but unauthorized role, redirect to root
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
