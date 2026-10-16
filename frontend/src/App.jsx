import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DoctorRoute from './components/DoctorRoute';
import ArogyaChatbot from './components/ArogyaChatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingPanel from './pages/BookingPanel';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AISymptomChecker from './pages/AISymptomChecker';
import AIPrescriptionScanner from './pages/AIPrescriptionScanner';

// Alert banner overlay
const AlertOverlay = () => {
  const { alert, setAlert } = useApp();

  if (!alert) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[99] flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold animate-fade-in ${
        alert.type === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-emerald-500/5'
          : 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 shadow-red-500/5'
      }`}
    >
      <span>{alert.message}</span>
      <button
        onClick={() => setAlert(null)}
        className="text-base font-bold select-none hover:opacity-75 focus:outline-none leading-none"
      >
        &times;
      </button>
    </div>
  );
};

// Global spinner overlay
const LoadingOverlay = () => {
  const { loading } = useApp();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 bg-white/95 dark:bg-slate-900/95 px-6 py-4 rounded-2xl shadow-xl border border-slate-100/50 dark:border-slate-800">
        <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">Processing...</span>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ai-symptoms" element={<AISymptomChecker />} />
            <Route path="/ai-scanner" element={<AIPrescriptionScanner />} />

            {/* Patient Protected Routes */}
            <Route
              path="/book/:id"
              element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <BookingPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/my-bookings" element={<Navigate to="/appointments" replace />} />

            {/* Doctor Protected Route */}
            <Route
              path="/doctor-dashboard"
              element={
                <DoctorRoute>
                  <DoctorDashboard />
                </DoctorRoute>
              }
            />

            {/* Admin Protected Route */}
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Global Overlays */}
        <AlertOverlay />
        <LoadingOverlay />
        
        {/* 24/7 AI Medical Assistant Chatbot */}
        <ArogyaChatbot />

        {/* Global Footer matching Figma */}
        <footer className="border-t border-emerald-500/15 bg-[#050e0b] py-8 mt-16 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 font-medium">
            &copy; 2026 ArogyaCareAI. Healthcare, Simplified. All Rights Reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
