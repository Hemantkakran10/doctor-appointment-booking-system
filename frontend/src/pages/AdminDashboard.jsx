import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AddDoctorForm from '../components/AddDoctorForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { 
  Users, 
  Stethoscope, 
  CalendarCheck, 
  DollarSign, 
  History, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const { API_URL, setLoading, triggerAlert } = useApp();
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    systemRevenue: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('Patients');
  const [registeredUsers, setRegisteredUsers] = useState({ patients: [], doctors: [] });

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/admin/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchRegisteredUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRegisteredUsers(data);
      }
    } catch (err) {
      console.error('Error fetching registered users:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchTransactions(), fetchRegisteredUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [token, API_URL]);


  const getStatusBadge = (appt) => {
    if (appt.cancelled) {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded border border-transparent dark:border-red-800/40">
          Cancelled
        </span>
      );
    }
    if (appt.isCompleted) {
      return (
        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800/40">
          Completed
        </span>
      );
    }
    return (
      <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-transparent dark:border-amber-800/40">
        Pending
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
      {/* Welcome Block */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Administrator Console</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Global configuration, doctor credentials, and system metrics</p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 hover-lift transition-colors duration-200">
          <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Doctors</p>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stats.totalDoctors}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 hover-lift transition-colors duration-200">
          <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Registered Patients</p>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stats.totalPatients}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4 hover-lift transition-colors duration-200">
          <div className="w-11 h-11 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stats.totalAppointments}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md shadow-blue-500/10 flex items-center gap-4 hover-lift">
          <div className="w-11 h-11 bg-white/20 text-white rounded-xl flex items-center justify-center">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              Revenue <TrendingUp className="w-3.5 h-3.5" />
            </p>
            <h3 className="text-xl font-black">${stats.systemRevenue}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Doctor Panel & Global Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form to manually create verified profiles & Change Password */}
        <div className="lg:col-span-1 space-y-6">
          <AddDoctorForm onDoctorAdded={loadData} />
          <ChangePasswordForm />
        </div>

        {/* Right Column: Live transactions list across all networks */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Global Appointment Logs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Patient</th>
                  <th className="pb-3 font-semibold">Doctor (Specialty)</th>
                  <th className="pb-3 font-semibold">Slot Date / Time</th>
                  <th className="pb-3 font-semibold">Fee</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {transactions.length > 0 ? (
                  transactions.map((appt) => (
                    <tr key={appt._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5">
                        <span className="block font-bold text-slate-800 dark:text-slate-100">
                          {appt.userId ? appt.userId.name : 'Unknown Patient'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {appt.userId ? appt.userId.email : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="block font-semibold text-slate-700 dark:text-slate-200">
                          {appt.docId ? appt.docId.name : 'Deleted Doctor'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700 inline-block mt-0.5">
                          {appt.docId ? appt.docId.specialization : 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 font-medium text-slate-600 dark:text-slate-400">
                        <span className="block text-slate-700 dark:text-slate-300">{appt.slotDate}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{appt.slotTime}</span>
                      </td>
                      <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">${appt.amount}</td>
                      <td className="py-3.5 text-right">{getStatusBadge(appt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 dark:text-slate-500 italic">
                      No transaction records stored in system database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Registered Users Directory */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Registered Users Directory</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Manage patients and verified clinical networks</p>
            </div>
          </div>

          <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('Patients')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'Patients'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Patients ({registeredUsers.patients.length})
            </button>
            <button
              onClick={() => setActiveTab('Doctors')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'Doctors'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Doctors ({registeredUsers.doctors.length})
            </button>
          </div>
        </div>

        {activeTab === 'Patients' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Phone Number</th>
                  <th className="pb-3 font-semibold text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {registeredUsers.patients.length > 0 ? (
                  registeredUsers.patients.map((pat) => (
                    <tr key={pat._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">{pat.name}</td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">{pat.email}</td>
                      <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300">{pat.phone}</td>
                      <td className="py-3.5 text-right text-slate-400 dark:text-slate-500">
                        {new Date(pat.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 dark:text-slate-500 italic">
                      No registered patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Specialization (Degree)</th>
                  <th className="pb-3 font-semibold">Experience / Fee</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {registeredUsers.doctors.length > 0 ? (
                  registeredUsers.doctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">
                        <div>
                          <span>{doc.name}</span>
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">{doc.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                          {doc.specialization}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">{doc.degree}</span>
                      </td>
                      <td className="py-3.5 font-medium text-slate-600 dark:text-slate-400">
                        <div>
                          <span className="text-slate-700 dark:text-slate-300">{doc.experience} Years Exp</span>
                          <span className="block text-slate-800 dark:text-slate-100 font-bold mt-0.5">${doc.fees} Consultation</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          doc.isActive 
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-transparent dark:border-emerald-800/40' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent dark:border-slate-700'
                        }`}>
                          {doc.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-slate-400 dark:text-slate-500">
                        {new Date(doc.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 dark:text-slate-500 italic">
                      No verified doctors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

};

export default AdminDashboard;
