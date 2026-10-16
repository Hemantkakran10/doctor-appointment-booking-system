import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import PasswordStrengthMeter, { evaluatePassword } from '../components/PasswordStrengthMeter';
import {
  Stethoscope,
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Inbox
} from 'lucide-react';

const Register = () => {
  const { register, sendRegisterOtp } = useAuth();
  const { loading, triggerAlert } = useApp();
  const navigate = useNavigate();

  // Step 1: Info Form, Step 2: Email OTP Verification
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Step 1: Submit Details & Request OTP to Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      triggerAlert('Please fill in all required fields', 'error');
      return;
    }

    if (formData.password.length < 6) {
      triggerAlert('Password must be at least 6 characters long', 'error');
      return;
    }

    // Evaluate password strength
    const strength = evaluatePassword(formData.password);
    if (strength.score < 2) {
      triggerAlert('Your password is too weak or easy to guess! Please make it stronger by adding uppercase letters, numbers, and symbols like @ or #.', 'error');
      return;
    }

    try {
      const res = await sendRegisterOtp(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );

      setStep(2);
      setCountdown(60);
      setCanResend(false);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    } catch (err) {
      console.error('Failed to send OTP:', err);
    }
  };

  // OTP Box Navigation & Input Handlers
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const cleanVal = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto-advance to next input box
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP & Create Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      triggerAlert('Please enter the complete 6-digit verification code', 'error');
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        fullOtp
      );
      navigate('/');
    } catch (err) {
      console.error('Registration verification failed:', err);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      const res = await sendRegisterOtp(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      if (res?.previewOtp) {
        setDevOtpHint(res.previewOtp);
      } else {
        setDevOtpHint('');
      }
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-[#071612] border border-slate-100 dark:border-emerald-500/20 p-8 rounded-3xl shadow-xl transition-all duration-200">
        
        {/* Step Indicator Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#00e599] rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-emerald-500/20">
            {step === 1 ? <Stethoscope className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00e599] text-[11px] font-bold tracking-wider uppercase mb-2 border border-emerald-500/20">
            <Sparkles className="w-3 h-3" />
            <span>{step === 1 ? 'Step 1 of 2: Patient Account' : 'Step 2 of 2: Email Verification'}</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {step === 1 ? 'Create Patient Account' : 'Verify Your Email'}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {step === 1
              ? 'Join ArogyaCareAI to access instant AI triage and verified clinic appointments'
              : `Enter the 6-digit verification code sent to ${formData.email}`}
          </p>
        </div>

        {/* STEP 1: Registration Details Form */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleRequestOtp}>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-emerald-500/25 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#04120e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00e599] transition-all"
                    placeholder="e.g. Ramesh Sharma"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-emerald-500/60" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-emerald-500/25 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#04120e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00e599] transition-all"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-emerald-500/60" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Phone Contact *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-emerald-500/25 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#04120e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00e599] transition-all"
                    placeholder="+91 98765 43210"
                  />
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-emerald-500/60" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-emerald-500/25 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#04120e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00e599] transition-all"
                    placeholder="Set a strong password"
                  />
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-emerald-500/60" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Password Strength Meter & Interactive Checklist */}
                <PasswordStrengthMeter password={formData.password} />
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
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Continue to Verification</span>
                  <ArrowRight className="w-4 h-4 text-[#04120e]" />
                </>
              )}
            </button>

            <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 dark:text-[#00e599] font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Email OTP Verification Form */}
        {step === 2 && (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            {/* Live Email Delivery Notice */}
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-center space-y-1.5 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-[#00e599]">
                <Inbox className="w-4 h-4 text-[#00e599]" />
                <span>Verification Code Sent to Email</span>
              </div>
              <p className="text-[12px] text-slate-600 dark:text-slate-300">
                A 6-digit code has been dispatched to <strong className="text-emerald-700 dark:text-[#00e599] font-mono">{formData.email}</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                Please check your inbox (including <strong>Spam</strong> or <strong>Promotions</strong> folders).
              </p>
            </div>

            {/* 6 Digit Input Boxes */}
            <div>
              <label className="block text-xs font-bold text-center text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">
                Enter 6-Digit Email Code
              </label>
              <div className="flex justify-between items-center gap-2 max-w-[320px] mx-auto" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-bold font-mono rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-slate-50 dark:bg-[#04120e] text-slate-900 dark:text-[#00e599] focus:outline-none focus:border-[#00e599] focus:ring-2 focus:ring-[#00e599]/20 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Countdown / Resend Option */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                  canResend
                    ? 'text-emerald-600 dark:text-[#00e599] hover:underline'
                    : 'text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{canResend ? 'Resend Code' : `Resend in ${countdown}s`}</span>
              </button>
            </div>

            {/* Verify & Create Account Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#00e599] hover:bg-[#00c985] text-[#04120e] font-extrabold text-sm rounded-xl shadow-lg shadow-[#00e599]/20 transition-all hover-lift cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#04120e]" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#04120e]" />
                  <span>Verify & Create Account</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00e599]" />
                <span>Protected by 256-bit Health Encryption</span>
              </span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Register;
