import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Users, 
  Calendar, 
  Settings, 
  User, 
  Phone,
  Power,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';

const DoctorDashboard = () => {
  const { API_URL, setLoading, triggerAlert } = useApp();
  const { token, user, setUser } = useAuth();

  // State values
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState({
    appointmentsHandled: 0,
    completedAppointmentsCount: 0,
    totalEarnings: 0
  });

  // Profile Form state
  const [profileData, setProfileData] = useState({
    specialization: '',
    degree: '',
    experience: '',
    fees: '',
    isActive: true
  });
  
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync state with logged-in doctor profile
  useEffect(() => {
    if (user && user.role === 'Doctor') {
      setProfileData({
        specialization: user.specialization || '',
        degree: user.degree || '',
        experience: user.experience || '',
        fees: user.fees || '',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch appointments
      const apptRes = await fetch(`${API_URL}/doctors/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const apptData = await apptRes.json();
      if (apptRes.ok) setAppointments(apptData);

      // 2. Fetch analytics
      const analyticRes = await fetch(`${API_URL}/doctors/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const analyticData = await analyticRes.json();
      if (analyticRes.ok) setAnalytics(analyticData);
    } catch (err) {
      console.error(err);
      triggerAlert('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, API_URL]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch(`${API_URL}/doctors/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();

      if (res.ok) {
        triggerAlert('Profile settings updated successfully!', 'success');
        // Update user state globally in AuthContext
        setUser(data);
      } else {
        triggerAlert(data.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Could not save profile changes', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAction = async (apptId, action) => {
    const confirmMsg = action === 'complete' 
      ? 'Mark this appointment as completed?' 
      : 'Are you sure you want to cancel this appointment?';
      
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const endpoint = action === 'complete' ? 'complete' : 'doctor-cancel';
      const res = await fetch(`${API_URL}/appointments/${apptId}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        triggerAlert(data.message || 'Status updated successfully', 'success');
        fetchData(); // Reload stats and lists
      } else {
        triggerAlert(data.message || 'Status modification failed', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Failed to update appointment state', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* Welcome & Bio */}
      {user && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{user.name}</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">{user.specialization} &bull; {user.degree}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{user.isActive ? 'Active / Booking Open' : 'Inactive / Bookings Suspended'}</span>
          </div>
        </div>
      )}

      {/* Analytics Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-md shadow-blue-500/10 flex items-center gap-5">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-2xl font-black">${analytics.totalEarnings}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex items-center gap-5 transition-colors duration-200">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Appointments Handled</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{analytics.appointmentsHandled}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex items-center gap-5 transition-colors duration-200">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Completed Sessions</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{analytics.completedAppointmentsCount}</h3>
          </div>
        </div>
      </div>

      {/* Profile Control & Appointment Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings / Profile edit panel & Change Password */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm h-fit transition-colors duration-200">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 font-sans">Profile Settings</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Consultation Fee ($)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={profileData.fees}
                  onChange={(e) => setProfileData({ ...profileData, fees: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Degree Title</label>
                <input
                  type="text"
                  required
                  value={profileData.degree}
                  onChange={(e) => setProfileData({ ...profileData, degree: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>

              {/* Inactive / Active Toggle */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">Account Open for Bookings</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Toggle offline status instantly</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileData({ ...profileData, isActive: !profileData.isActive })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    profileData.isActive ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${
                      profileData.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover-lift"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </form>
          </div>
          <ChangePasswordForm />
        </div>

        {/* Appointment Checklist */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm h-fit transition-colors duration-200">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6">Upcoming Appointments List</h2>

          {appointments.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto pr-1">
              {appointments.map((appt) => (
                <div key={appt._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {appt.userId ? appt.userId.name : 'Unregistered Patient'}
                      </span>
                      {appt.cancelled ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded border border-transparent dark:border-red-800/40">
                          Cancelled
                        </span>
                      ) : appt.isCompleted ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800/40">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-transparent dark:border-amber-800/40">
                          Scheduled
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{appt.slotDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        Time: <span className="font-semibold text-slate-700 dark:text-slate-300">{appt.slotTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        Phone: <span className="font-semibold text-slate-700 dark:text-slate-300">{appt.userId ? appt.userId.phone : 'N/A'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        Fee: <span className="font-semibold text-slate-700 dark:text-slate-300">${appt.amount}</span>
                      </span>
                    </div>
                  </div>

                  {!appt.cancelled && !appt.isCompleted && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(appt._id, 'complete')}
                        className="flex items-center gap-1 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-lg transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                      <button
                        onClick={() => handleAction(appt._id, 'cancel')}
                        className="flex items-center gap-1 py-1.5 px-3 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs rounded-lg transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 italic text-xs">
              No appointments scheduled for you.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
