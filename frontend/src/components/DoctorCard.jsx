import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, ArrowRight, User } from 'lucide-react';

const DEFAULT_DOCTOR_AVATAR = '/doctors/indian_male_doctor.jpg';

const DoctorCard = ({ doctor }) => {
  const [isLiked, setIsLiked] = useState(false);
  const avatarUrl = doctor.image || DEFAULT_DOCTOR_AVATAR;

  return (
    <div className="bg-[#091b16] rounded-2xl border border-emerald-500/15 p-4 shadow-lg shadow-black/30 hover:border-emerald-500/35 hover-lift flex flex-col justify-between transition-all duration-300 group">
      <div>
        {/* Doctor Photo & Badges */}
        <div className="relative mb-3.5 overflow-hidden rounded-xl bg-[#061410] aspect-[4/3] flex items-center justify-center">
          <img
            src={avatarUrl}
            alt={doctor.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_DOCTOR_AVATAR;
            }}
          />

          {/* Availability Pill on top-left of image */}
          <div className="absolute top-2.5 left-2.5 bg-[#051510]/85 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#00e599]">Available Today</span>
          </div>

          {/* Wishlist Heart Icon on top-right */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#051510]/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-red-400 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="space-y-1 mb-3">
          <h3 className="text-base font-extrabold text-white group-hover:text-[#00e599] transition-colors leading-tight">
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-[#00e599]">
            {doctor.specialization}
          </p>
          <p className="text-[11px] text-slate-400">
            {doctor.degree}
          </p>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 pt-1 text-xs text-slate-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white">{doctor.rating || 4.8}</span>
            <span className="text-[11px] text-slate-400">({doctor.reviewsCount || 245} reviews)</span>
          </div>

          {/* Hospital Location */}
          <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
            <MapPin className="w-3 h-3 text-[#00e599] shrink-0" />
            <span className="truncate">{doctor.hospital || 'Fortis Hospital, Delhi'}</span>
          </p>
        </div>
      </div>

      {/* Card Footer: Fees & Book Button */}
      <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between gap-2 mt-2">
        <div>
          <div className="text-base font-extrabold text-white">
            ₹{doctor.fees}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">
            Consultation Fee
          </span>
        </div>

        <Link
          to={`/book/${doctor._id}`}
          className="flex items-center gap-1.5 py-2 px-3.5 bg-[#00e599] hover:bg-[#00c985] text-[#04120e] font-extrabold text-xs rounded-xl shadow-md shadow-[#00e599]/20 hover-lift transition-all"
        >
          <span>Book Appointment</span>
          <ArrowRight className="w-3 h-3 text-[#04120e]" />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
