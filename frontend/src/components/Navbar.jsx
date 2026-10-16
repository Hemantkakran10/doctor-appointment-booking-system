import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Stethoscope,
  LogOut,
  Calendar,
  LayoutDashboard,
  Sun,
  Moon,
  Sparkles,
  Scan,
  User,
  ChevronDown,
  Shield,
  Globe,
  Check,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t, supportedLanguages, currentLanguageObj } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-emerald-500/15 shadow-lg shadow-black/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00e599] group-hover:scale-105 transition-transform shadow-sm shadow-[#00e599]/10">
              <Stethoscope className="h-5 w-5 text-[#00e599]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
              ArogyaCare<span className="text-[#00c985] dark:text-[#00e599]">AI</span>
            </span>
          </Link>

          {/* Center Navigation Pills matching Figma */}
          <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full shadow-inner navbar-nav-capsule">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
                isActive('/')
                  ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/25 font-bold'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-500/15'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{t('nav.findDoctors')}</span>
            </Link>

            <Link
              to="/ai-symptoms"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
                isActive('/ai-symptoms')
                  ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/25 font-bold'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-500/15'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('nav.aiSymptomChecker')}</span>
            </Link>

            <Link
              to="/ai-scanner"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
                isActive('/ai-scanner')
                  ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/25 font-bold'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-500/15'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>{t('nav.prescriptionOCR')}</span>
            </Link>

            {(!user || user.role === 'Patient') && (
              <Link
                to="/appointments"
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
                  isActive('/appointments')
                    ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/25 font-bold'
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-500/15'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('nav.myBookings')}</span>
              </Link>
            )}

            {user && user.role === 'Doctor' && (
              <Link
                to="/doctor-dashboard"
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
                  isActive('/doctor-dashboard')
                    ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/25 font-bold'
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-500/15'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t('nav.doctorPanel')}</span>
              </Link>
            )}

            {user && user.role === 'Admin' && (
              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
                  isActive('/admin-dashboard')
                    ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/25 font-bold'
                    : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-emerald-500/15'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('nav.adminPanel')}</span>
              </Link>
            )}
          </div>

          {/* Right Controls: Language Selector, Theme Toggle & User Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown);
                  setShowDropdown(false);
                }}
                title={t('nav.selectLanguage')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-emerald-500/25 bg-slate-100 dark:bg-[#071612] hover:bg-slate-200 dark:hover:bg-[#0c241e] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00c985] dark:hover:text-[#00e599] transition-all hover-lift shadow-xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#00c985] dark:text-[#00e599]" />
                <span className="text-xs font-bold">{currentLanguageObj.flag}</span>
                <span className="hidden sm:inline text-xs">{currentLanguageObj.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#091b16] border border-slate-200 dark:border-emerald-500/25 rounded-2xl shadow-2xl p-1.5 z-50 animate-slide-up">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-emerald-500/15 mb-1 text-[10px] uppercase font-bold text-[#00c985] dark:text-[#00e599] tracking-wider">
                    {t('nav.selectLanguage')}
                  </div>
                  <div className="space-y-1">
                    {supportedLanguages.map((lang) => {
                      const isSelected = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors font-medium text-left ${
                            isSelected
                              ? 'bg-emerald-500/15 text-[#00c985] dark:text-[#00e599] font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-500/10 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.native}</span>
                            {lang.native !== lang.label && (
                              <span className="text-[10px] text-slate-400">({lang.label})</span>
                            )}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#00c985] dark:text-[#00e599]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              id="dark-mode-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full border border-slate-200 dark:border-emerald-500/20 bg-slate-100 dark:bg-[#071612] text-slate-600 dark:text-slate-300 hover:text-[#00c985] dark:hover:text-[#00e599] hover:border-emerald-500/40 transition-all flex items-center justify-center group"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Profile Chip: Compact on mobile, full on desktop */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowLangDropdown(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 sm:pr-3 rounded-full border border-slate-200 dark:border-emerald-500/25 bg-slate-100 dark:bg-[#071612] hover:bg-slate-200 dark:hover:bg-[#0c241e] transition-all hover-lift shadow-sm cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#00c985] dark:text-[#00e599] font-bold text-xs overflow-hidden shrink-0">
                  {user && user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-[#00c985] dark:text-[#00e599]" />
                  )}
                </div>
                {/* Text hidden on small screens so it never overflows */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate max-w-[110px]">
                    {user ? user.name : 'Patient User'}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#00c985] dark:text-[#00e599] bg-emerald-500/15 px-1.5 py-0.2 rounded-full w-fit">
                    {user ? user.role : 'PATIENT'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#091b16] border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-emerald-500/10 mb-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user ? user.name : 'Patient User'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user ? user.email : 'patient@system.com'}</p>
                    <span className="inline-block mt-1 text-[9px] font-extrabold uppercase tracking-wider text-[#00c985] dark:text-[#00e599] bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {user ? user.role : 'PATIENT'}
                    </span>
                  </div>

                  {user ? (
                    <div className="space-y-1">
                      <Link
                        to={user.role === 'Doctor' ? '/doctor-dashboard' : user.role === 'Admin' ? '/admin-dashboard' : '/appointments'}
                        onClick={() => setShowDropdown(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-white hover:text-[#00c985] dark:hover:text-[#00e599] hover:bg-slate-100 dark:hover:bg-emerald-500/10 rounded-xl transition-colors font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-[#00c985] dark:text-[#00e599]" />
                        <span>{user.role === 'Patient' ? t('nav.patientProfile') : 'Dashboard'}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.logOut')}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        to="/login"
                        onClick={() => setShowDropdown(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#00c985] dark:text-[#00e599] hover:bg-slate-100 dark:hover:bg-emerald-500/10 rounded-xl transition-colors font-medium"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{t('nav.signIn')}</span>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setShowDropdown(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-emerald-500/10 rounded-xl transition-colors font-medium"
                      >
                        <span>{t('nav.createAccount')}</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setShowDropdown(false);
                setShowLangDropdown(false);
              }}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 rounded-full border border-slate-200 dark:border-emerald-500/25 bg-slate-100 dark:bg-[#071612] text-slate-700 dark:text-slate-200 hover:text-[#00c985] dark:hover:text-[#00e599] transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#00e599]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-500/20 bg-[#061410]/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-slide-up shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* User Info Card in mobile menu */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#00e599] font-bold text-xs overflow-hidden shrink-0">
                {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#00e599] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                {user.role}
              </span>
            </div>
          )}

          {/* Nav links */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive('/') ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/30' : 'text-slate-200 hover:bg-emerald-500/15'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>{t('nav.findDoctors')}</span>
            </Link>

            <Link
              to="/ai-symptoms"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive('/ai-symptoms') ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/30' : 'text-slate-200 hover:bg-emerald-500/15'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('nav.aiSymptomChecker')}</span>
            </Link>

            <Link
              to="/ai-scanner"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive('/ai-scanner') ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/30' : 'text-slate-200 hover:bg-emerald-500/15'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>{t('nav.prescriptionOCR')}</span>
            </Link>

            {(!user || user.role === 'Patient') && (
              <Link
                to="/appointments"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/appointments') ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/30' : 'text-slate-200 hover:bg-emerald-500/15'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{t('nav.myBookings')}</span>
              </Link>
            )}

            {user && user.role === 'Doctor' && (
              <Link
                to="/doctor-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/doctor-dashboard') ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/30' : 'text-slate-200 hover:bg-emerald-500/15'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('nav.doctorPanel')}</span>
              </Link>
            )}

            {user && user.role === 'Admin' && (
              <Link
                to="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/admin-dashboard') ? 'bg-[#00e599] text-[#04120e] shadow-md shadow-[#00e599]/30' : 'text-slate-200 hover:bg-emerald-500/15'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('nav.adminPanel')}</span>
              </Link>
            )}
          </div>

          {/* Auth Actions in Mobile Menu */}
          <div className="pt-2 border-t border-emerald-500/15">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/25 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('nav.logOut')}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#00e599] text-xs font-bold"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-[#00e599] text-[#04120e] text-xs font-bold shadow-md shadow-[#00e599]/30"
                >
                  {t('nav.createAccount')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
