import React, { createContext, useState, useEffect, useContext } from 'react';
import { useApp } from './AppContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authInitialized, setAuthInitialized] = useState(false);
  const { API_URL, setLoading, triggerAlert } = useApp();

  // Validate session on page load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setAuthInitialized(true);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          // Clear credentials if token expired
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        setAuthInitialized(true);
      }
    };
    fetchProfile();
  }, [token, API_URL]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login credentials invalid');
      }

      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data);
      triggerAlert(`Welcome back, ${data.name}!`, 'success');
      return data;
    } catch (err) {
      triggerAlert(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendRegisterOtp = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      triggerAlert(data.message || 'Verification OTP sent to your email!', 'success');
      return data;
    } catch (err) {
      triggerAlert(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, otp) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, otp })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data);
      triggerAlert('Account verified & registered successfully!', 'success');
      return data;
    } catch (err) {
      triggerAlert(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      setUser(prev => ({ ...prev, ...data }));
      triggerAlert('Profile updated successfully!', 'success');
      return data;
    } catch (err) {
      triggerAlert(err.message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    triggerAlert('Logged out successfully', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, sendRegisterOtp, logout, updateProfile, authInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
