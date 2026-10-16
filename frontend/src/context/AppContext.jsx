import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // Format: { message, type: 'success' | 'error' }

  const triggerAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Base API endpoint fallback:
  // If running on a local network IP (e.g. 192.168.x.x), dynamically use that IP so mobile testing works seamlessly
  const getFallbackApiUrl = () => {
    if (
      typeof window !== 'undefined' &&
      window.location.hostname &&
      window.location.hostname !== 'localhost' &&
      !window.location.hostname.includes('vercel.app')
    ) {
      return `http://${window.location.hostname}:5000/api`;
    }
    return 'http://localhost:5000/api';
  };

  const API_URL = import.meta.env.VITE_API_URL || getFallbackApiUrl();

  return (
    <AppContext.Provider value={{ loading, setLoading, alert, setAlert, triggerAlert, API_URL }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
