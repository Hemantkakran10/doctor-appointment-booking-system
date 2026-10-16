import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Stethoscope, LogIn, Mail, Lock, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { loading } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password);

      // Role-based redirection
      if (user.role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'Doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error details:', err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-[#071612] border border-slate-100 dark:border-emerald-500/20 p-8 rounded-3xl shadow-xl transition-colors duration-200">
        {/* Title Block */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#00e599] rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-emerald-500/20">
            <Stethoscope className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00e599] text-[11px] font-bold tracking-wider uppercase mb-2 border border-emerald-500/20">
            <Sparkles className="w-3 h-3" />
            <span>Secure Patient & Doctor Portal</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Sign in to ArogyaCareAI
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access intelligent triage, prescriptions & clinic bookings
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-emerald-500/25 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#04120e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00e599] transition-all"
                  placeholder="name@system.com"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-emerald-500/60" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-emerald-500/25 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#04120e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00e599] transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-emerald-500/60" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#00e599] hover:bg-[#00c985] text-[#04120e] font-extrabold text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition-all hover-lift cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#04120e]" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#04120e]" />
                <span>Sign In</span>
              </>
            )}
          </button>

          <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
            New to ArogyaCareAI?{' '}
            <Link to="/register" className="text-emerald-600 dark:text-[#00e599] font-bold hover:underline">
              Create an account
            </Link>
          </div>

          {/* Seed accounts reference for testing */}
          <div className="border-t border-slate-100 dark:border-emerald-500/15 mt-5 pt-3.5 text-left bg-slate-50/50 dark:bg-[#04120e]/60 p-3 rounded-xl border">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00e599]" />
              <span>Demo Test Accounts:</span>
            </h4>
            <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <div><strong className="text-slate-700 dark:text-slate-200">Patient:</strong> patient@system.com / password123</div>
              <div><strong className="text-slate-700 dark:text-slate-200">Admin:</strong> admin@system.com / password123</div>
              <div><strong className="text-slate-700 dark:text-slate-200">Doctor:</strong> sarah.cardio@system.com / password123</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
