import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import SlotPicker from '../components/SlotPicker';
import { Calendar as CalendarIcon, User, DollarSign, Award, Briefcase, ChevronLeft, CalendarCheck } from 'lucide-react';

const BookingPanel = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const { API_URL, setLoading, triggerAlert } = useApp();
  const { token, user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Set minimum date picker target to today
  const todayDateStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/doctors/${docId}`);
        const data = await res.json();
        if (res.ok) {
          setDoctor(data);
        } else {
          triggerAlert(data.message || 'Doctor not found', 'error');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        triggerAlert('Failed to load doctor profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [docId, API_URL]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) {
      triggerAlert('Please select both a date and a time slot', 'error');
      return;
    }

    if (!token) {
      triggerAlert('Please login to book appointments', 'error');
      navigate('/login');
      return;
    }

    if (user && user.role !== 'Patient') {
      triggerAlert('Only patient accounts can book appointments', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          docId,
          slotDate: selectedDate,
          slotTime: selectedSlot
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Double booking occurred or slot taken');
      }

      triggerAlert('Appointment booked successfully!', 'success');
      navigate('/appointments');
    } catch (err) {
      triggerAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(''); // Reset slot selection when date changes
  };

  if (!doctor) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back CTA */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold uppercase tracking-wider mb-6 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Doctors</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        {/* Doctor Summary Section */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#061410] shrink-0 shadow-md">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/doctors/indian_male_doctor.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-400">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl font-extrabold text-white">{doctor.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-[#00e599] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {doctor.specialization}
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium mb-3">{doctor.degree} • {doctor.hospital || 'Fortis Hospital, Delhi'}</p>
            
            <div className="flex gap-4 text-xs font-medium text-slate-300 flex-wrap">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {doctor.experience} years experience
              </span>
              <span className="flex items-center gap-0.5 font-bold text-white">
                ₹{doctor.fees} Consultation Fee
              </span>
            </div>
          </div>
        </div>

        {/* Date / Time Slot Picker Form */}
        <form onSubmit={handleBookingSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-[#00e599]" />
                Choose Date
              </label>
              <input
                type="date"
                min={todayDateStr}
                required
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2.5 border border-emerald-500/20 rounded-xl bg-[#061410] text-white focus:outline-none focus:border-[#00e599] text-sm transition-all"
              />
            </div>
            
            <div className="flex items-end">
              <div className="bg-[#061410] p-4 rounded-xl border border-emerald-500/15 w-full">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Session Duration</div>
                <div className="text-sm font-semibold text-white mt-1">30 - 45 Minutes Consultation</div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <SlotPicker
              selectedDate={selectedDate}
              slotsBooked={doctor.slots_booked}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>

          {/* Submission Info Bar */}
          <div className="pt-6 border-t border-emerald-500/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount Due</p>
              <p className="text-2xl font-extrabold text-[#00e599]">₹{doctor.fees}</p>
            </div>
            
            <button
              type="submit"
              disabled={!selectedDate || !selectedSlot}
              className={`flex items-center justify-center gap-1.5 py-3 px-6 text-sm font-extrabold rounded-xl transition-all shadow-md ${
                selectedDate && selectedSlot
                  ? 'bg-[#00e599] hover:bg-[#00c985] text-[#04120e] shadow-lg shadow-[#00e599]/20 hover-lift'
                  : 'bg-[#071612] text-slate-500 border border-emerald-500/10 cursor-not-allowed shadow-none'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Confirm Appointment Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPanel;
