import React, { createContext, useState, useEffect } from 'react';
import api, { endpoints } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkLoggedIn = async () => {

      localStorage.removeItem('token');
      

      if (api.defaults && api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = '';
      }
      
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    };

    checkLoggedIn();
  }, []);


  const logout = () => {
    localStorage.removeItem('token');

    if (api.defaults && api.defaults.headers) {
      api.defaults.headers.common['Authorization'] = '';
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
