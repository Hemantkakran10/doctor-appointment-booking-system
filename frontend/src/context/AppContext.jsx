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

  // Production backend deployed on Vercel
  const PROD_API_URL = 'https://backend-nine-delta-bvvafh0hc7.vercel.app/api';

  // Base API endpoint fallback:
  // 1. If running on Vercel or any HTTPS domain, default to production Vercel backend
  // 2. If running on a local network IP (e.g. 192.168.x.x), dynamically use that IP so mobile testing works seamlessly
  // 3. Otherwise default to localhost:5000
  const getFallbackApiUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname) {
      if (window.location.hostname.includes('vercel.app') || window.location.protocol === 'https:') {
        return PROD_API_URL;
      }
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `http://${window.location.hostname}:5000/api`;
      }
    }
    return 'http://localhost:5000/api';
  };

  const API_URL = (() => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('<your-render-app-name>') && !envUrl.includes('placeholder')) {
      // If deployed on https production but envUrl still points to localhost, prefer production backend
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && envUrl.includes('localhost')) {
        return PROD_API_URL;
      }
      return envUrl;
    }
    return getFallbackApiUrl();
  })();

  return (
    <AppContext.Provider value={{ loading, setLoading, alert, setAlert, triggerAlert, API_URL }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
