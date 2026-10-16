import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const AdminRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['Admin']}>{children}</ProtectedRoute>;
};

export default AdminRoute;
