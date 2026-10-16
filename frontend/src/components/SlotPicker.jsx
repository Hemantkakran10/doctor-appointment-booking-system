import React from 'react';

const ALL_TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM'
];

const SlotPicker = ({ selectedDate, slotsBooked, selectedSlot, onSelectSlot }) => {
  // Convert booked slots map/object to safe list for the selected date
  const bookedForSelectedDate = (slotsBooked && slotsBooked[selectedDate]) || [];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Available Time Slots</h3>
      
      {selectedDate ? (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {ALL_TIME_SLOTS.map((time) => {
            const isBooked = bookedForSelectedDate.includes(time);
            const isSelected = selectedSlot === time;

            return (
              <button
                key={time}
                type="button"
                disabled={isBooked}
                onClick={() => onSelectSlot(time)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all duration-200 ${
                  isBooked
                    ? 'bg-slate-100 dark:bg-[#061410] border-slate-200 dark:border-emerald-500/10 text-slate-400 dark:text-slate-600 cursor-not-allowed line-through'
                    : isSelected
                    ? 'bg-[#00e599] border-[#00e599] text-[#04120e] font-bold shadow-md shadow-[#00e599]/25'
                    : 'bg-white dark:bg-[#071612] border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-200 hover:border-[#00e599] hover:text-[#00e599] hover-lift'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500 italic">Please select a date to view available time slots.</p>
      )}
    </div>
  );
};

export default SlotPicker;
