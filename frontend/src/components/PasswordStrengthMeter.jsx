import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

/**
 * Calculate password strength score and criteria breakdown
 */
export const evaluatePassword = (password = '') => {
  const criteria = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'mixedCase', label: 'Uppercase & lowercase letters', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { id: 'number', label: 'At least one number (0-9)', met: /\d/.test(password) },
    { id: 'symbol', label: 'At least one special symbol (!@#$%)', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const metCount = criteria.filter((c) => c.met).length;

  let level = 'empty';
  let label = 'Enter a password';
  let color = 'bg-slate-300 dark:bg-slate-700';
  let textColor = 'text-slate-400';
  let advice = 'Create a secure password to protect your personal medical data.';

  if (!password) {
    return { score: 0, level, label, color, textColor, advice, criteria, isStrong: false };
  }

  if (password.length < 6) {
    level = 'very-weak';
    label = 'Very Weak (Too Short)';
    color = 'bg-red-500';
    textColor = 'text-red-500';
    advice = 'Password is too short. Use at least 8 characters with numbers and symbols.';
  } else if (metCount <= 1) {
    level = 'weak';
    label = 'Weak — Easy to Guess';
    color = 'bg-red-500';
    textColor = 'text-red-500';
    advice = 'Add uppercase letters, numbers, and symbols to strengthen it.';
  } else if (metCount === 2) {
    level = 'fair';
    label = 'Fair / Easy';
    color = 'bg-amber-500';
    textColor = 'text-amber-500';
    advice = 'Getting better! Add special characters (@, #, $) and numbers.';
  } else if (metCount === 3) {
    level = 'good';
    label = 'Good / Moderate';
    color = 'bg-teal-400';
    textColor = 'text-teal-400';
    advice = 'Good password. Add one more symbol for maximum health record security.';
  } else {
    level = 'strong';
    label = 'Strong & Secure';
    color = 'bg-[#00e599]';
    textColor = 'text-[#00e599]';
    advice = 'Excellent! Your password meets all clinical security standards.';
  }

  return {
    score: metCount,
    level,
    label,
    color,
    textColor,
    advice,
    criteria,
    isStrong: metCount >= 3 && password.length >= 8
  };
};

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  const result = evaluatePassword(password);

  return (
    <div className="space-y-2.5 pt-1 animate-fade-in text-left">
      {/* Segmented Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Password Strength:
          </span>
          <span className={`text-[11px] font-extrabold flex items-center gap-1 ${result.textColor}`}>
            {result.score >= 3 ? (
              <ShieldCheck className="w-3.5 h-3.5 text-[#00e599]" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{result.label}</span>
          </span>
        </div>

        {/* 4 Segment Bars */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          <div className={`rounded-full transition-all duration-300 ${result.score >= 1 ? result.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`rounded-full transition-all duration-300 ${result.score >= 2 ? result.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`rounded-full transition-all duration-300 ${result.score >= 3 ? result.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`rounded-full transition-all duration-300 ${result.score >= 4 ? result.color : 'bg-slate-200 dark:bg-slate-800'}`}></div>
        </div>
      </div>

      {/* Advisory Guidance */}
      <p className={`text-[11px] leading-tight ${result.score >= 3 ? 'text-slate-500 dark:text-slate-400' : 'text-amber-600 dark:text-amber-400'}`}>
        💡 {result.advice}
      </p>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 dark:border-emerald-500/10">
        {result.criteria.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 text-[11px]">
            {item.met ? (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </span>
            ) : (
              <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              </span>
            )}
            <span className={item.met ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-400 dark:text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
