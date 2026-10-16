import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const DoctorRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['Doctor']}>{children}</ProtectedRoute>;
};

export default DoctorRoute;
