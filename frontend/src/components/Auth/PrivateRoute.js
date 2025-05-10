import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // If auth is still loading, don't render anything yet
  if (loading) {
    return null;
  }
  
  // If not authenticated, redirect to login with the return URL
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate 
      to="/login" 
      state={{ from: location.pathname }} 
      replace 
    />
  );
};

export default PrivateRoute;
