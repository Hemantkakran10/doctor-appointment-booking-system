import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ChangePasswordForm from '../components/ChangePasswordForm';
import {
  Calendar,
  User,
  Phone,
  Mail,
  Clock,
  CalendarX,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Globe,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_AVATARS = [
  { label: 'Patient 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { label: 'Patient 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { label: 'Patient 3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { label: 'Patient 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { label: 'Patient 5', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
];

const PatientDashboard = () => {
  const { API_URL, setLoading, triggerAlert } = useApp();
  const { token, user, updateProfile } = useAuth();
  const { language, setLanguage, t, supportedLanguages, currentLanguageObj } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const fileInputRef = useRef(null);

  // Sync edit form state when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/appointments/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
      } else {
        triggerAlert(data.message || 'Failed to load bookings', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/appointments/${apptId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        triggerAlert('Appointment cancelled successfully', 'success');
        fetchAppointments(); // Refresh list
      } else {
        triggerAlert(data.message || 'Failed to cancel appointment', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Could not cancel appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token, API_URL]);

  /**
   * Compress and convert user image file to optimized Base64
   */
  const compressImage = (file, maxWidth = 350, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const elem = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(elem.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerAlert('Please select an image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      triggerAlert('Image size exceeds 6MB limit', 'error');
      return;
    }

    try {
      setUploadingPhoto(true);
      const base64Data = await compressImage(file);
      await updateProfile({ image: base64Data });
      setShowPresets(false);
    } catch (err) {
      console.error('Image upload failed:', err);
      triggerAlert('Failed to update photo. Please try another image.', 'error');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = async (presetUrl) => {
    try {
      setUploadingPhoto(true);
      await updateProfile({ image: presetUrl });
      setShowPresets(false);
    } catch (err) {
      console.error('Preset update failed:', err);
      triggerAlert('Failed to update avatar', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    try {
      setUploadingPhoto(true);
      await updateProfile({ image: '' });
      setShowPresets(false);
    } catch (err) {
      console.error('Photo remove failed:', err);
      triggerAlert('Failed to remove photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      triggerAlert('Name cannot be empty', 'error');
      return;
    }
    try {
      await updateProfile({ name: editName, phone: editPhone });
      setIsEditingInfo(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const getStatusBadge = (appt) => {
    if (appt.cancelled) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full border border-transparent dark:border-red-800/40">
          Cancelled
        </span>
      );
    }
    if (appt.isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-transparent dark:border-emerald-800/40">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full border border-transparent dark:border-amber-800/40">
        Pending
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* Patient Profile Card with Interactive Photo Upload */}
      {user && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Avatar with Camera Hover Overlay + Name/Role */}
            <div className="flex items-center gap-5">
              {/* Avatar Container */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/30 flex items-center justify-center shadow-md">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <User className="w-10 h-10" />
                      <span className="text-[10px] font-bold uppercase mt-1">Photo</span>
                    </div>
                  )}

                  {/* Upload Spinner Overlay */}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                      <div className="w-6 h-6 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Quick Camera Trigger Button */}
                <button
                  type="button"
                  title="Upload profile photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 bg-[#00e599] hover:bg-[#00c985] text-[#04120e] rounded-xl shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Hidden File Picker Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* User Details / Edit Mode */}
              <div className="space-y-1">
                {!isEditingInfo ? (
                  <>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                        {user.name}
                      </h1>
                      <button
                        type="button"
                        onClick={() => setIsEditingInfo(true)}
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-[#00e599] p-1 rounded-md transition-colors"
                        title="Edit profile info"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#00e599] px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        {t('patient.verifiedPatient')}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        ArogyaCareAI ID: #{user._id ? user._id.slice(-6).toUpperCase() : 'PT-894'}
                      </span>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveInfo} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your Full Name"
                      className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-[#00e599]"
                    />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Phone number"
                      className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-[#00e599]"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="submit"
                        className="p-1.5 bg-[#00e599] text-[#04120e] rounded-lg hover:bg-[#00c985] text-xs font-bold"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingInfo(false)}
                        className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 text-xs"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}

                {/* Photo Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-[#00e599] hover:underline cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{t('patient.uploadPhoto')}</span>
                  </button>

                  <span className="text-slate-300 dark:text-slate-700">•</span>

                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>{t('patient.chooseAvatar')}</span>
                  </button>

                  {user.image && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t('patient.remove')}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Contact Information Pill */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 w-full md:w-auto">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00e599]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{t('patient.emailAddress')}</span>
                  <span className="truncate max-w-[180px] block">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00e599]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{t('patient.phoneContact')}</span>
                  <span>{user.phone || t('patient.notAdded')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Avatars Drawer */}
          {showPresets && (
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00e599]" />
                  {t('patient.selectAvatarTitle')}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPresets(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  {t('patient.close')}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="w-12 h-12 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#00e599] transition-all hover-lift shadow-xs"
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 px-3 border border-dashed border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-600 dark:text-[#00e599] hover:bg-emerald-500/10 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('patient.uploadCustom')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Language Preference Selector for Patient */}
      <div className="bg-white dark:bg-[#091b16] rounded-3xl border border-slate-200 dark:border-emerald-500/20 p-6 sm:p-7 shadow-xl transition-colors duration-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-emerald-500/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00e599] shadow-sm">
              <Globe className="w-5 h-5 text-[#00e599]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t('patient.languageTitle')}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-[#00e599] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {currentLanguageObj.flag} • {currentLanguageObj.native}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('patient.languageSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Selectable Language Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {supportedLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  triggerAlert(`${t('patient.languageTitle')}: ${lang.native} (${lang.label})`, 'success');
                }}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-[#07241a] border-emerald-500 dark:border-[#00e599] shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-[#061410] border-slate-200 dark:border-emerald-500/15 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-[#092018]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 select-none border transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-800 dark:text-[#00e599] border-emerald-500/40 shadow-xs'
                      : 'bg-slate-200/60 dark:bg-emerald-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-emerald-500/20'
                  }`}
                >
                  {lang.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {lang.native}
                      {lang.native !== lang.label && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">({lang.label})</span>
                      )}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#00e599] text-[#04120e] flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {lang.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Bookings & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-700 dark:text-slate-200">
              {t('patient.myAppointments')}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00e599] border border-emerald-500/20">
              {appointments.length} {t('patient.total')}
            </span>
          </div>

          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {appt.docId ? appt.docId.name : 'Unknown Doctor'}
                        </h3>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          {appt.docId ? appt.docId.specialization : 'General'}
                        </span>
                      </div>
                      {getStatusBadge(appt)}
                    </div>

                    <div className="space-y-2 border-t border-slate-50 dark:border-slate-800 pt-3 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="font-medium">{t('patient.date')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{appt.slotDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="font-medium">{t('patient.time')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{appt.slotTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-400 dark:text-slate-500">₹</span>
                        <span className="font-medium">{t('patient.paidFee')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">₹{appt.amount}</span>
                      </div>
                    </div>
                  </div>

                  {!appt.cancelled && !appt.isCompleted && (
                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
                      <button
                        onClick={() => handleCancelAppointment(appt._id)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 font-medium text-xs rounded-lg transition-all cursor-pointer"
                      >
                        <CalendarX className="w-3.5 h-3.5" />
                        <span>{t('patient.cancelAppt')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
              <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('patient.noAppointments')}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('patient.noAppointmentsDesc')}</p>
            </div>
          )}
        </div>

        {/* Change Password Panel */}
        <div className="lg:col-span-1">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
