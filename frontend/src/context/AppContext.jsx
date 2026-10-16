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

  // Base API endpoint fallback to port 5000
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  return (
    <AppContext.Provider value={{ loading, setLoading, alert, setAlert, triggerAlert, API_URL }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
