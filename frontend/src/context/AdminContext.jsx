import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (adminToken) => {
    setToken(adminToken);
    setIsAuthenticated(true);
    localStorage.setItem('admin_token', adminToken);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
