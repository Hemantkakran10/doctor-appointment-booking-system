import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { KeyRound, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const ChangePasswordForm = () => {
  const { API_URL, triggerAlert } = useApp();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleShow = (field) => {
    setShowPass((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return triggerAlert('Please fill out all password fields', 'error');
    }

    if (newPassword.length < 6) {
      return triggerAlert('New password must be at least 6 characters long', 'error');
    }

    if (newPassword !== confirmPassword) {
      return triggerAlert('New password and confirmation do not match', 'error');
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        triggerAlert('Password updated successfully!', 'success');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        triggerAlert(data.message || 'Failed to update password', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Network error, failed to update password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-2 mb-6">
        <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Security Credentials</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPass.current ? 'text' : 'password'}
              name="currentPassword"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-3 pr-10 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="button"
              onClick={() => toggleShow('current')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPass.new ? 'text' : 'password'}
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              className="w-full pl-3 pr-10 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:border-[#00e599] dark:focus:border-[#00e599] transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="button"
              onClick={() => toggleShow('new')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={formData.newPassword} />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPass.confirm ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full pl-3 pr-10 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="button"
              onClick={() => toggleShow('confirm')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-800 dark:bg-blue-600 hover:bg-slate-900 dark:hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-slate-800/10 transition-all hover-lift"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
